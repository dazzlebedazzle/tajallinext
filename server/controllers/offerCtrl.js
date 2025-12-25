const mongoose = require('mongoose');
const Offer = require('../models/offerModel');
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('../utils/validatemongodbid');
const cloudinaryuploadImg=require("../utils/cloudinary");

// Create Offer
const createOffer = asyncHandler(async (req, res) => {
  const { name, discountPercentage, productId } = req.body;

  console.log("Received:", { name, discountPercentage, productId });

  // Input validation
  if (!name || !discountPercentage || !productId) {
    return res.status(400).json({ message: 'All fields (name, discountPercentage, productId) are required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid productId format.' });
  }

  try {
    const existingOffer = await Offer.findOne({ name });
    if (existingOffer) {
      return res.status(409).json({ message: 'An offer with this name already exists.' });
    }

    const newOffer = await Offer.create({
      name,
      discountPercentage: Number(discountPercentage),
      productId
    });

    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Offer creation error:', error);
    res.status(500).json({ message: 'Server error during offer creation.', error: error.message });
  }
});
const updateOfferImage = asyncHandler(async (req, res) => {
    try {
        const offerId = req.params.id;
        const imagePath = req.file.path;
console.log(offerId,imagePath);
        // Upload the image to Cloudinary
        const uploadedImage = await cloudinaryuploadImg(imagePath);

        // Update the offer with the new image URL
        const updatedOffer = await Offer.findByIdAndUpdate(
            offerId,
            { image: uploadedImage.url },
            { new: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get All Offers
const getAllOffers = asyncHandler(async (req, res) => {
    try {
        const offers = await Offer.find().populate('productId');
        res.json(offers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Offer by ID
const deleteOffer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);

    // if (!isValidObjectId(id)) {
    //     res.status(400).json({ message: 'Invalid offer ID' });
    //     return;
    // }

    try {
        const deletedOffer = await Offer.findByIdAndDelete(id);
        
        if (!deletedOffer) {
            res.status(404).json({ message: 'Offer not found' });
            return;
        }
        res.json(deletedOffer);
    } catch (error) {
     
        res.status(400).json({ message: error.message });
    }
});

module.exports = { createOffer, updateOfferImage,getAllOffers, deleteOffer };
