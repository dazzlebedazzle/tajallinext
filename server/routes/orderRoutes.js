const express = require('express');
const router = express.Router();
const { getAllOrders } = require('../controllers/orderCtrl');
const {authMiddleware,admin}=require("../middleware/authMiddleware")
// Route to fetch all orders
router.get('/orders',authMiddleware,admin, getAllOrders);



module.exports = router;
