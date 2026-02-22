const Razorpay = require('razorpay');
const Order = require('../models/orderModel');
const crypto = require('crypto');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const axios = require('axios');
const nodemailer = require('nodemailer');



const { log } = require('console');

const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let token = '';

// Function to get Shiprocket token
const getToken = async () => {
  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });
    token = response.data.token;
    console.log('Token fetched successfully');
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

// Sanitize env value: remove quotes, newlines, carriage returns, and trim
const sanitizeEnv = (val) => {
  if (val == null || typeof val !== 'string') return null;
  return val.replace(/^["'\s]+|["'\s\r\n]+$/g, '').replace(/\s+/g, '').trim() || null;
};

const getRazorpayKeyId = () => sanitizeEnv(process.env.RAZORPAY_ID_KEY);
const getRazorpaySecret = () => sanitizeEnv(process.env.RAZORPAY_SECRET_KEY);

const razorpayKeyId = getRazorpayKeyId();
const razorpaySecret = getRazorpaySecret();

// Debug logging (only show first and last few characters for security)
if (razorpayKeyId && razorpaySecret) {
  console.log('✅ Razorpay credentials loaded');
  console.log('Key ID:', razorpayKeyId.substring(0, 8) + '...', 'length:', razorpayKeyId.length, '(expected: 20)');
  console.log('Secret length:', razorpaySecret.length, '(expected: 32)');
  if (razorpayKeyId.length !== 20 || razorpaySecret.length !== 32) {
    console.warn('⚠️ Razorpay: Key must be 20 chars, Secret must be 32 chars. Get the full Secret from Dashboard → Settings → API Keys → Generate/Reveal secret for your Key.');
  }
} else {
  console.error('❌ Razorpay credentials not found in environment variables!');
  console.error('Please set RAZORPAY_ID_KEY and RAZORPAY_SECRET_KEY in your .env file');
  console.error('Current values:', {
    keyId: razorpayKeyId ? 'Set (hidden)' : 'Missing',
    secret: razorpaySecret ? 'Set (hidden)' : 'Missing'
  });
}

const razorpayInstance = razorpayKeyId && razorpaySecret ? new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpaySecret
}) : null;

if (razorpayInstance) {
  console.log('✅ Razorpay instance created successfully');
} else {
  console.error('❌ Failed to create Razorpay instance');
}

const createOrder = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.amount || isNaN(req.body.amount)) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid amount provided' 
      });
    }

    // Validate Razorpay credentials and instance
    if (!razorpayKeyId || !razorpaySecret || !razorpayInstance) {
      console.error('Razorpay credentials missing or invalid');
      console.error('Key ID present:', !!razorpayKeyId);
      console.error('Secret present:', !!razorpaySecret);
      return res.status(500).json({ 
        success: false, 
        msg: 'Payment gateway configuration error. Please contact administrator.' 
      });
    }

    const amount = Math.round(Number(req.body.amount) * 100); // Amount in paisa (minimum 100 paisa = 1 INR)
    
    if (amount < 100) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Minimum order amount is ₹1' 
      });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    console.log('Creating Razorpay order with options:', { ...options, key_id: razorpayKeyId?.substring(0, 10) + '...' });
    console.log('Razorpay Key ID length:', razorpayKeyId?.length);
    console.log('Razorpay Secret length:', razorpaySecret?.length);

    // Use promise-based approach instead of callback
    const order = await razorpayInstance.orders.create(options);
    
    console.log('Razorpay order created successfully:', order.id);
    
    res.status(200).json({
      success: true,
      msg: 'Order created successfully',
      order: order,
      order_id: order.id
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    const errObj = error && typeof error === 'object' ? error : {};
    const errorDescription = errObj.error?.description || errObj.description || errObj.message || (error && String(error)) || 'Unknown error';
    const errorCode = errObj.error?.code || errObj.code || 'UNKNOWN_ERROR';
    const statusCode = typeof errObj.statusCode === 'number' ? errObj.statusCode : 500;

    console.error('Error details:', { statusCode, errorCode, description: errorDescription });

    if (statusCode === 401 || /authentication failed/i.test(String(errorDescription)) || errorCode === 'BAD_REQUEST_ERROR') {
      console.error('❌ Razorpay Authentication Failed! Check RAZORPAY_ID_KEY and RAZORPAY_SECRET_KEY in .env (no quotes, both Live or both Test).');
      return res.status(500).json({
        success: false,
        msg: 'Payment gateway authentication failed. Please check server configuration.',
        error: 'Authentication failed - Invalid Razorpay credentials. Check server logs for details.'
      });
    }

    try {
      res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
        success: false,
        msg: 'Failed to create order',
        error: errorDescription,
        errorCode: errorCode
      });
    } catch (resErr) {
      console.error('Failed to send error response:', resErr);
      res.status(500).json({ success: false, msg: 'Failed to create order', error: 'Server error' });
    }
  }
};

