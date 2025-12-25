import React, { useState,useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { authState } = useContext(AuthContext);

  return authState.isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;