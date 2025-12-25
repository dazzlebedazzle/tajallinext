// controllers/categoryController.js

const Category = require('../models/category');

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Create new category
    const newCategory = new Category({
      name,
      description,
    });

    // Save category to database
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an existing category
updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a category
deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
