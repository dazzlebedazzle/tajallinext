'use client';

import { useState, useEffect } from 'react';
import './OrderDetails.css';
import axios from 'axios';
import TrackOrderModal from '@/Components/TrackOrderModal/TrackOrderModal';
import Image from 'next/image';
import Loader from '../Loader/Loader';

const OrderDetails = ({ order, onClose }) => {
    const [productImage, setProductImage] = useState(null);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProductImage(order.productId);
    }, [order.productId]);

    const fetchProductImage = async (productId) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.get(`${apiUrl}/api/product/${productId}`);
            setProductImage(response.data.images[0]);
        } catch (error) {
            console.error('Error fetching product image:', error);
        }
    };

    const handleTrackOrder = async (trackingIdentifier, type) => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const url = `${apiUrl}/api/shipment/track-shipment/${trackingIdentifier}/${type}`;
            const response = await axios.get(url);
            setTrackingInfo(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error tracking order:', error);
            setLoading(false);
        }
    };

    const renderTimeline = (activities) => {
        if (!activities || activities.length === 0) {
            return <p>No tracking activities available.</p>;
        }

        return (
            <div className="timeline">
                {activities.map((activity, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-content">
                            <p><strong>Status:</strong> {activity.status}</p>
                            <p><strong>Activity:</strong> {activity.activity}</p>
                            <p><strong>Date:</strong> {new Date(activity.date).toLocaleString()}</p>
                            <p><strong>Location:</strong> {activity.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="order-details">
            {showTrackModal && (
                <TrackOrderModal
                    onClose={() => setShowTrackModal(false)}
                    onTrack={handleTrackOrder}
                    order={order}
                />
            )}

            <button className="close-button" onClick={onClose} aria-label="Close order details">
                ×
            </button>
            
            <h2>Order Details</h2>
            
            <div className="order-info-grid">
                <div className="order-info-section">
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                    <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>AWB ID:</strong> {order.awb_code}</p>
                    <p><strong>Shipping Order ID:</strong> {order.shipment_id}</p>
                </div>
                
                <div className="customer-info-section">
                    <p><strong>Customer Name:</strong> {order.shippingAddress.name}</p>
                    <p><strong>Billing Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.pincode}</p>
                    <p><strong>Email:</strong> {order.shippingAddress.email}</p>
                    <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                </div>
                
                <div className="payment-info-section">
                    <p><strong>Payment Method:</strong> {order.payment_method}</p>
                    <p><strong>Payment ID:</strong> {order.payment_id}</p>
                    <p><strong>Subtotal:</strong> ₹{order.price}</p>
                </div>
            </div>

            <div className="product-track-section">
                {productImage && (
                    <Image width={500} height={500} 
                        src={productImage} 
                        alt="Product" 
                        className="product-image" 
                        loading="lazy"
                    />
                )}
                <button 
                    className="track-order-button" 
                    onClick={() => setShowTrackModal(true)}
                    disabled={loading}
                >
                    {loading ? <Loader/> : 'Track Order'}
                </button>
            </div>

            {loading && <div className="loading-indicator">Loading tracking information...</div>}
            
            {trackingInfo && (
                <div className="tracking-results">
                    {Object.keys(trackingInfo).map(key => (
                        <div key={key} className="tracking-result-card">
                            <h3>Tracking Details for {key}</h3>
                            <div className="tracking-status">
                                <p><strong>Track Status:</strong> {trackingInfo[key].tracking_data.track_status}</p>
                                <p><strong>Shipment Status:</strong> {trackingInfo[key].tracking_data.shipment_status}</p>
                                {trackingInfo[key].tracking_data.error && (
                                    <p className="error-message"><strong>Error:</strong> {trackingInfo[key].tracking_data.error}</p>
                                )}
                                <p><strong>Track URL:</strong> 
                                    <a href={trackingInfo[key].tracking_data.track_url} target="_blank" rel="noopener noreferrer">
                                        View Tracking
                                    </a>
                                </p>
                            </div>
                            
                            {trackingInfo[key].tracking_data.shipment_track && (
                                <div className="shipment-track-details">
                                    <h4>Shipment Track Details</h4>
                                    {trackingInfo[key].tracking_data.shipment_track.map((track, index) => (
                                        <div key={index} className="track-detail">
                                            <p><strong>Current Status:</strong> {track.current_status}</p>
                                        </div>
                                    ))}
                                    {renderTimeline(trackingInfo[key].shipment_track_activities)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderDetails;