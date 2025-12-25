import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CreateOffer from './pages/CreateOffer';
import Order from './pages/Order';
import Home from './pages/home'; // Import the Home component
import './App.css'; // Optional: for global styles
import AuthProvider from './components/auth';
import Categories from './pages/Categories';
import PolicyOfTajalli from './pages/policyOfTajalli';
import SendCoupon from './pages/sendcoupon';
import CreateBanner from './pages/CreateBanner'
import CreateOfferForm from './pages/CreateOfferForm';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order" element={<Order />} />
          <Route path="/policyoftajalli" element={<PolicyOfTajalli />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/CreateOffer" element={<CreateOfferForm />} />
          <Route path="/" element={<Home />} /> 
          <Route path="/SendCoupon" element={<SendCoupon/>} /> 
          <Route path="/CreateBanner" element={<CreateBanner/>} /> 
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect any unknown routes to Home */}
        </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;
