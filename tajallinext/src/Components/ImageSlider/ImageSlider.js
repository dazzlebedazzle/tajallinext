import React from 'react';
import Image from 'next/image';
import './ImageSlider.css';
import imageUrls from '../../../public/assets/Data/logo_img';


const SimpleSlider = () => {

  
  
  return (
    <div className="company_main">
   <h2>ALSO AVAILABLE ON</h2>
        <div className='company_sub'>
        {imageUrls.map((image , index) => (
          <div className='company_logo' key={index} title={image.name}>
          <a href={image.imageref} target='blank'>
          <Image src={image.imageUrl} loading="lazy" alt={image.name.replace('/upload/', '/upload/c_scale,w_900/f_webp/q_auto/').replace(/\.(jpg|jpeg|png)$/, '.webp')}
            key={image.category} 
            className="category-item1" 
             width="600" height="400"
            />
          </a>
            
         </div>
        ))}
        </div>
   
    </div>
  );
};

export default SimpleSlider;

