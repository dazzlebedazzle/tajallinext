import React from 'react';
import './CardN.css';
import Link from 'next/link';
import Image from 'next/image';

const CardN = ({ img,discountPercent,productId }) => {
  return (
    <div className='offer1'>
      <div className='image-container'>
        {/* <img src={off} alt="Discount" id='off' /> */}
        {/* <div className='overlay-text'><span className='per_off'>{discountPercent}%</span> <br></br>Off</div> */}
        <Image src={img} alt="Product" id='straw'  width="600" height="400" />
      </div>
      <button><Link href={`/product/${productId}`}  style={{ textDecoration: 'none' , border:'none', color:'white'}}>ORDER NOW</Link></button>
    </div>
  );
}

export default CardN;
