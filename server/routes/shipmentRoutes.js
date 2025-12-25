const express = require('express');
const {  createShipment, trackShipment, cancelorder } = require('../controllers/shippingCtrl');
const {checkToken}=require('../controllers/paymentCtrl');
const router = express.Router();

// Apply checkToken middleware
router.use(checkToken);

// Route to create a shipment
router.post('/create-shipment', createShipment);

// Route to track a shipment
router.get('/track-shipment/:trackingIdentifier/:type', trackShipment);

//
router.post('/cancel-order',cancelorder);
module.exports = router;
