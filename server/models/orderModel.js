const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productImg: {
        type: String
    },
    weight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    slug: { type: String, 
        unique: true,
        required: true },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'],
        default: 'Pending'
    },
    order_id: {
        type: String
    },
    payment_id: {
        type: String
    },
    shipment_id: {
        type: String
    },
    awb_code: {
        type: String
    },
    courier_name: {
        type: String
    },
    shiprocket_order_id: { // Added field for Shiprocket order ID
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
