const Order = require('../models/orderModel'); // Adjust the path as necessary

// Function to get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email') // Populating user details
            .populate('orderItems.productId', 'title price image'); // Populating product details

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getAllOrders
};
