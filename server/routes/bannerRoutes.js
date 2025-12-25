const express = require('express');
const router = express.Router();
const {
  createBanner,
  uploadBannerImage,
  getAllBanners,
  deleteBanner,
} = require('../controllers/bannerCtrl');

const { uploadPhoto, productImgResize } = require('../middleware/uploadImg');

// 1. Create banner (name, discount, productId)
router.post('/banner', createBanner);

// 2. Upload banner image to Cloudinary
router.put('/banner/:id/image', uploadPhoto.single('image'), productImgResize, uploadBannerImage);

// 3. Get all banners
router.get('/', getAllBanners);

// 4. Delete a banner
router.delete('/banner/:id', deleteBanner);

module.exports = router;
