// routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryCtrl');
const {authMiddleware,admin}=require("../middleware/authMiddleware");
const {searchProducts}=require('../controllers/productCtrl');


// POST /api/categories - Create a new category
router.post('/',authMiddleware,admin, categoryController.createCategory);

// GET /api/categories - Get all categories
router.get('/',categoryController.getAllCategories);

// Delete a category by ID
router.delete('/:id',authMiddleware,admin, categoryController.deleteCategory);

// Update an existing category
router.put('/:id', authMiddleware,admin,categoryController.updateCategory);

router.get('/search', searchProducts);
module.exports = router;
