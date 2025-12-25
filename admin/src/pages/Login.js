import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth'; // Import login function from auth.js
import './Login.css';

import logotazalli from '../assets/logotazalli.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authState, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call login function from auth.js
     
      
      navigate('/dashboard');  // Redirect to dashboard or desired page
      }
    catch (err) {
      setError('Invalid email or password');
    }
  };

  // If the user is authenticated, redirect to the Dashboard
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className='containfill'>
      
     <div className='img_div'>
     <img src={logotazalli} alt="Description of the image" />
     </div>
   
    <div className="login-container">
      <h2>Tajalli Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
