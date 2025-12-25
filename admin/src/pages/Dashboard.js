import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiSearch } from 'react-icons/fi'; // Import search icon from react-icons/fi
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import './Dashboard.css'; // Import CSS file for styling
import { AuthContext } from '../components/auth'; // Import logout function from auth.js

const Dashboard = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { authState, logout } = useContext(AuthContext);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Replace with your backend endpoint
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/allproduct`); 
        const products = response.data;
        console.log(response);

        // Sort products by number of purchases and select the top 4
        const sortedProducts = products
          .sort((a, b) => b.numberOfPurchases - a.numberOfPurchases)
          .slice(0, 4);

        setPurchasedProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  // Filter products based on search query
  const filteredProducts = purchasedProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for the chart
  const data = {
    labels: filteredProducts.map((product) => product.title), // Use 'title' or any other field for the name
    datasets: [
      {
        label: 'Number of Purchases',
        data: filteredProducts.map((product) => product.numberOfPurchases),
        backgroundColor: '#723207',
        borderColor: '#723207',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Call logout function from auth.js
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return authState.isAuthenticated ? (
    <div className="dashboard">
      <Sidebar />
      <div className="main1-content">
        <div className="top-bar">
          <div className="toggle-button">
            {/* Toggle button code goes here (if applicable) */}
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </div>
          <button className="logout-btn" onClick={() => setShowLogoutPopup(true)}>Sign Out</button>
          {showLogoutPopup && (
            <div className="popup-container">
              <div className="popup-box">
                <p>Are you sure you want to sign out?</p>
                <button onClick={handleLogout}>Yes</button>
                <button onClick={() => setShowLogoutPopup(false)}>No</button>
              </div>
            </div>
          )}
        </div>
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <div className="chart-container">
            <Bar data={data} options={options} />
          </div>
          {/* Display product delivery status */}
          <div className="product-status">
            <h3>Product Delivery Status</h3>
            <ul>
              {filteredProducts.map((product, index) => (
                <li key={index} className={`product-item`}>
                  <img src={product.images[0]} alt={product.title} className="product-image" />
                  <div className="product-info">
                    <span className="product-title"> Product Name:<strong>{product.title}</strong></span>
                    <span className="product-purchases">Purchases: {product.numberOfPurchases}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Dashboard;
