import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './CreateOffer.css';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineClose, AiOutlineInfoCircle, AiOutlineLink } from 'react-icons/ai';
import Loader from '../components/Loader';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateOffer = () => {
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [showDeleteCouponPopup, setShowDeleteCouponPopup] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [showProductDetailsPopup, setShowProductDetailsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authState, logout } = useContext(AuthContext);
  const [isOneTime, setIsOneTime] = useState(false);
  const [showDirectLinkPopup, setShowDirectLinkPopup] = useState(false);
  const [directLink, setDirectLink] = useState('');
  const [directLinkLoading, setDirectLinkLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [couponStatus, setCouponStatus] = useState(null);
  const [productUrl, setProductUrl] = useState('');
  const [showDiscountLinkPopup, setShowDiscountLinkPopup] = useState(false);
  const [discountLink, setDiscountLink] = useState('');
  const [discountLinkLoading, setDiscountLinkLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/offer/`);
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/coupon/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
  

    fetchOffers();
    fetchCoupons();
  }, []);

  const handleCreateOffer = async (e) => {
    e.preventDefault();
       setLoading(true); 

    const offerData = {
      name: e.target.name.value,
      discountPercentage: e.target.discountPercentage.value,
      productId: e.target.productId.value,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/offer/offers`, offerData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (e.target.productImage.files[0]) {
        const formData = new FormData();
        formData.append('image', e.target.productImage.files[0]);

        await axios.put(`${process.env.REACT_APP_API_URL}/api/offer/${response.data._id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setOffers([...offers, response.data]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
     finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleDeleteOffer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/offer/offers/${currentOffer._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOffers(offers.filter((offer) => offer._id !== currentOffer._id));
      setShowDeletePopup(false);
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleEditOffer = async (e) => {
    e.preventDefault();
    const offerData = {
      name: e.target.name.value,
      discountPercentage: e.target.discountPercentage.value,
      productId: e.target.productId.value,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/offer/${currentOffer._id}`, offerData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (e.target.productImage.files[0]) {
        const formData = new FormData();
        formData.append('image', e.target.productImage.files[0]);

        await axios.put(`${process.env.REACT_APP_API_URL}/api/offer/${currentOffer._id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const updatedOffers = offers.map((offer) =>
        offer._id === currentOffer._id ? response.data : offer
      );
      setOffers(updatedOffers);
      setShowPopup(false);
    } catch (error) {
      console.error('Error editing offer:', error);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const newCoupon = {
      name: e.target.couponCode.value,
      discount: e.target.discountPercentage.value,
      expiry: e.target.expiryDate.value,
      isOneTime: isOneTime,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/coupon/`, newCoupon, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Coupon created:", response.data);

      setCoupons([...coupons, response.data]);
      setShowCouponPopup(false);

     

    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/coupon/${couponId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      setShowDeleteCouponPopup(false);
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const fetchProductDetails = async (productId) => {
    if (!productId) {
      setProductDetails(null);
      return;
    }

    setProductLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data) {
        setProductDetails(response.data);
        toast.success('Product found!');
      }
    } catch (error) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        if (response.data) {
          setProductDetails(response.data);
          toast.success('Product found!');
        }
      } catch (secondError) {
        console.error('Error fetching product details:', secondError);
        toast.error('Product not found. Please check the Product ID.');
        setProductDetails(null);
      }
    } finally {
      setProductLoading(false);
    }
  };

  const fetchProductUrl = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/product/${productId}/url`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data && response.data.url) {
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product URL:', error);
      return null;
    }
  };

  const handleProductIdChange = async (e) => {
    const productId = e.target.value.trim();
    if (productId) {
      setProductLoading(true);
      try {
        // First fetch product details
        await fetchProductDetails(productId);
        
        // Then fetch product URL
        const url = await fetchProductUrl(productId);
        if (url) {
          setProductUrl(url);
          console.log('Product URL:', url);
        } else {
          // If URL fetch fails, construct default URL
          setProductUrl(`https://tajalli.co.in/product/${productId}`);
        }
      } catch (error) {
        console.error('Error in product ID change:', error);
        setProductUrl('');
      } finally {
        setProductLoading(false);
      }
    } else {
      setProductDetails(null);
      setProductUrl('');
    }
  };

  const searchProducts = async (query) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setProductSearchResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    }
  };

  const checkCouponExists = async (couponName) => {
    try {
      // Check against existing coupons in the state
      const exists = coupons.some(coupon => 
        coupon.name.toLowerCase() === couponName.toLowerCase()
      );
      
      if (exists) {
        return true;
      }

      // If not found in state, try to fetch latest coupons
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/coupon/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update coupons list
      setCoupons(response.data);

      // Check again with updated list
      return response.data.some(coupon => 
        coupon.name.toLowerCase() === couponName.toLowerCase()
      );
    } catch (error) {
      console.error('Error checking coupon:', error);
      return false;
    }
  };

  const handleDirectLink = async (e) => {
    e.preventDefault();
    setDirectLinkLoading(true);
    setCouponStatus(null);
    
    try {
      const formData = new FormData(e.target);
      const productId = formData.get('productId').trim();
      const couponName = formData.get('couponName').trim();
      const discount = formData.get('discountPercentage');
      const expiry = formData.get('expiryDate');

      if (!productId || !couponName) {
        toast.error('Product ID and Coupon Name are required');
        setDirectLinkLoading(false);
        return;
      }

      if (!productDetails) {
        toast.error('Please enter a valid Product ID');
        setDirectLinkLoading(false);
        return;
      }

      // Check if coupon already exists
      setIsCheckingCoupon(true);
      const couponExists = await checkCouponExists(couponName);
      setIsCheckingCoupon(false);

      if (couponExists) {
        toast.error('This coupon name already exists. Please use a different name.');
        setDirectLinkLoading(false);
        return;
      }

      // Create the coupon data
      const couponData = {
        name: couponName,
        discount: parseInt(discount) || 0,
        expiry: expiry || null,
        isOneTime: true,
        productId: productId,
        productName: productDetails.name,
        autoApply: true
      };

      // Make the API call to create coupon
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/coupon/`,
        couponData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to generate coupon code');
      }

      // Get the coupon code from the response
      const couponCode = response.data.code || response.data.name;
      if (!couponCode) {
        throw new Error('No coupon code received from server');
      }

      // Generate the shareable link with the correct format
      const shareableLink = `https://tajalli.co.in/product/slug/${productDetails.slug}?coupon=${couponCode}`;

      // Update state with the new link
      setDirectLink(shareableLink);
      
      // Add the new coupon to the coupons list
      setCoupons(prevCoupons => [...prevCoupons, response.data]);
      
      // Show success message
      toast.success('Direct link generated successfully!');
      setCouponStatus('success');

      // Log the generated link for debugging
      console.log('Generated link:', shareableLink);
      console.log('Coupon response:', response.data);
    } catch (error) {
      console.error('Error generating direct link:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to generate direct link';
      toast.error(errorMessage);
      setCouponStatus('error');
    } finally {
      setDirectLinkLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!directLink) {
      toast.error('No link to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(directLink);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link. Please try copying manually.');
    }
  };

  const handleProductSelect = (product) => {
    setProductName(product.name);
    setShowProductSearch(false);
  };

  // Modified validateCouponName function
  const validateCouponName = (name) => {
    // Remove spaces and special characters, convert to uppercase
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    // Limit to 20 characters
    return cleanName.slice(0, 20);
  };

  const handleDiscountLink = async (e) => {
    e.preventDefault();
    setDirectLinkLoading(true);
    setCouponStatus(null);
    
    try {
      const formData = new FormData(e.target);
      const productId = formData.get('productId').trim();
      const discountAmount = parseInt(formData.get('discountAmount'));
      const expiry = formData.get('expiryDate');
      const couponName = `FIXED${discountAmount}`;

      if (!productId || !discountAmount || !expiry) {
        toast.error('Product ID, Discount Amount, and Expiry Date are required');
        setDirectLinkLoading(false);
        return;
      }

      if (!productDetails) {
        toast.error('Please enter a valid Product ID and wait for details to load.');
        setDirectLinkLoading(false);
        return;
      }

      // We don't strictly require productUrl for link construction now, but keep fetching for reference.

      // Check if coupon already exists
      setIsCheckingCoupon(true);
      const couponExists = await checkCouponExists(couponName);
      setIsCheckingCoupon(false);

      if (couponExists) {
        toast.error('A discount link for this amount already exists. Please try a different amount.');
        setDirectLinkLoading(false);
        return;
      }

      // Create the coupon data
      const couponData = {
        name: couponName,
        discount: discountAmount,
        expiry: expiry,
        isOneTime: true,
        productId: productId,
        productName: productDetails.name,
        productUrl: productUrl, // Keep fetched product URL in coupon data for potential future use
        autoApply: true,
        isFixedAmount: true
      };

      // Make the API call to create coupon
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/coupon/`,
        couponData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to generate discount link');
      }

      // Get the coupon code from the response
      const couponCode = response.data.code || response.data.name;
      if (!couponCode) {
        throw new Error('No coupon code received from server');
      }

      // Generate the shareable link using the standard format for tajalli.co.in
      const shareableLink = `https://www.tajalli.co.in/product/${productDetails.slug}?coupon=${couponCode}&autoApply=true`;

      // Update state with the new link
      setDiscountLink(shareableLink);
      
      // Add the new coupon to the coupons list
      setCoupons(prevCoupons => [...prevCoupons, response.data]);
      
      // Show success message
      toast.success('Discount link generated successfully!');
      setCouponStatus('success');

      // Log the generated link for debugging
      console.log('Generated discount link:', shareableLink);
      console.log('Coupon response:', response.data);
    } catch (error) {
      console.error('Error generating discount link:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to generate discount link';
      toast.error(errorMessage);
      setCouponStatus('error');
    } finally {
      setDirectLinkLoading(false);
    }
  };

  // Filter coupons to show only fixed amount discount links
  const fixedDiscountCoupons = coupons.filter(coupon => coupon.isFixedAmount);

  if (authState.authLoading) {
    return <Loader />; // or any other loading indicator
  }
  

  return  authState.isAuthenticated ?  (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Sidebar />
      <div className="create-offer-page">
        <div className="main-content">
          <div className="button-container">
            <button className="create-offer-btn" onClick={() => setShowPopup(true)}>
              <AiOutlinePlus /> Create New Offer
            </button>
            <button className="create-coupon-btn" onClick={() => setShowCouponPopup(true)}>
              <AiOutlinePlus /> Create Coupon
            </button>
            <button className="direct-link-btn" onClick={() => setShowDirectLinkPopup(true)}>
              <AiOutlineLink /> Direct Link
            </button>
            <button className="discount-link-btn" onClick={() => setShowDiscountLinkPopup(true)}>
               Generate a Discount Link
            </button>
          </div>
          <h1>Offers</h1>
          <div className="offers-list">
            {offers.map((offer) => (
              <div key={offer._id} className="offer-card">
                <img src={offer.image} alt="Product"  />
                <div className="offer-details">
                  <p>{offer.discountPercentage}% off</p>
                  <p>Product Title: {offer.productId?.title || 'No title'}</p>
                  <p>Product Category: {offer.productId?.category || 'No category'}</p>
                  <p>Product Price: {offer.productId?.price || 'No price'}</p>
                  
                  <button onClick={() => { setCurrentOffer(offer); setShowDeletePopup(true); }}>
                    <AiOutlineDelete /> Delete
                  </button>
                  <button onClick={() => { fetchProductDetails(offer.productId._id); }}>
                  View Details
                </button>
                </div>
              </div>
            ))}
          </div>

          <h1>Coupons</h1>
          <div className="coupons-list">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="coupon-card">
                <p>Coupon code: <strong>{coupon.code}</strong> <br />
                  Name: <strong>{coupon.name}</strong> <br />
                  Discount: <strong>{coupon.discount}% off</strong><br />
                  Expires on: <strong>{new Date(coupon.expiry).toLocaleDateString()}</strong><br />
                  Created on: <strong>{new Date(coupon.createdAt).toLocaleDateString()}</strong><br />
                  One time use: <strong>{coupon.isOneTime ? "Yes" : "No"}</strong>
                </p>
                <button onClick={() => { setCurrentCoupon(coupon); setShowDeleteCouponPopup(true); }} className='delte'>
                  <AiOutlineDelete /> Delete
                </button>
              </div>
            ))}
          </div>

          <h1>Fixed Discount Links</h1>
          <div className="coupons-list">
            {fixedDiscountCoupons.map((coupon) => (
              <div key={coupon._id} className="coupon-card">
                <p><strong>Coupon Name:</strong> {coupon.name}</p>
                <p><strong>Discount Amount:</strong> ₹{coupon.discount}</p>
                <p><strong>Product:</strong> {coupon.productName} ({coupon.productId})</p>
                <p><strong>Expires On:</strong> {new Date(coupon.expiry).toLocaleDateString()}</p>
                <p><strong>Link:</strong> <a href={`https://www.tajalli.co.in/product/${coupon.productId}?coupon=${coupon.name}&autoApply=true`} target="_blank" rel="noopener noreferrer">{`https://www.tajalli.co.in/product/${coupon.productId}?coupon=${coupon.name}&autoApply=true`}</a></p>
                <button onClick={() => { handleDeleteCoupon(coupon._id); }} className='delte'>
                  <AiOutlineDelete /> Delete
                </button>
              </div>
            ))}
          </div>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <button className="close-icon" onClick={() => setShowPopup(false)}>
                  <AiOutlineClose />
                </button>
                <form onSubmit={currentOffer ? handleEditOffer : handleCreateOffer}>
                  <h2>{currentOffer ? 'Edit Offer' : 'Create New Offer'}</h2>
                  <input type="text" name="name" defaultValue={currentOffer ? currentOffer.name : ''} placeholder="Offer Name" required />
                  <input type="number" name="discountPercentage" defaultValue={currentOffer ? currentOffer.discountPercentage : ''} placeholder="Discount Percentage" required />
                  <input type="text" name="productId" defaultValue={currentOffer ? currentOffer.productId : ''} placeholder="Product ID" required />
                  <input type="file" name="productImage" />
                  <button type="submit">{currentOffer ? 'Update Offer' : 'Create Offer'}</button>
                </form>
              </div>
            </div>
          )}

          {showDeletePopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <p>Are you sure you want to delete this offer?</p>
                <button onClick={handleDeleteOffer}>Yes, Delete</button>
                <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
              </div>
            </div>
          )}

          {showCouponPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <button className="close-icon" onClick={() => setShowCouponPopup(false)}>
                  <AiOutlineClose />
                </button>
                <form onSubmit={handleCreateCoupon}>
                  <h2>Create New Coupon</h2>
                  <input type="text" name="couponCode" placeholder="Coupon Code" required />
                  <input type="number" name="discountPercentage" placeholder="Discount Percentage" required />
                  <input type="date" name="expiryDate" placeholder="Expiry Date" required />
                  <label style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    name="isOneTime"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    style={{margin: '0px', width:"30px" }}
                  />
                  One-time use coupon
                </label>
                  <button type="submit">Create Coupon</button>
                      {loading && <Loader />} {/* Show loader if loading */}
                </form>
              </div>
            </div>
          )}

          {showDeleteCouponPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <p>Are you sure you want to delete this coupon?</p>
                <button onClick={() => handleDeleteCoupon(currentCoupon._id)}>Yes, Delete</button>
                <button onClick={() => setShowDeleteCouponPopup(false)}>Cancel</button>
              </div>
            </div>
          )}

          {showProductDetailsPopup && productDetails && (
          <div className="popup-overlay">
            <div className="popup-box">
              <button className="close-icon" onClick={() => setShowProductDetailsPopup(false)}>
                <AiOutlineClose />
              </button>
              <h2>Product Details</h2>
              <p><strong>Title:</strong> {productDetails.title}</p>
              <p><strong>Category:</strong> {productDetails.category}</p>
              <p><strong>Price:</strong> {productDetails.price}</p>
              <p><strong>Description:</strong> {productDetails.description}</p>
              <img src={productDetails.images[0]} alt={productDetails.title} />
            </div>
          </div>
        )}

          {showDirectLinkPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <button className="close-icon" onClick={() => {
                  setShowDirectLinkPopup(false);
                  setDirectLink('');
                  setProductDetails(null);
                  setCouponStatus(null);
                }}>
                  <AiOutlineClose />
                </button>
                <form onSubmit={handleDirectLink}>
                  <h2>Generate Direct Link</h2>
                  
                  <div className="form-group">
                    <label htmlFor="productId">Product ID *</label>
                    <input
                      type="text"
                      id="productId"
                      name="productId"
                      placeholder="Enter Product ID"
                      required
                      onChange={handleProductIdChange}
                      className={productDetails ? 'valid-input' : ''}
                    />
                    {productLoading && (
                      <div className="loading-indicator">
                        <Loader />
                      </div>
                    )}
                    {productDetails && (
                      <div className="product-preview">
                        <img 
                          src={productDetails.images?.[0] || productDetails.image} 
                          alt={productDetails.name} 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                        <div className="product-info">
                          <h3>{productDetails.name}</h3>
                          <p className="price">₹{productDetails.price}</p>
                          <p className="category">{productDetails.category}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="couponName">Coupon Name *</label>
                    <input
                      type="text"
                      id="couponName"
                      name="couponName"
                      placeholder="Enter Coupon Name (e.g., SUMMER20)"
                      required
                      pattern="[A-Za-z0-9]+"
                      title="Only letters and numbers are allowed"
                      maxLength="20"
                      onChange={(e) => {
                        e.target.value = validateCouponName(e.target.value);
                      }}
                    />
                    <small className="input-help">Only letters and numbers are allowed (max 20 characters)</small>
                    {isCheckingCoupon && (
                      <div className="loading-indicator">
                        <Loader />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="discountPercentage">Discount Percentage</label>
                    <input
                      type="number"
                      id="discountPercentage"
                      name="discountPercentage"
                      placeholder="Enter Discount Percentage"
                      min="0"
                      max="100"
                      defaultValue="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="Select Expiry Date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={directLinkLoading || !productDetails || isCheckingCoupon} 
                    className="submit-btn"
                  >
                    {directLinkLoading ? <Loader /> : 'Generate Link'}
                  </button>
                </form>

                {directLink && (
                  <div className="direct-link-result">
                    <p>Shareable Link:</p>
                    <div className="link-container">
                      <input
                        type="text"
                        value={directLink}
                        readOnly
                        className="link-input"
                      />
                      <button onClick={copyToClipboard} className="copy-btn">
                        Copy
                      </button>
                    </div>
                    <div className="coupon-status">
                      {couponStatus === 'success' && (
                        <p className="success-message">✓ Coupon created successfully</p>
                      )}
                      {couponStatus === 'error' && (
                        <p className="error-message">✗ Failed to create coupon</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showDiscountLinkPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <button className="close-icon" onClick={() => {
                  setShowDiscountLinkPopup(false);
                  setDiscountLink('');
                  setProductDetails(null);
                  setCouponStatus(null);
                  setProductUrl(''); // Reset product URL state
                }}>
                  <AiOutlineClose />
                </button>
                <form onSubmit={handleDiscountLink}>
                  <h2>Generate Discount Link</h2>
                  
                  <div className="form-group">
                    <label htmlFor="productId">Product ID *</label>
                    <input
                      type="text"
                      id="productId"
                      name="productId"
                      placeholder="Enter Product ID"
                      required
                      onChange={handleProductIdChange}
                      className={productDetails ? 'valid-input' : ''}
                    />
                    {productLoading && (
                      <div className="loading-indicator">
                        <Loader />
                      </div>
                    )}
                    {productDetails && (
                      <div className="product-preview">
                        <img 
                          src={productDetails.images?.[0] || productDetails.image} 
                          alt={productDetails.name} 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                        <div className="product-info">
                          <h3>{productDetails.name}</h3>
                          <p className="price">₹{productDetails.price}</p>
                          <p className="category">{productDetails.category}</p>
                        </div>
                      </div>
                    )}
                     {productUrl && <p className="input-help">Fetched Product URL: {productUrl}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="discountAmount">Discount Amount (₹) *</label>
                    <input
                      type="number"
                      id="discountAmount"
                      name="discountAmount"
                      placeholder="Enter Discount Amount"
                      required
                      min="1"
                      max={productDetails?.price || 999999}
                    />
                    <small className="input-help">Enter the fixed discount amount in rupees</small>
                  </div>

                  
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="Select Expiry Date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={discountLinkLoading || !productDetails} // No longer strictly dependent on productUrl for button enable
                    className="submit-btn"
                  >
                    {discountLinkLoading ? <Loader /> : 'Generate Link'}
                  </button>
                </form>

                {discountLink && (
                  <div className="direct-link-result">
                    <p>Shareable Discount Link:</p>
                    <div className="link-container">
                      <input
                        type="text"
                        value={discountLink}
                        readOnly
                        className="link-input"
                      />
                      <button onClick={copyToClipboard} className="copy-btn">
                        Copy
                      </button>
                    </div>
                    <div className="coupon-status">
                      {couponStatus === 'success' && (
                        <p className="success-message">✓ Discount link created successfully</p>
                      )}
                      {couponStatus === 'error' && (
                        <p className="error-message">✗ Failed to create discount link</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ): (
    <Navigate to="/login" />
  );
};

export default CreateOffer;
