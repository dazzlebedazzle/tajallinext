import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const initialAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
      authLoading,
  };
  const [authState, setAuthState] = useState(initialAuthState);


  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log(userStr,token)
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
        handleLogout(); // Clear invalid user data if parsing fails
      }
    }
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
        
      });
    }
    else{
      alert("You are not an Authorized User");
    }

      navigate('/');
     // Redirect to homepage after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
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
    setAuthState(initialAuthState);
    

   
 };

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
