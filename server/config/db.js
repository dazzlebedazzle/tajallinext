const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      ssl: true,
      tlsAllowInvalidCertificates: false, // don't allow invalid SSL certs
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};



module.exports = dbConnect;
