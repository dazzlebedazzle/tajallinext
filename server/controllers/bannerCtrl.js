const fs = require('fs');
const Banner = require('../models/bannerModel');
const cloudinaryuploadImg = require('../utils/cloudinary');

// Create banner (text data only)
const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Upload image to banner (Cloudinary)
const uploadBannerImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Image not uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinaryuploadImg(req.file.path);

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Update banner with Cloudinary image URL
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { image: result.url },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().populate('productId');
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createBanner,
  uploadBannerImage,
  getAllBanners,
  deleteBanner,
};
