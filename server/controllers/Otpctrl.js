const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP and associate with user (e.g., in-memory for demo, or DB for production)
let otpStore = {};

// Function to send OTP via Twilio
// const sendOTP = async (mobile) => {
//     const otp = generateOTP();
//     otpStore[mobile] = { otp };

//     try {
//         await client.verify.v2.services(serviceSid)
//             .verifications
//             .create({ to: mobile, channel: 'sms' });
//         return { success: true, message: 'OTP sent successfully' };
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         return { success: false, error: 'Failed to send OTP' };
//     }
// };

const sendOTP = async (mobile) => {
  // Remove +91 if present
  if (mobile.startsWith('+91')) {
      mobile = mobile.slice(3);
  }

  // Clean up any spaces or leading zeros
  mobile = mobile.replace(/^0+/, '').replace(/\s+/g, '');

  const otp = generateOTP();
  otpStore[mobile] = { otp };

  try {
      await client.verify.v2.services(serviceSid)
          .verifications
          .create({ to: `+91${mobile}`, channel: 'sms' }); // Add +91 back only for Twilio
      return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: 'Failed to send OTP' };
  }
};


// Function to verify OTP
// const verifyOTP = async (mobile, otp) => {
//     try {
//       const verification = await client.verify.v2.services(serviceSid).verificationChecks.create({
//         to: mobile,
//         code: otp,
//       });
  
//       console.log("Twilio verification status:", verification.status);
  
//       if (verification.status === "approved") {
//         return { success: true, message: "OTP verified successfully" };
//       } else {
//         return { success: false, error: "OTP not approved" };
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       return { success: false, error: "Failed to verify OTP" };
//     }
//   };
  
const verifyOTP = async (mobile, otp) => {
  // Remove +91 if present
  if (mobile.startsWith('+91')) {
    mobile = mobile.slice(3);
  }

  // Clean up any leading zeros or spaces
  mobile = mobile.replace(/^0+/, '').replace(/\s+/g, '');

  try {
    const verification = await client.verify.v2.services(serviceSid).verificationChecks.create({
      to: `+91${mobile}`, // Add +91 back only for Twilio
      code: otp,
    });

    console.log("Twilio verification status:", verification.status);

    if (verification.status === "approved") {
      return { success: true, message: "OTP verified successfully" };
    } else {
      return { success: false, error: "OTP not approved" };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Failed to verify OTP" };
  }
};


// Define routes

module.exports = {
    sendOTP,
    verifyOTP,
};
