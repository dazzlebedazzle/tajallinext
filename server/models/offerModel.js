const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    image:{
        type:String,
        default:"no image"
    }
});

// Export the model
module.exports = mongoose.model('Offer', offerSchema);
