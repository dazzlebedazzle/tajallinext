import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import './Categories.css';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth'; 

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
   const { authState, logout } =useContext(AuthContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/categories`, {
        name: newCategoryName,
        description: newCategoryDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      togglePopup();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const editCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const updatedCategory = {
        name: newCategoryName,
        description: newCategoryDescription
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/categories/${categories[editIndex]._id}`,
        updatedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const updatedCategories = categories.map((category, index) =>
        index === editIndex ? response.data : category
      );
      setCategories(updatedCategories);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setEditMode(false);
      setEditIndex(null);
      togglePopup();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (index) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${categories[index]._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(categories.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleEditClick = (index) => {
    setNewCategoryName(categories[index].name);
    setNewCategoryDescription(categories[index].description || '');
    setEditMode(true);
    setEditIndex(index);
    togglePopup();
  };

   if (authState.authLoading) {
    return <Loader />; // or any other loading indicator
  }
  

  return  authState.isAuthenticated ?  (
    <div>
      <Sidebar />
      <div className="categories-container">
        <h2>Categories</h2>
        <button className="add-category-btn" onClick={togglePopup}>
          Add New Category
        </button>

        {showPopup && (
          <div className="popup-container">
            <div className="popup-box">
              <button className="close-popup" onClick={togglePopup}>
                &times;
              </button>
              <h3>{editMode ? 'Edit Category' : 'Add New Category'}</h3>
              <form onSubmit={editMode ? editCategory : addCategory}>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Enter category description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
                <button type="submit">
                  {editMode ? 'Update Category' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="category-list">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-details">
                <strong>{category.name}</strong>
                <p>{category.description}</p>
              </div>
              <div className="category-actions">
                <button className="edit-btn" onClick={() => handleEditClick(index)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteCategory(index)}>
                  Delete
                </button>
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

export default Categories;
