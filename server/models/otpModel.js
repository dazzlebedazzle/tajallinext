const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600 // Auto-delete after 10 minutes (600 seconds)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OTP', otpSchema);

