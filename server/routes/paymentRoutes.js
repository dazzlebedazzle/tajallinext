const express = require('express');
 const payment_route = express();
// const router=express();

const path = require('path');

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

//const{createPaymentOrder,verifyPayment}=require('../controllers/paymentController')

// router.post('/order', createPaymentOrder);
const {createOrder,verifyPayment, panelOrder,cancelOrder} = require('../controllers/paymentCtrl');
const {authMiddleware,admin}=require("../middleware/authMiddleware");


// payment_route.get('/', paymentController.renderProductPage);
payment_route.post('/createOrder', createOrder);
payment_route.post('/verify', verifyPayment);
payment_route.post('/panelOrder',authMiddleware,panelOrder );

payment_route.delete('/orders/:orderId/cancel', cancelOrder);

// module.exports=router;
module.exports = payment_route;