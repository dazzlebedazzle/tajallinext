import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './CreateOffer.css';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';
import Loader from '../components/Loader';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth';

const CreateBanner = () => {
  const [banners, setBanners] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const { authState } = useContext(AuthContext);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [showProductDetailsPopup, setShowProductDetailsPopup] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/api/offer1/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBanners(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, [apiBaseUrl]);

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const bannerData = {
      name: e.target.name.value,
      discountPercentage: e.target.discountPercentage.value,
      productId: e.target.productId.value,
    };

    try {
      const res = await axios.post(`${apiBaseUrl}/api/offer1/banner`, bannerData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      let createdBanner = res.data;

      if (e.target.productImage.files[0]) {
        const formData = new FormData();
        formData.append('image', e.target.productImage.files[0]);

        const imgRes = await axios.put(`${apiBaseUrl}/api/offer1/banner/${res.data._id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        createdBanner = imgRes.data;
      }

      setBanners([...banners, createdBanner]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error creating banner:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/api/offer1/banner/${currentBanner._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBanners(banners.filter((b) => b._id !== currentBanner._id));
      setShowDeletePopup(false);
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProductDetails(res.data);
      setShowProductDetailsPopup(true);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  if (authState.authLoading) return <Loader />;
  if (!authState.isAuthenticated) return <Navigate to="/login" />;

  return (
    <div>
      <Sidebar />
      <div className="create-offer-page">
        <div className="main-content">
          <div className="button-container">
            <button className="create-offer-btn" onClick={() => { setCurrentBanner(null); setShowPopup(true); }}>
              <AiOutlinePlus /> Create New Banner
            </button>
          </div>
          <h1>Banners</h1>
          <div className="offers-list">
            {banners.map((banner) => (
              <div key={banner._id} className="offer-card">
                <img src={banner.image} alt="Product" />
                <div className="offer-details">
                  <p>{banner.discountPercentage}% off</p>
                  <p>Product Title: {banner.productId?.title || 'No title'}</p>
                  <p>Category: {banner.productId?.category || 'No category'}</p>
                  <p>Price: ₹{banner.productId?.price || 'N/A'}</p>
                  <button onClick={() => { setCurrentBanner(banner); setShowDeletePopup(true); }}>
                    <AiOutlineDelete /> Delete
                  </button>
                  <button onClick={() => fetchProductDetails(banner.productId?._id)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Banner Popup */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <button className="close-icon" onClick={() => setShowPopup(false)}>
                <AiOutlineClose />
              </button>
              <form onSubmit={handleCreateBanner}>
                <h2>Create New Banner</h2>
                <input type="text" name="name" placeholder="Banner Name" required />
                <input type="number" name="discountPercentage" placeholder="Discount %" required />
                <input type="text" name="productId" placeholder="Product ID" required />
                <input type="file" name="productImage" />
                <button type="submit">Create Banner</button>
                {loading && <Loader />}
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeletePopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>Are you sure you want to delete this banner?</p>
              <button onClick={handleDeleteBanner}>Yes, Delete</button>
              <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Product Details View */}
        {showProductDetailsPopup && productDetails && (
          <div className="popup-overlay">
            <div className="popup-box">
              <button className="close-icon" onClick={() => setShowProductDetailsPopup(false)}>
                <AiOutlineClose />
              </button>
              <h2>Product Details</h2>
              <p><strong>Title:</strong> {productDetails.title}</p>
              <p><strong>Category:</strong> {productDetails.category}</p>
              <p><strong>Price:</strong> ₹{productDetails.price}</p>
              <p><strong>Description:</strong> {productDetails.description}</p>
              {productDetails.images?.[0] && <img src={productDetails.images[0]} alt={productDetails.title} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBanner;
