const Email = require('../models/emailModel'); // Adjust the path as necessary
const Coupon = require('../models/couponModel'); // Adjust the path as necessary
const {sendEmails} = require('../controllers/emailCtrl'); // Adjust the path as necessary

const sendCouponsToSubscribers = async (req, res) => {
  const { couponId } = req.body;

  try {
    // Fetch all subscribed emails
    const subscribedEmails = await Email.find({}, 'email');
    const emails = subscribedEmails.map(subscriber => subscriber.email);

    // Fetch the coupon details
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).send('Coupon not found');
    }

    // Send the emails
    await sendEmails(emails, coupon);

    res.status(200).send('Coupons sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending coupons');
  }
};

const emailCollection= async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
      const newEmail = new Email({ email });
      await newEmail.save();
      res.status(201).send('Email saved successfully');
    } catch (error) {
      res.status(400).send('Error saving email');
    }
  };

  const getemails= async (req, res) => {
    try {
      const emails = await Email.find({});
      res.status(200).json(emails);
    } catch (error) {
      res.status(500).send('Error fetching emails');
    }
  };
  
module.exports = { sendCouponsToSubscribers,emailCollection,getemails };