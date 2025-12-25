// src/Component/InfoSection.js

import React from 'react';
import { FaShippingFast, FaMoneyCheckAlt, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import Image from 'next/image';
import './Feature.css';
import shippingIcon from '../../../public/assets/Cash_on_delivery.gif'
import payIcon from '../../../public/assets/Pay_on_delivery.gif'
import qualityIcon from '../../../public/assets/100_quality.gif'
import rewardIcon from '../../../public/assets/Award.gif'


const InfoSection = () => {
  const infoItems = [
    {
      icon: shippingIcon,
      text: 'Free Shipping On Orders Above ₹3000'
    },
    {
      icon: payIcon,
      text: 'Pay On Delivery'
    },
    {
      icon: qualityIcon,
      text: '100% Quality Guaranteed'
    },
    {
      icon: rewardIcon,
      text: 'Reward Points On Every Purchase'
    }
  ];

  return (
   <div className='info-section_main'>
    <h2> Feature That Makes Us Different</h2>
     <div className="info-section">
        
        {infoItems.map((item, index) => (
          <React.Fragment key={index}>
            <div className="info-item">
              <div className="info-icon"><Image src={item.icon} alt='feature icons'  width="600" height="400" 
              priority={false}
              quality={20} 
              ></Image>
              </div>
              <div className="info-text">{item.text}</div>
            </div>
            {index < infoItems.length - 1 && <div className="info-divider"></div>}
          </React.Fragment>
        ))}
      </div>
   </div>
  );
};

export default InfoSection;
