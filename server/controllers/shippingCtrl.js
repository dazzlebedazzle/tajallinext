const axios = require('axios');

const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
const SHIPROCKET_API_URL2 = process.env.SHIPROCKET_API_URL2;

let token = '';

// Function to get Shiprocket token
const getToken = async () => {
  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });
    token = response.data.token;
    console.log('Token fetched successfully',token);
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};

// Fetch the token initially
getToken();

// Middleware to check and refresh token if necessary
const checkToken = async (req, res, next) => {
  if (!token) {
    await getToken();
  }
  next();
};

// Function to create a shipment
const createShipment = async (req, res) => {
  try {
    const  orderDetails  = req.body;
    
    console.log("hi",orderDetails);
    const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderDetails, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating shipment:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
};


// Function to track a shipment
const trackShipment = async (req, res) => {
  try {
    const { trackingIdentifier, type } = req.params;
    console.log('Tracking Identifier:', trackingIdentifier);
    console.log('Type:', type);

      let endpoint;
      if (type === 'awb') {
          endpoint = `/courier/track/awb/${trackingIdentifier}`;
      } else if (type === 'orderId') {
          endpoint = `/courier/track/shipment/${trackingIdentifier}`;
      } else {
          return res.status(400).json({ error: 'Invalid tracking type provided. Must be "awb" or "orderId".' });
      }
      
      const response = await axios.get(`${SHIPROCKET_API_URL}${endpoint}`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      res.json(response.data);
  } catch (error) {
      console.error('Error tracking order:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
};

const cancelorder = async (req, res) => {
  const { orderId } = req.body;

  try{

    var data = JSON.stringify({
      "ids": [orderId]
    });

      const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/cancel', data,{headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
  }} );
      console.log('Order cancelled successfully:', response.data);
      res.json(response.data);
  } catch (error) {
      console.error('Error cancelling order:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
  }
};
module.exports = {
  checkToken,
  createShipment,
  trackShipment,
  cancelorder
};
