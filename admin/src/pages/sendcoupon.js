import React, { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import './SendCoupons.css'; // Ensure you create a corresponding CSS file for styling
import Sidebar from  '../components/Sidebar';
import Loader from '../components/Loader';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth'; 

const SendCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authState, logout } =useContext(AuthContext);

  useEffect(() => {
    // Fetch all available coupons for selection
    const fetchCoupons = async () => {
      try {const accessToken = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/coupon/`, {headers: {
            Authorization: `Bearer ${accessToken}`,}
          });
        console.log(response);
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  const handleSendCoupons = async () => {
    if (!selectedCoupon) {
      setMessage('Please select a coupon.');
      return;
    }

    setIsLoading(true);
    try {
        const accessToken = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/send-emails`, { headers: {
        Authorization: `Bearer ${accessToken}`,
      },
        couponId: selectedCoupon,
      });
      setMessage('Coupons sent successfully!');
    } catch (error) {
      setMessage('Error sending coupons.');
    } finally {
      setIsLoading(false);
    }
  };

    if (authState.authLoading) {
    return <Loader />; // or any other loading indicator
  }
  

  return  authState.isAuthenticated ?  (
    <div>
      <Sidebar/>
      <div className="admin-panel">
      <h1>Send Coupon to All Users</h1>
      <div className="send-coupons-container">
        <label>Select Coupon:</label>
        <select
          value={selectedCoupon}
          onChange={(e) => setSelectedCoupon(e.target.value)}
        >
          <option value="">Select a coupon</option>
          {coupons.map((coupon) => (
            <option key={coupon._id} value={coupon._id}>
              {coupon.name} - {coupon.discount}% off
            </option>
          ))}
        </select>
        <button onClick={handleSendCoupons} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Coupon'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
    </div>
  ): (
    <Navigate to="/login" />
  );
};

export default SendCoupons;
