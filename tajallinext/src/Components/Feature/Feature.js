// src/Component/InfoSection.js

import React from 'react';
import Image from 'next/image';
import './Feature.css';
import quality from '../../../public/assets/100_quality.gif';
import award from '../../../public/assets/Award.gif';

const InfoSection = () => {
  const infoItems = [
    {
      icon: quality,
      text: '100% Quality Guaranteed'
    },
    {
      icon: award,
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
              unoptimized
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
