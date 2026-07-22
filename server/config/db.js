const mongoose = require('mongoose');

const dropLegacyOrderItemSlugIndex = async () => {
  try {
    const ordersCollection = mongoose.connection.collection('orders');
    const indexes = await ordersCollection.indexes();
    const legacyIndex = indexes.find((index) =>
      index.unique && index.key && index.key['orderItems.slug'] === 1
    );

    if (legacyIndex) {
      await ordersCollection.dropIndex(legacyIndex.name);
      console.log(`Dropped legacy unique order item slug index: ${legacyIndex.name}`);
    }
  } catch (error) {
    console.warn('Could not check legacy order item slug index:', error.message);
  }
};

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
    });
    console.log('MongoDB connected');
    await dropLegacyOrderItemSlugIndex();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

module.exports = dbConnect;
