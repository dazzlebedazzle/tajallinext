const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../controllers/orderCtrl');
const {authMiddleware,admin}=require("../middleware/authMiddleware")
// Route to fetch all orders (admin Orders + Billing pages)
router.get('/orders',authMiddleware,admin, getAllOrders);
// Change an order's status (admin)
router.put('/:id/status', authMiddleware, admin, updateOrderStatus);



module.exports = router;
