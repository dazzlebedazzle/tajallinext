import React, { useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext } from '../components/auth';

const Home = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard'); // Redirect to Dashboard if authenticated
    } else {
      navigate('/login'); // Redirect to Login if not authenticated
    }
  }, [authState, navigate]);

  return <div>Loading...</div>; // Optional: Add a loading indicator
};

export default Home;
