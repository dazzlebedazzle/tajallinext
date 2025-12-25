const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  image: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
