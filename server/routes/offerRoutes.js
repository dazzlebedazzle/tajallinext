const express = require('express');
const router=express.Router();
const { createOffer,updateOfferImage, getAllOffers, deleteOffer } = require('../controllers/offerCtrl');

const {authMiddleware,admin}=require("../middleware/authMiddleware");
const { uploadPhoto, productImgResize } = require('../middleware/uploadImg'); // Adjust the path to your middleware


router.post('/offers',authMiddleware,admin,createOffer)
router.put('/:id/image',authMiddleware,admin, uploadPhoto.single('image'), productImgResize, updateOfferImage);
router.get('/', getAllOffers);
router.delete('/offers/:id',authMiddleware,admin, deleteOffer);


module.exports=router;