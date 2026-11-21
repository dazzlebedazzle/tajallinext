const mongoose = require('mongoose');
const Order = require('../models/orderModel'); // Adjust the path as necessary

const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Canceled'];

// Bill number derived from the order itself, so every past order has one too:
// TJ-YYYYMMDD-<last 6 chars of the order id>
const invoiceNumberFor = (order) => {
    const d = new Date(order.createdAt || Date.now());
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    return `TJ-${ymd}-${String(order._id).slice(-6).toUpperCase()}`;
};

// Each order item's `price` is the line total (unit price x quantity).
// total_pay = subtotal - discounts + delivery. Very old orders may have total_pay = 0.
const withBillingFields = (order) => {
    const subtotal = (order.orderItems || []).reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const amountPaid = Number(order.total_pay) > 0 ? Number(order.total_pay) : subtotal;
    return {
        ...order,
        invoiceNumber: invoiceNumberFor(order),
        subtotal,
        adjustment: amountPaid - subtotal, // delivery charge minus coupon/referral discounts
        amountPaid,
    };
};

// Function to get all orders (also used by the Billing page)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'firstname lastname email mobile') // customer details for the bill
            .populate('orderItems.productId', 'title price images slug')
            .lean();

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders.map(withBillingFields)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Update an order's status (admin): Pending / Shipped / Delivered / Canceled
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (!ORDER_STATUSES.includes(orderStatus)) {
            return res.status(400).json({ success: false, message: `Status must be one of: ${ORDER_STATUSES.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true })
            .populate('user', 'firstname lastname email mobile')
            .populate('orderItems.productId', 'title price images slug')
            .lean();
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        res.status(200).json({ success: true, data: withBillingFields(order) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllOrders,
    updateOrderStatus
};
