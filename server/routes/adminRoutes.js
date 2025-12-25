// Example route to trigger sending emails
const express = require('express');
const router=express.Router();
const {sendCouponsToSubscribers}=require('../controllers/adminCtrl');
router.post('/send-emails',sendCouponsToSubscribers)

  module.exports=router;
