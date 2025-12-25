const express=require('express');
const {createUser,loginUser, getAllUsers, getUser, deleteUser, updateUser,blockUser,unblockUser,handleRefreshToken,logout, updatePassword,forgotPasswordToken, resetPassword,updateUserProfileImage, getUserOrders,getReferredUsers,applyReferralDiscount} = require('../controllers/userCtrl');
const { productImgResize, uploadPhoto}=require("../middleware/uploadImg");
const router= express.Router();

const {authMiddleware,admin}=require("../middleware/authMiddleware");

const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    mergeCartAfterLogin
  } = require('../controllers/cartCtrl');

  router.get('/cart', authMiddleware, getCart);
router.post('/cart/add', authMiddleware, addToCart);
router.post('/cart/remove', authMiddleware, removeFromCart);
router.put('/cart/update', authMiddleware, updateCartQuantity);
router.post("/cart/mergecart",authMiddleware, mergeCartAfterLogin)
router.get("/getReferredUsers",authMiddleware,getReferredUsers )
router.post("/applyReferral",authMiddleware,applyReferralDiscount)


router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/alluser",getAllUsers);
router.put("/password",authMiddleware,updatePassword);
router.post("/forgot-password-token",forgotPasswordToken);
router.post("/reset-password/:token",resetPassword);

router.put('/edit-user-pro', authMiddleware, uploadPhoto.single('profileImage'),productImgResize, updateUserProfileImage);
router.post("/refresh",handleRefreshToken);
router.get("/getuser",authMiddleware,getUser);
router.post("/logout",logout);
router.delete("/:id",deleteUser);
router.put("/edit-user",authMiddleware,updateUser);
router.put("/block-user/:id",authMiddleware,admin,blockUser);
router.put("/unblock-user/:id",authMiddleware,admin,unblockUser);
router.get('/getorders',authMiddleware,getUserOrders)


module.exports=router;
