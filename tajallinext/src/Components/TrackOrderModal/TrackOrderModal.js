'use client';

import { useState, useEffect } from 'react';
import './TrackOrderModal.css';

const TrackOrderModal = ({ onClose, onTrack, order }) => {
    const [trackingIdentifier, setTrackingIdentifier] = useState(order.awb_code);
    const [trackingType, setTrackingType] = useState('awb');

    useEffect(() => {
        setTrackingIdentifier(trackingType === 'awb' ? order.awb_code : order.shipment_id);
    }, [trackingType, order.awb_code, order.shipment_id]);

    const handleTrackOrder = () => {
        onTrack(trackingIdentifier, trackingType);
        onClose();
    };

    return (
        <div className="track-order-modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <span className="close-icon">×</span>
                </button>
                <h2>Track Order</h2>
                <div className="track-option">
                    <label>
                        <input 
                            type="radio" 
                            value="awb" 
                            checked={trackingType === 'awb'} 
                            onChange={() => setTrackingType('awb')} 
                        />
                        Track by AWB
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="orderId" 
                            checked={trackingType === 'orderId'} 
                            onChange={() => setTrackingType('orderId')} 
                        />
                        Track by Shipment ID
                    </label>
                </div>
                <input
                    type="text"
                    value={trackingIdentifier}
                    readOnly
                    placeholder={trackingType === 'awb' ? 'AWB Code' : 'Shipment ID'}
                    className="tracking-input"
                />
                <button className="track-button" onClick={handleTrackOrder}>Track</button>
            </div>
        </div>
    );
};

export default TrackOrderModal;