'use client';

import React, { useState } from 'react';
import Link from "next/link" 
import axios from 'axios';
import './ForgotPassword.css';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
   // New state to track if the email was sent
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/user/forgot-password-token`, { email });
      setMessage(response.data.message);
      setError('');
      setEmailSent(true); // Set emailSent to true when the email is successfully sent
    } catch (err) {
      setError('Failed to send reset password link. Please try again.');
      setMessage('');
      setEmailSent(false); // Set emailSent to false if there's an error
    }
  };

const closePopup = () => {
    setEmailSent(false);
  };

  return (
    <div className='forgot-password-main'>
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>Please enter your email address to receive a password reset link</p>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
        
        <div className="links">
          <Link href="/Login"><span>Remembered your password? </span>Login</Link>
        </div>
       
      </div>
      {emailSent && <div className='for_popup'>
          <p>Email sent kindly check your gmail</p>
          <button onClick={closePopup}>Close</button>
        </div>}
    </div>
  );
};

export default ForgotPassword;

