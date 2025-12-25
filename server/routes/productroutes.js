const express=require('express');
const router= express.Router();
const {authMiddleware,admin}=require("../middleware/authMiddleware");
const {createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, addToWishlist,rating, uploadImages,searchProducts,getProductBySlug}=require('../controllers/productCtrl');
const { productImgResize, uploadPhoto}=require("../middleware/uploadImg");

router.post("/",authMiddleware,admin,createProduct);
router.put("/upload/:id",authMiddleware,admin,uploadPhoto.array('images',10),productImgResize,uploadImages);
router.put("/update/:id",authMiddleware,admin,updateProduct);
router.delete("/:id",authMiddleware,admin,deleteProduct);
router.get("/allproduct",getAllProducts);
router.get('/search', searchProducts);
router.get("/:id",getProductById);
router.get("/slug/:slug",getProductBySlug);

router.put("/wishlist",authMiddleware,addToWishlist);
router.put("/ratings",authMiddleware,rating);




module.exports=router;