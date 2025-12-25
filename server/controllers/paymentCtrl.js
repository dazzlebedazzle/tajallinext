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

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

const createOrder = async (req, res) => {
  try {
    const amount = req.body.amount * 100; // Amount in paisa
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'razorUser@gmail.com'
    };

    const response=razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error('Error creating Razorpay order:', err);
        return res.status(400).json({ success: false, msg: 'Failed to create order' });
      }

      res.status(200).json({
        success: true,
        msg: 'Order created successfully',
        order: order,
        order_id: order.id,
        razorpay_signature: response.generated_signature
      });
    });
  } catch (error) {
    console.error('Error in createOrder function:', error);
    res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};

// Verify Razorpay payment
const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    applyReferral,
    userId // <-- boolean: true if user chose to apply
  } = req.body;

  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // ✅ Payment verified

      if (applyReferral) {
        console.log(req.user)
     
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ success: false, msg: "User not found" });
        }

        if ((user.discount || 0) < 100) {
          return res.status(400).json({ success: false, msg: "Insufficient referral points" });
        }

        user.discount -= 100;
        await user.save();
      }

      res.json({
        success: true,
        msg: "Payment verified" + (applyReferral ? " and 100 points deducted" : ""),
      });
    } else {
      res.status(400).json({ success: false, msg: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, msg: 'Internal server error' });
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
