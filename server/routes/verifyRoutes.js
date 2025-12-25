// const express = require('express');
// const router = express.Router();
// const { OAuth2Client } = require('google-auth-library');
// const otpCtrl = require('../controllers/Otpctrl');
// const { verifyGoogleToken, generateJWTToken } = require('../controllers/googlectrl');
// const User=require("../models/userModel");
// const client = new OAuth2Client({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   redirectUri: 'http://localhost:3000/google-callback',
// });

// // Route to send OTP
// router.post('/sendOTP', async (req, res) => {
//   const { mobile } = req.body;
//   const result = await otpCtrl.sendOTP(mobile);
//   if (result.success) {
//     res.status(200).json(result);
//   } else {
//     res.status(500).json(result);
//   }
// });

// // Route to verify OTP
// router.post('/verifyOTP', (req, res) => {
//   const { mobile, otp } = req.body;
//   const result = otpCtrl.verifyOTP(mobile, otp);
//   if (result.success) {
//     res.status(200).json(result);
//   } else {
//     res.status(400).json(result);
//   }
// });

// router.post('/googlelogin', async (req, res) => {
//   const { code } = req.body;
  
//   try {
//     // Exchange code for token
//     const { tokens } = await client.getToken({ code });
//     const googlePayload = await verifyGoogleToken(tokens.id_token);

//     // Find or create user based on googlePayload.email or other unique identifier
//     let user = await User.findOne({ email: googlePayload.email });

//     if (!user) {
//      const user = new User({
//         email: googlePayload.email,
//         firstName: googlePayload.given_name,
//         lastName: googlePayload.family_name,
//         picture: googlePayload.picture,
//       });
//       await user.save();
//     }

//     // Generate JWT token
//     const accessToken = generateJWTToken({
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       picture: user.picture,
//     });

//     res.json({ accessToken });
//   } catch (error) {
//     console.error('Google login error:', error);
//     res.status(500).json({ error: 'Google login failed' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const otpCtrl = require('../controllers/Otpctrl');
const { verifyGoogleToken, generateJWTToken } = require('../controllers/googlectrl');
const User = require("../models/userModel");
const {generateToken}=require("../config/jwtToken");
const {generateRefreshToken}=require("../config/refreshtoken"); 

// Initialize Google OAuth Client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/google-callback'
);

// Route to send OTP
router.post('/sendOTP', async (req, res) => {
  try {
    let { mobile } = req.body;

    // Normalize the mobile number (remove +91, spaces, leading zeros)
    if (mobile.startsWith('+91')) {
      mobile = mobile.slice(3);
    }
    mobile = mobile.replace(/^0+/, '').replace(/\s+/g, '');

    // Check if user is registered (with or without +91)
    const user = await User.findOne({
      $or: [
        { mobile },
        { mobile: `+91${mobile}` }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not registered" });
    }

    // User is registered, send OTP
    const result = await otpCtrl.sendOTP(mobile);
    res.status(result.success ? 200 : 500).json(result);

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});


// router.post('/sendOTP', async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     const result = await otpCtrl.sendOTP(`${mobile}`);
//     res.status(result.success ? 200 : 500).json(result);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// });

// Route to verify OTP
// router.post('/verifyOTP', async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
//     const result = await otpCtrl.verifyOTP(mobile, otp);
//     res.status(result.success ? 200 : 400).json(result);
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ error: "OTP verification failed" });
//   }
// });

// router.post('/verifyOTP', async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
    
//     // Verify OTP
//     console.log(mobile,"first")
//     const result = await otpCtrl.verifyOTP(`+91${mobile}`, otp);
    
//     if (!result.success) {
//       return res.status(400).json(result);
//     }
    
 
//     console.log(mobile)
//     // Find user by mobile
//     const findUser = await User.findOne({ mobile });
//     if (!findUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Generate refresh token
//     const refreshToken = await generateRefreshToken(findUser._id);

//     // Update user with refresh token
//     await User.findByIdAndUpdate(findUser.id, { refreshToken }, { new: true });

//     // Set refresh token in cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       maxAge: 72 * 60 * 60 * 1000, // 3 days
//     });

//     // Send user info and access token
//     res.status(200).json({
//       id: findUser._id,
//       firstname: findUser.firstname,
//       lastname: findUser.lastname,
//       email: findUser.email,
//       mobile: findUser.mobile,
//       role: findUser.role,
//       profileImage: findUser.profileImage,
//       token: generateToken(findUser._id),
//     });

//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ error: "OTP verification failed" });
//   }
// });

router.post('/verifyOTP', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile number and OTP are required." });
    }

    console.log("Verifying OTP for:", mobile);

    // Verify OTP with Twilio
    const result = await otpCtrl.verifyOTP(`+91${mobile}`, otp);
    console.log("OTP verification result:", result);

    // If OTP is not valid, return early
    if (!result || !result.success) {
      return res.status(400).json({ error: "Invalid or expired OTP. Please try again." });
    }

    // OTP is valid, proceed to login flow
    // const findUser = await User.findOne({ mobile });

    const findUser = await User.findOne({
      $or: [
        { mobile },
        { mobile: `+91${mobile}` }
      ]
    });

    if (!findUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const refreshToken = await generateRefreshToken(findUser._id);

    await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    res.status(200).json({
      id: findUser._id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      role: findUser.role,
      profileImage: findUser.profileImage,
      token: generateToken(findUser._id),
    });

  } catch (error) {
    console.error("Error during OTP verification/login:", error);
    res.status(500).json({ error: "Something went wrong during verification." });
  }
});



// Google login route
router.post('/googlelogin', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for token
    const { tokens } = await client.getToken(code);
    const googlePayload = await verifyGoogleToken(tokens.id_token);

    // Find or create user
    let user = await User.findOne({ email: googlePayload.email });

    if (!user) {
      user = new User({
        email: googlePayload.email,
        firstName: googlePayload.given_name,
        lastName: googlePayload.family_name,
        picture: googlePayload.picture,
      });
      await user.save();
    }

    // Generate JWT token
    const accessToken = generateJWTToken({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Google login failed' });
  }
});

module.exports = router;
