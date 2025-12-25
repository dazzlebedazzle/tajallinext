'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateOfferForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    discountPercentage: '',
    productId: ''
  });
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [offerId, setOfferId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch product list on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product'); // adjust based on your API
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle offer creation
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // or use context if available

      const res = await axios.post(
        '/api/offer/offers',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOfferId(res.data._id);
      setMessage('Offer created successfully. Now upload image.');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Offer creation failed');
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!image || !offerId) return alert('Missing image or offer ID');

    const form = new FormData();
    form.append('image', image);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `/api/offer/${offerId}/image`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage('Image uploaded successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Image upload failed.');
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Offer</h2>

      <form onSubmit={handleCreateOffer}>
        <div className="mb-3">
          <label className="block font-medium">Offer Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border p-2"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">Discount (%)</label>
          <input
            type="number"
            name="discountPercentage"
            required
            min="1"
            max="100"
            className="w-full border p-2"
            value={formData.discountPercentage}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">Product</label>
          <select
            name="productId"
            required
            className="w-full border p-2"
            value={formData.productId}
            onChange={handleChange}
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Offer
        </button>
      </form>

      {offerId && (
        <div className="mt-5">
          <h4 className="font-semibold mb-2">Upload Image</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            onClick={handleImageUpload}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Upload Image
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default CreateOfferForm;