// Verify Razorpay payment
const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    applyReferral,
    userId
  } = req.body;

  try {
    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Missing required payment verification fields' 
      });
    }

    // Use the cleaned secret key
    const secretKey = razorpaySecret || getRazorpaySecret();
    if (!secretKey) {
      console.error('Razorpay secret key not found');
      return res.status(500).json({ 
        success: false, 
        msg: 'Payment gateway configuration error' 
      });
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    console.log('Verifying payment signature...');
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Signature match:', generated_signature === razorpay_signature);

    if (generated_signature === razorpay_signature) {
      // ✅ Payment verified

      if (applyReferral && userId) {
        try {
          const user = await User.findById(userId);

          if (!user) {
            console.warn('User not found for referral discount:', userId);
          } else if ((user.discount || 0) >= 100) {
            user.discount -= 100;
            await user.save();
            console.log('Referral discount applied, 100 points deducted');
          } else {
            console.warn('Insufficient referral points for user:', userId);
          }
        } catch (referralError) {
          console.error('Error applying referral discount:', referralError);
          // Don't fail payment verification if referral discount fails
        }
      }

      res.json({
        success: true,
        msg: "Payment verified" + (applyReferral ? " and 100 points deducted" : ""),
      });
    } else {
      console.error('Payment signature verification failed');
      console.error('Expected:', generated_signature);
      console.error('Received:', razorpay_signature);
      res.status(400).json({ 
        success: false, 
        msg: 'Payment verification failed - Invalid signature' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      msg: 'Internal server error',
      error: error.message 
    });
  }
};


// const verifyPayment = async (req, res) => {
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
//   console.log( razorpay_payment_id, razorpay_order_id, razorpay_signature );

//   try {
//     const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
//     hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//     const generated_signature = hmac.digest('hex');

//     if (generated_signature === razorpay_signature) {
//       res.json({ success: true });
//     } else {
//       res.status(400).json({ success: false, msg: 'Payment verification failed' });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ success: false, msg: 'Internal server error' });
//   }
// };

// Create order in database
// const panelOrder = async (req, res) => {
//   const userid = req.user.id;
//   console.log("userid", userid);

//   const {
//     orderItems,
//     order_id,
//     payment_id,
//     shippingAddress,
//     total_pay,
//   } = req.body;
//   console.log(orderItems);

//   const shiprocketOrderItems = orderItems.map(item => ({
   
//     name: item.productName,
//     sku: item.cartId, // Use productId or some SKU identifier
//     units: item.quantity,
//     selling_price: item.price,
//     discount: "", // Optional
//     tax: "", // Optional
//     hsn: 441122 // Change this to your actual HSN code
//   }));

//   const shiprocketOrderDetails = {
//     order_id: order_id,
//     order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
//     pickup_location: "primary", // Change this to your actual pickup location
//     channel_id: "", // Optional, fill if you have channel ID
//     comment: "Reseller: M/s Goku",
//     billing_customer_name: shippingAddress.name,
//     billing_last_name: "", // Optional
//     billing_address: shippingAddress.address,
//     billing_address_2: "", // Optional
//     billing_city: shippingAddress.city,
//     billing_pincode: shippingAddress.pincode,
//     billing_state: shippingAddress.state,
//     billing_country: shippingAddress.country,
//     billing_email: shippingAddress.email,
//     billing_phone: shippingAddress.phone,
//     shipping_is_billing: true,
//     order_items: shiprocketOrderItems,
//     payment_method: "Prepaid",
//     shipping_charges: 0,
//     giftwrap_charges: 0,
//     transaction_charges: 0,
//     total_discount: 0,
//     sub_total:total_pay ,
//     length: 10, // Change to actual dimensions
//     breadth: 15,
//     height: 20,
//     weight: orderItems.reduce((acc, item) => acc + (item.weight*item.quantity) / 1000, 0), // total weight in kg
//   };
//   console.log(shiprocketOrderDetails);
//   try {
//     // Call Shiprocket API
//     const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, shiprocketOrderDetails, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const shiprocketData = response.data;
//     console.log(shiprocketData);

//     // Create new order with Shiprocket details
//     const newOrder = new Order({
//       user: userid,
//       orderItems: orderItems,
//       orderStatus: 'Pending',
//       order_id: order_id,
//       payment_id: payment_id,
//       shipment_id: shiprocketData.shipment_id,
//       awb_code: shiprocketData.awb_code,
//       courier_name: shiprocketData.courier_name,
//       shippingAddress: shippingAddress,
//       shiprocket_order_id: shiprocketData.order_id
//     });

//     console.log(newOrder);

//     await newOrder.save();

//     // Update user's orders array
//     await User.findByIdAndUpdate(userid, { $push: { orders: newOrder._id } });
//     await Promise.all(orderItems.map(async (item) => {
//       console.log("here we go",item.quantity);
//       await Product.findByIdAndUpdate(item.productId, { $inc: { numberOfPurchases: item.quantity } });
//     }));

//     res.json({ success: true, shiprocketData });
//   } catch (error) {
//     console.error("Error in panelOrder:", error);
//     res.status(500).send(error);
//   }
// };


