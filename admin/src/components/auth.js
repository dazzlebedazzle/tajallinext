import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const initialAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    authLoading: true,
  };
  const [authState, setAuthState] = useState(initialAuthState);

  // Redirect to login when token expires (401)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const isLoginRequest = error.config?.url?.includes('/api/user/login');
          if (!isLoginRequest) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, { email, password }, {
        withCredentials: true,
      });
      const {id,  token } = response.data;

   
      localStorage.setItem('role',response.data.role);
      const role =localStorage.getItem('role');
      console.log(role);
      if(role==='admin'){
        localStorage.setItem('user', JSON.stringify({ id }));
     
        localStorage.setItem('token', token);
      setAuthState({
        isAuthenticated: true,
        user: { id },
        token,
        authLoading: false,
        
      });
    }
    else{
      localStorage.removeItem('role');
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        authLoading: false,
      });
      throw new Error('This account is not an admin. Log in with an admin account.');
    }
    } catch (error) {
      console.error('Login failed:', error);
      // Pass a readable reason back to the Login page instead of failing silently
      if (!error.response) {
        throw new Error(
          error.message?.includes('not an admin')
            ? error.message
            : `Cannot reach the server at ${process.env.REACT_APP_API_URL}. Is it running?`
        );
      }
      const serverMessage = error.response.data?.message || '';
      throw new Error(
        /invall?id credential/i.test(serverMessage)
          ? 'Wrong email or password.'
          : serverMessage || `Login failed (error ${error.response.status}).`
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      authLoading: false,
    });
    // triggerLogoutEvent();
    navigate('/login'); // Redirect to login page after logout
  };

  // const logoutListeners = [];

  // const addLogoutListener = (listener) => {
  //   logoutListeners.push(listener);
  // };

  // const removeLogoutListener = (listener) => {
  //   const index = logoutListeners.indexOf(listener);
  //   if (index !== -1) {
  //     logoutListeners.splice(index, 1);
  //   }
  // };

  // const triggerLogoutEvent = () => {
  //   logoutListeners.forEach(listener => listener());
  // };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      authLoading: false,
    });
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          authLoading: false,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        authLoading: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- handleLogout is stable, init only once
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create and export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
