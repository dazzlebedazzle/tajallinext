// googlectrl.js

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Function to verify Google ID token
const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error('Failed to verify Google ID Token');
  }
};

// Function to generate JWT token
const generateJWTToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  verifyGoogleToken,
  generateJWTToken,
};
