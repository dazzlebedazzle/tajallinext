import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import './Order.css'; // Import your CSS file
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth'; 

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to manage selected order
  const [showDetailsPopup, setShowDetailsPopup] = useState(false); // State to manage popup visibility
     const { authState, logout } =useContext(AuthContext);
  const [showCancelPopup, setShowCancelPopup] = useState(false); // State for cancel popup
  const [orderToCancel, setOrderToCancel] = useState(null); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
          }
        });
        console.log(response);
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {

     setShowCancelPopup(true);
    setTimeout(() => {
      setShowCancelPopup(false);
    }, 2000);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/cancel`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
        }
      });

      // Remove the canceled order from the state
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error canceling order:', error.response ? error.response.data : error.message);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedOrder(null);
  };

if (authState.authLoading) {
    return <Loader />; // or any other loading indicator
  }
  

  return  authState.isAuthenticated ?  (
    <div>
      <Sidebar />
      <div className="order-container">
        <h2>Orders Management</h2>
        <div className="order-list">
          {orders.slice().reverse().map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-info">
                <h3>Order ID: {order._id}</h3>
                <p>Order Status: {order.orderStatus}</p>
                <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                <h4>Order Items:</h4>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <p>Product Name: {item.productName}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <button
                className="view-details-button"
                onClick={() => handleViewDetails(order)}
              >
                View Details
              </button>
              <button
                className="cancel-order-button"
                onClick={() => cancelOrder(order._id)}
                disabled={order.orderStatus === 'Canceled'}
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
        {showCancelPopup && (
          <div className="cancel-popup-overlay">
            <div className="cancel-popup-box">
             
              <h2>Cancel Order</h2>
              <p>kindly use shiprocket Dashboard to cancel order</p>
             
            </div>
          </div>
        )}
        {showDetailsPopup && selectedOrder && (
          <div className="popup-overlay">
            <div className="popup-box">
              <button className="close-icon" onClick={closeDetailsPopup}>
                &times;
              </button>
              <h2>Order Details</h2>
              <p><strong>Channel Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
              <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <h4>Order Items:</h4>
              {selectedOrder.orderItems.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <p><strong>Product Name:</strong> {item.productName}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> Rs{item.price.toFixed(2)}</p>
                </div>
              ))}
              <h4>Shipping Address:</h4>
              <p><strong>Name:</strong> {selectedOrder.shippingAddress.name}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
              <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
              <p><strong>State:</strong> {selectedOrder.shippingAddress.state}</p>
              <p><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
              <p><strong>Postal Code:</strong> {selectedOrder.shippingAddress.postalCode}</p>
              <p><strong>Phone No.:</strong> {selectedOrder.shippingAddress.phone}</p>
              <p><strong>Order ID (Shiprocket):</strong> {selectedOrder.shiprocket_order_id}</p>
              <p><strong>Payment ID:</strong> {selectedOrder.payment_id}</p>
              <p><strong>Shipment ID:</strong> {selectedOrder.shipment_id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  ): (
    <Navigate to="/login" />
  );
};

export default Order;

