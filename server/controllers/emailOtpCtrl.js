const nodemailer = require('nodemailer');
const OTP = require('../models/otpModel');
const User = require('../models/userModel');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create nodemailer transporter
const createTransporter = () => {
  // Use the same email configuration as your existing emailCtrl.js
  // You can override with EMAIL_OTP_USER and EMAIL_OTP_PASSWORD if needed
  const emailUser = process.env.EMAIL_OTP_USER || process.env.mail_id || "dazzlebedazzle.id@gmail.com";
  const emailPassword = process.env.EMAIL_OTP_PASSWORD || process.env.mp;
  
  if (!emailPassword) {
    console.error('❌ Email password not found. Checked: EMAIL_OTP_PASSWORD, mp');
    console.error('📝 Please set EMAIL_OTP_PASSWORD or mp in your .env file');
    throw new Error('Email password environment variable is not set. Please set EMAIL_OTP_PASSWORD or mp in your .env file.');
  }

  // Log which email is being used (but not the password)
  console.log('📧 Using email:', emailUser);
  console.log('🔑 Using existing email configuration');

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

// Function to send OTP via Email
const sendEmailOTP = async (email) => {
  try {
    // Check if user is registered
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: "User not registered" };
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Set expiry time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      expiresAt
    });

    // Create transporter
    const transporter = createTransporter();

    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #723207; text-align: center; margin-bottom: 20px;">Tajalli DryFruits</h2>
          <h3 style="color: #333; margin-bottom: 20px;">Your Login OTP</h3>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hello,<br><br>
            Your One-Time Password (OTP) for login is:
          </p>
          <div style="background-color: #f8f9fa; border: 2px dashed #723207; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #723207; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This OTP is valid for <strong>10 minutes</strong>.<br>
            If you didn't request this OTP, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            © Tajalli DryFruits. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send email
    const emailUser = process.env.EMAIL_OTP_USER || process.env.mail_id || "dazzlebedazzle.id@gmail.com";
    const info = await transporter.sendMail({
      from: `"Tajalli DryFruits" <${emailUser}>`,
      to: email,
      subject: "Your Login OTP - Tajalli DryFruits",
      html: htmlContent,
      text: `Your OTP for login is: ${otp}. This OTP is valid for 10 minutes.`
    });

    console.log("OTP email sent:", info.messageId);
    return { success: true, message: 'OTP sent successfully to your email' };

  } catch (error) {
    console.error('Error sending email OTP:', error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      return { 
        success: false, 
        error: 'Email authentication failed. Please check your Gmail App Password configuration. See server logs for details.' 
      };
    }
    
    if (error.message && error.message.includes('EMAIL_OTP_PASSWORD')) {
      return { 
        success: false, 
        error: 'Email configuration error. Please contact administrator.' 
      };
    }
    
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
};

// Function to verify OTP
const verifyEmailOTP = async (email, otp) => {
  try {
    // Find OTP in database
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return { success: false, error: "OTP not found. Please request a new OTP." };
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return { success: false, error: "OTP has expired. Please request a new OTP." };
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return { success: false, error: "Invalid OTP. Please try again." };
    }

    // OTP is valid, delete it from database
    await OTP.deleteOne({ _id: otpRecord._id });

    return { success: true, message: "OTP verified successfully" };

  } catch (error) {
    console.error("Error verifying email OTP:", error);
    return { success: false, error: "Failed to verify OTP" };
  }
};

module.exports = {
  sendEmailOTP,
  verifyEmailOTP
};

