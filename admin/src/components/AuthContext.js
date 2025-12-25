import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/check-auth`, {
          withCredentials: true,
        });
        if (response.data.isAuthenticated) {
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, { email, password }, {
        withCredentials: true,
      });
      console.log(response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('role',response.data.role);
      const role=localStorage.getItem('role');
      console.log(role);

      console.log('token', response.data.token);
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
       
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user/logout`, {}, {
        withCredentials: true,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
