'use client';
import React from 'react';
import './RegistrationSuccess.css';

const RegistrationSuccess = () => {
  return (
    <div className="registration-success-main">
      <div className="registration-success-container">
        <div className="success-content">
          <div className="check-container">
            <div className="check-mark"></div>
          </div>
          <h1>Registration Successful!</h1>
          <p>Your account has been created successfully. You can now log in to your account.</p>
          <a href="Login" className="login-button" style={{textDecoration:'none'}}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
