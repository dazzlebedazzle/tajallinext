'use client';

import { FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import './OrderSuccessPage.css';
import { useOrder } from '@/Context/OrderContext';
import Image from 'next/image';
import Loader from '@/Components/Loader/Loader';

const OrderSuccessPage = () => {
  const router = useRouter();
  const { 
    orderState: {
      orderDetails, shippingDetails, payment_id
    } 
  } = useOrder();


  const handleViewAllOrders = () => {
    router.push('/My-Order');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

   // ✅ Prevents errors if orderDetails is null or empty
   if (!orderDetails || orderDetails.length === 0) {
    return <Loader/>;
  }


  return (
    <div className="order-success-page">
      <div className="order-success-content">
        <div className="success-checkmark">
          <FaCheckCircle className="checkmark-icon" />
        </div>
        <h1 className="success-heading">Order Successful!</h1>
        <p className="success-message">Thank you for your purchase. Your order will arrive on time.</p>

        <div className="order-details_1">
          <h2>Your Order Details</h2>
          <div className="order-card">
            <div className="order-confirmation-container">
              <div className="order-summary">
                <h2>Order Summary</h2>
                {orderDetails.map((product, index) => (
                  <div key={index} className="product-details">
                    <Image width={500} height={500} src={product.productImg} alt={product.title} className="product-image" />
                    <div className="product-info">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-weight">Weight: {product.weight}g</p>
                      <p className="product-price">Price: ₹{product.price}</p>
                      <p className="product-quantity">Quantity: {product.quantity}</p>
                      <p className="product-subtotal">Subtotal: ₹{product.price * product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-info">
              <h3 className="order-id">Order ID: {shippingDetails.order_id}</h3>
              <p className="payment-id"><strong>Payment ID:</strong> {payment_id}</p>
              <p className="order-date"><strong>Order Date:</strong> {shippingDetails.order_date}</p>
              <p className="shipping-address">
                <strong>Shipping Address:</strong> <br />
                {shippingDetails.billing_address}, <br />
                {shippingDetails.billing_city}, {shippingDetails.billing_state}, <br />
                {shippingDetails.billing_country}, {shippingDetails.billing_pincode}
              </p>
            </div>
            <div className="order-success-actions">
              <button className="view-orders-btn" onClick={handleViewAllOrders}>View All Orders</button>
              <button className="continue-shopping-btn" onClick={handleContinueShopping}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default OrderSuccessPage;