const sendOrderEmail = async (userEmail, orderDetails,total_pay ) => {
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(orderDetails,"Orders")

  // Convert total_pay to a number safely
  const totalPayAmount = orderDetails.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const logo = "https://tajalli.co.in/static/media/logo.8aa79b666013132e9a8e.png"

  // const totalPayAmount = Number(orderDetails.total_pay) || 0;

  let orderItemsHTML = "";
  if (orderDetails.orderItems && orderDetails.orderItems.length > 0) {
    orderDetails.orderItems.forEach((item,index) => {
      orderItemsHTML += `
                <tr>
        <td><img src="${item.productImg}" width="50" height="50" alt="Product Image"></td>
        <td class="content">${item.productName|| "N/A"} (${item.weight}g) × ${item.quantity || "1"}</td>
        <td class="right">Rs. ${item.price ? Number(item.price).toFixed(2) : "N/A"}</td>
      </tr>
      `;
    });
  } else {
    orderItemsHTML = `<tr><td colspan="3">No items found</td></tr>`;
  }

  const emailTemplate = `
   <html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { background-color: #ffffff; padding: 20px; border-radius: 5px; max-width: 600px; margin: auto; }
   .header { text-align: center; background-color: #723207; color: white; padding: 10px; border-radius: 5px 5px 0 0; }
    .order-summary { margin: 20px 0;   padding-top: 4px; }
    .order-summary table { width: 100%; border-collapse: collapse; }
    .order-summary td, .order-summary th { padding: 4px; text-align: left; color:#777; }
    .order-summary .right { text-align: right; color:#36454F; font-weight: 600;}
    .total { font-size: 18px; font-weight: bold; }
    .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #777; }
    .content{width:70%;   font-weight: 600;}
    .logoSite{display: flex;  justify-content: space-between; flex-wrap: wrap;}
    .logoImg{width: 40%;     height: 50%;   margin: 20px 0px 0px 150px;}
  </style> 
</head>
<body>
  <div class="container">
    <div class="header">Order Summary</div>
    <table class="order-summary">
    ${orderItemsHTML}
    </table>
    <hr>
    <div class="logoSite">
    <table class="order-summary">
      <tr>
        <td>Subtotal</td>
        <td class="right">Rs. ${totalPayAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Shipping</td>
        <td class="right">Rs. 100 </td>
      </tr>
      <tr class="total">
        <td>Total</td>
        <td class="right">Rs. ${totalPayAmount.toFixed(2)}</td>
      </tr>
    </table>
 
    <img src="${logo}" class="logoImg" alt="Product Image"></div>
    <hr>
   
    <div class="footer">Thank you for shopping for health with Tajalli Dryfruits! 🥜🌿 Stay healthy, stay happy!</div>
  </div>
</body>
</html>

  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Order Confirmation",
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent successfully");
  } catch (error) {
    console.error("❌ Error sending order confirmation email:", error);
  }
};



// Create Order Database
const panelOrder = async (req, res) => {
  const userid = req.user.id;
  const { orderItems, order_id, payment_id, shippingAddress, total_pay } = req.body;

  try {
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    const newOrder = new Order({
      user: userid,
      orderItems,
      orderStatus: "Pending",
      order_id,
      payment_id,
      shippingAddress,
      total_pay, // ✅ Ensure total_pay is stored
    });

    await newOrder.save();
    await User.findByIdAndUpdate(userid, { $push: { orders: newOrder._id } });

    await sendOrderEmail(user.email, { user, orderItems });

    res.json({ success: true, msg: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error in panelOrder:", error);
    res.status(500).send(error);
  }
};
//cancel order

// Function to cancel order
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);

  try {
      // Fetch the order from the database
      const order = await Order.findOne({ order_id: orderId });
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Prepare the data for the Shiprocket API request
      const data = JSON.stringify({
          ids: [order.shiprocket_order_id] // Assuming 'shipment_id' is the field used for Shiprocket order ID
      });

      console.log(data);

      // Shiprocket API request configuration
      const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://apiv2.shiprocket.in/v1/external/orders/cancel',
          headers: { 
              'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Your Shiprocket API token
          },
          data: data
      };

      // Make the request to Shiprocket
      const response = await axios(config);
      console.log(response);

      if (response.statusText=='OK') {
          // Update the order status to 'Canceled'
          order.orderStatus = 'Canceled';
          await order.save();
        console.log(order);
          // Remove the order from the user's order list
          console.log(order.user);
          console.log(order.id)
          const user = await User.findById(order.user);
          console.log(user);
          user.orders = user.orders.filter(id => id.toString() !== order.id);
          console.log("jai ho")
          await user.save();
          console.log("jai ho")

          res.status(200).json({ message: 'Order canceled successfully' });
      } else {
          res.status(400).json({ message: 'Failed to cancel order in Shiprocket', error: response.data.message });
      }
  } catch (error) {
      console.error('Error canceling order:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  panelOrder,
  checkToken,
  cancelOrder
};
