'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Card.css'; // Use normal CSS instead of CSS Modules
import vegIcon from '../../../public/assets/pure-veg-icon.webp';
// import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useCart } from '@/Context/CartContext';
import cartGif from '../../../public/assets/Addtocart.gif';

const Card = ({ product }) => {
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const { addToCart } = useCart();
  const router = useRouter(); // Use useRouter instead of useNavigate

  useEffect(() => {
    if (product.weights && product.weights.length > 0) {
      setSelectedWeight(product.weights[0]);
    }
  }, [product.weights]);

  const handleWeightChange = (event) => {
    setSelectedWeight(parseFloat(event.target.value));
  };

  const productImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0].replace('/upload/', '/upload/c_scale,w_400/f_webp/q_60/').replace(/\.(jpg|jpeg|png)$/, '.webp')
    : '';

  const calculatedPrice = selectedWeight ? Math.round((product.price * selectedWeight) / 1000) : 0;

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');

    // Uncomment if login check is required
    // if (!token) {
    //   setPopupType('login');
    //   return;
    // }

    const cartItemId = `${product._id}${selectedWeight}`;
    const productWithDetails = {
      cartId: cartItemId,
      productId: product._id,
      title: product.title,
      image: product.images[0],
      category: product.category,
      weight: selectedWeight,
      totalPrice: calculatedPrice,
      quantity: 1,
      slug:product.slug
    };
    console.log(productWithDetails,"pr")
    addToCart(productWithDetails);
    setPopupType('success');
    setTimeout(() => setPopupType(null), 2000);
  };


  const handleWishlistToggle = () => {
    alert('Add to wishlist functionality is coming soon, you can use the cart until then. Thank you!');
    setIsWishlisted(!isWishlisted);
  };

  const closePopup = () => setPopupType(null);

  const goToLogin = () => {
    router.push('/Login');
    closePopup();
  };

  return (
    <div className="card_shop">
      <div className="vegicon">
        <Image src={vegIcon} alt="veg" width={40} height={40} priority />
      </div>
      <Link href={`/product/${product.slug}`} className="card-link">
        <Image className='cardmain-image' src={productImage} alt={product.title} width={400} height={300} priority />
      </Link>
      <div className="two">
        <h3>{product.category}</h3>
        <div className="wishlist">
          <Link href={`/product/${product.slug}`} className="card-link">
            <h2>{product.title}</h2>
          </Link>
          <div className="wishlist-icon" onClick={handleWishlistToggle}>
            {isWishlisted ? "" : ""}
          </div>
        </div>
        <p className="about-product">{product.aboutProduct}</p>
        <div className="weightperg">
          <p className="pricefont">Rs: <strong>{calculatedPrice}/-</strong></p>
          <span>Rs: <s>{calculatedPrice + 100}</s></span>
          <select
            className="weight"
            id={`weight-select-${product._id}`}
            value={selectedWeight || ''}
            onChange={handleWeightChange}
          >
            {product.weights && product.weights.map(weight => (
              <option key={weight} value={weight}>{weight}gm</option>
            ))}
          </select>
        </div>
        <button className="add" 
        onClick={handleAddToCart}
        >Add To Cart</button>
      </div>

      {/* Popup for success */}
      {popupType === 'success' && (
        <div className="popup-overlay">
          <div className="popup-content">
            <Image src={cartGif} alt="add to cart" width={400} height={300} priority />
            <p>Item added to cart!</p>
            <button className="popup-close" onClick={closePopup}>×</button>
          </div>
        </div>
      )}

      {/* Popup for login required */}
      {popupType === 'login' && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Please login or signup to add products to your cart.</p>
            <button className="popup-button" onClick={goToLogin}>Go to Login</button>
            <button className="popup-close" onClick={closePopup}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
