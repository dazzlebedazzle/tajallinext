"use client"
import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import close icon

const Sidebar = ({ categories, onSelectCategory, selectedCategory, isVisible, onClose }) => {
    return (
        <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
            <button className="close-button_shop" onClick={onClose}>
                <FaTimes />
            </button>
            <div className="sidebar-title"><h2>Categories</h2></div>
            {categories.map(category => (
                <div
                    key={category._id} // Assuming _id is a unique identifier for categories
                    className={selectedCategory === category.name ? 'sidebar-item active' : 'sidebar-item'}
                    id='sidebar'
                    onClick={() => onSelectCategory(category.name)}
                >
                    {category.name}
                    <hr></hr>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
