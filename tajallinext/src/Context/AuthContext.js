'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const initialAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };
  const [authState, setAuthState] = useState(initialAuthState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          setAuthState({
            isAuthenticated: true,
            user,
            token,
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      }
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, userData);
      const { id, firstname, lastname, email, mobile, role, token, profileImage,referredBy,discount,referralCode,referralLink } = response.data;
      console.log(response.data,"details")

      localStorage.setItem('user', JSON.stringify({ id, firstname, lastname, email, mobile, role ,referredBy,discount,referralCode,referralLink}));
      localStorage.setItem('profileImage', profileImage);
      localStorage.setItem('token', token);

      setAuthState({
        isAuthenticated: true,
        user: { id, firstname, lastname, email, mobile, role, profileImage ,referredBy,discount,referralCode,referralLink},
        token,
      });
      if(userData){
        router.push('/')
      }
    } catch (error) {
      console.error('Login failed:', error);
      error(error?.response?.data?.message || error.message || 'Login failed');
    }
  };

  const verifOtp = async (userData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verifyOTP`, userData);
      const { id, firstname, lastname, email, mobile, role, token, profileImage } = response.data;
      
      localStorage.setItem('user', JSON.stringify({ id, firstname, lastname, email, mobile, role }));
      localStorage.setItem('token', token);
      localStorage.setItem('profileImage', profileImage);

      setAuthState({ isAuthenticated: true, user: { id, firstname, lastname, email, mobile, role, profileImage }, token });
      router.push('/');
    } catch (error) {
      console.log("Invalid OTP")
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
    router.push('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, verifOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;