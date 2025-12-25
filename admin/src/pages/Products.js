import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Products.css';
import Sidebar from '../components/Sidebar';
import { handleImageUpload } from '../components/imageUtils';
import Loader from '../components/Loader';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [aboutProductInput, setAboutProductInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authState } = useContext(AuthContext);

 const [formData, setFormData] = useState({
  title: '',
  category: '',
  price: '',
  images: [], // ✅ keep this
  weights: [],
  aboutProduct: [],
  details: {
    origin: '',
    addedPreservatives: '',
    fssaiApproved: '',
    vegNonVeg: '',
    storage: '',
    allergen: '',
    netQuantity: '',
    height: '',
    length: '',
    width: ''
  },
});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/allproduct`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split('.');
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

 
 

  // const handleAboutProductInputChange = (e) => setAboutProductInput(e.target.value);

  // const handleAboutProductInputKeyPress = (e) => {
  //   if (e.key === 'Enter' && aboutProductInput.trim()) {
  //     e.preventDefault();
  //     setFormData(prev => ({
  //       ...prev,
  //       aboutProduct: [...prev.aboutProduct, aboutProductInput.trim()]
  //     }));
  //     setAboutProductInput('');
  //   }
  // };

  // const handleRemoveAboutProduct = (index) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     aboutProduct: prev.aboutProduct.filter((_, i) => i !== index)
  //   }));
  // };

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setNewImages(files);
  setFormData(prev => ({
    ...prev,
    images: files
  }));
};


  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };
const handleSubmit = (e) => {
  e.preventDefault();

  const updatedAboutProduct = aboutProductInput.trim()
    ? [...formData.aboutProduct, aboutProductInput.trim()]
    : formData.aboutProduct;

  const updatedWeights = weightInput.trim()
    ? [...formData.weights, weightInput.trim()]
    : formData.weights;

  const updatedFormData = {
    ...formData,
    aboutProduct: updatedAboutProduct,
    weights: updatedWeights
  };

  setAboutProductInput('');
  setWeightInput(''); // clear input too

  if (formData._id) {
    updateProduct(updatedFormData);
  } else {
    createProduct(updatedFormData);
  }
};
const handleWeightInputChange = (e) => {
  setWeightInput(e.target.value);
};

const handleWeightInputKeyPress = (e) => {
  if (e.key === 'Enter' && weightInput.trim()) {
    e.preventDefault();
    const newWeight = weightInput.trim();

    setFormData(prev => ({
      ...prev,
      weights: [...prev.weights, newWeight],
    }));

    setWeightInput('');
  }
};

const handleRemoveWeight = (index) => {
  setFormData(prev => ({
    ...prev,
    weights: prev.weights.filter((_, i) => i !== index),
  }));
};


const createProduct = async (data) => {
  setLoading(true);
  try {
    const accessToken = localStorage.getItem('token');

    // ✅ Normalize weights and aboutProduct to arrays
    const normalizeToArray = (input) => {
      if (Array.isArray(input)) return input.map(i => i.trim()).filter(Boolean);
      if (typeof input === 'string') return input.split(',').map(i => i.trim()).filter(Boolean);
      return [];
    };

    const payload = {
      ...data,
      images: [], // Images will be uploaded later
     weights: normalizeToArray(data.weights),

      aboutProduct: normalizeToArray(data.aboutProduct),
    };

    console.log('📦 Submitting payload:', payload); // Debug

    // ✅ POST to backend
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/product`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { _id: productId } = response.data;

    // ✅ Upload images if any selected
    if (formData.images.length > 0) {
      const updatedFormData = await handleImageUpload(
        { target: { files: formData.images } },
        { ...formData, _id: productId }
      );
      setFormData(updatedFormData);
    }

    closePopup();    // Close modal/form
    fetchProducts(); // Refresh product list

  } catch (error) {
    console.error('❌ Error creating product:', error);
  } finally {
    setLoading(false);
  }
};


  const updateProduct = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/product/update/${formData._id}`,
        { ...formData, images: existingImages },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { _id: productId } = response.data;

      if (newImages.length > 0) {
        const updatedFormData = await handleImageUpload(
          { target: { files: formData.images } },
          { ...formData, _id: productId }
        );
        setFormData(updatedFormData);
      }

      closePopup();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (product) => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${product._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setFormData(response.data);
      setExistingImages(response.data.images);
      openPopup();
    } catch (error) {
      console.error('Error fetching product for edit:', error);
    }
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setShowLogoutPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setShowLogoutPopup(false);
  };

  const handleViewDetails = async (productId) => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSelectedProduct(response.data);
      setShowDetailsPopup(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  const handleAboutProductInputChange = (e) => {
  setAboutProductInput(e.target.value);
};

const handleAboutProductInputKeyPress = (e) => {
  if (e.key === 'Enter' && aboutProductInput.trim()) {
    e.preventDefault(); // Prevents newline in textarea

    setFormData((prevData) => ({
      ...prevData,
      aboutProduct: [...prevData.aboutProduct, aboutProductInput.trim()]
    }));

    setAboutProductInput(''); // Clear textarea after adding
  }
};

const handleRemoveAboutProduct = (indexToRemove) => {
  setFormData((prevData) => ({
    ...prevData,
    aboutProduct: prevData.aboutProduct.filter((_, idx) => idx !== indexToRemove)
  }));
};


  const openPopup = () => setShowPopup(true);

  const closePopup = () => {
  setShowPopup(false);
  setFormData({
    title: '',
    category: '',
    price: '',
    images: [], // ✅ image removed
    weights: [],
    aboutProduct: [],
    details: {
      origin: '',
      addedPreservatives: '',
      fssaiApproved: '',
      vegNonVeg: '',
      storage: '',
      allergen: '',
      netQuantity: '',
      height: '',
      length: '',
      width: ''
    }
  });
  setWeightInput('');
  setAboutProductInput('');
  setExistingImages([]);
  setNewImages([]);
};

  if (authState.authLoading) return <Loader />;

  return authState.isAuthenticated ?  (
    <div>
      <Sidebar />
      <div className="products-container">
        <h2>Products Management</h2>
        <button className="add-product-btn" onClick={openPopup}>
          Add New Product
        </button>
        {showPopup && (
          <div className="popup-container">
            <div className="popup-box">
              <button className="close-popup" onClick={closePopup}>
                ×
              </button>
              <h3>{formData._id ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  placeholder="Product Title"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  placeholder="Category"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Price"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required={!formData._id}
                />
               {formData._id ? (  // Check if editing an existing product
  // Display existing product images
  formData.images.length > 0 && (
    <div className="selected-images">
      {formData.images.map((image, index) => (
        <div kexy={index} className="image-item">
          <img src={image} alt={`Product ${index + 1}`} />
          <button
            type="button"
            className="remove-image-btn"
            onClick={() => handleRemoveImage(index)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
) : (
  // Display newly selected images for a new product
  formData.imageUrls && formData.imageUrls.length > 0 && (
    <div className="selected-images">
      {formData.imageUrls.map((url, index) => (
        <div key={index} className="image-item">
          <img src={url} alt={`Product ${index + 1}`} />
          <button
            type="button"
            className="remove-image-btn"
            onClick={() => handleRemoveImage(index)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
)}
<textarea
  id="aboutProductInput"
  name="aboutProductInput"
  value={aboutProductInput}
  placeholder="Add about product line and press Enter"
  onChange={handleAboutProductInputChange}
  onKeyDown={handleAboutProductInputKeyPress}
  rows={2}
  className="form-control"
/>


<div className="about-product-tags d-flex flex-wrap gap-2">
  {formData.aboutProduct.map((line, index) => (
    <div
      key={index}
      className="d-inline-flex align-items-center bg-light border rounded px-2 py-1"
    >
      <span className="me-2">{line}</span>
      <button
        type="button"
        className="btn-close btn-sm"
        aria-label={`Remove about product line ${index + 1}`}
        onClick={() => handleRemoveAboutProduct(index)}
      ></button>
    </div>
  ))}
</div>

<label htmlFor="weightInput">Weights</label>
 <input
  type="text"
  id="weightInput"
  value={weightInput}
  placeholder="Add weight (e.g., 250gm) and press Enter"
  onChange={handleWeightInputChange}
  onKeyDown={handleWeightInputKeyPress}
/>


<div className="weights-tags">
  {formData.weights.map((weight, index) => (
    <div key={index} className="weight-tag">
      <span>{weight}</span>
      <button
        type="button"
        onClick={() => handleRemoveWeight(index)}
      >
        ×
      </button>
    </div>
  ))}
</div>

                <input
                  type="text"
                  name="details.origin"
                  value={formData.details.origin}
                  placeholder="Origin (optional)"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="details.addedPreservatives"
                  value={formData.details.addedPreservatives}
                  placeholder="Added Preservatives (optional)"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="details.fssaiApproved"
                  value={formData.details.fssaiApproved}
                  placeholder="FSSAI Approved"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="details.vegNonVeg"
                  value={formData.details.vegNonVeg}
                  placeholder="Veg/Non-Veg"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="details.storage"
                  value={formData.details.storage}
                  placeholder="Storage"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="details.allergen"
                  value={formData.details.allergen}
                  placeholder="Allergen"
                  onChange={handleInputChange}
                  required
                />
              <textarea
  name="details.netQuantity"
  value={formData.details.netQuantity}
  placeholder="• Type key features on new lines"
  rows={8}
  className="form-control"
  onChange={handleInputChange}
  required
/>


                <input
                  type="text"
                  name="details.height"
                  value={formData.details.height}
                  placeholder="Height"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="details.length"
                  value={formData.details.length}
                  placeholder="Length"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="details.width"
                  value={formData.details.width}
                  placeholder="width"
                  onChange={handleInputChange}
                  />
                <button type="submit">{formData._id ? 'Update' : 'Add'}</button>
                <button type="button" className="cancel-btn" onClick={closePopup}>
                  Cancel
                </button>
                {loading && <Loader />} {/* Show loader if loading */}
              </form>
            </div>
          </div>
        )}
         {showDetailsPopup && (
          <div className="details-popup-container">
            <div className="details-popup-box">
             
              <h3>{selectedProduct.title}</h3>
              <div className="product-images">
                {selectedProduct.images.map((image, index) => (
                  <img key={index} src={image} alt={`Product Image ${index + 1}`} />
                ))}
              </div>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Price:</strong> Rs{selectedProduct.price}/Kg</p>
              <p><strong>About Product:</strong> {selectedProduct.aboutProduct}</p>
             <div className='product-details-flex'>  <p><strong>Origin:</strong> {selectedProduct.details.origin}</p>
              <p><strong>Added Preservatives:</strong> {selectedProduct.details.addedPreservatives}</p>
              <p><strong>FSSAI Approved:</strong> {selectedProduct.details.fssaiApproved}</p>
              <p><strong>Veg/Non-Veg:</strong> {selectedProduct.details.vegNonVeg}</p>
              <p><strong>Storage:</strong> {selectedProduct.details.storage}</p>
              <p><strong>Allergen:</strong> {selectedProduct.details.allergen}</p>
              <p><strong>Net Quantity:</strong> {selectedProduct.details.netQuantity}</p>
              <p><strong>Height:</strong> {selectedProduct.details.height}</p>
              <p><strong>Length:</strong> {selectedProduct.details.length}</p>
              <p><strong>Breadth:</strong> {selectedProduct.details.breadth}</p>
              <p><strong>Weights:</strong> {selectedProduct.weights.join(', ')}</p></div>
              <button className="close-details-btn" onClick={() => setShowDetailsPopup(false)}>
                Close
              </button>
            </div>
          </div>
        )}
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <div className="product-image">
                {product.images.length > 0 && (
                  <img src={product.images[0]} alt={product.title} />
                )}
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>Price: Rs{product.price}/Kg</p>
                <p>Category: {product.category}</p>
                <p>Product Id: {product._id}</p>
                <div className="product-buttons">
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button  onClick={() => handleDeleteClick(product._id)}>
                Delete
              </button>
              <button  onClick={() => handleViewDetails(product._id)}>
                    View Details
                  </button>
                  {showLogoutPopup && (
            <div className="popup-container">
              <div className="popup-box">
                <p>Are you sure you want to delete {product.title} ?</p>
                <button onClick={() => handleDelete(product._id)}>Yes</button>
                <button onClick={() => setShowLogoutPopup(false)}>No</button>
              </div>
            </div>
          )}
           {showLogoutPopup && (
          <div className="popup-container">
            <div className="popup-box">
              <p>Are you sure you want to delete this product?</p>
              <button className="confirm-btn" onClick={() => handleDelete(selectedProductId)}>
                Yes
              </button>
              <button className="cancel-btn" onClick={() => setShowLogoutPopup(false)}>
                No
              </button>
            </div>
          </div>
        )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ): (
    <Navigate to="/login" />
  );
};

export default Products;

