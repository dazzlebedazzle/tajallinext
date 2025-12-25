const express=require("express");
const router=express.Router();
const {createCoupon, getallCoupon, updateCoupon, deleteCoupon,useCoupon}=require("../controllers/couponCtrl");
const {authMiddleware,admin}=require("../middleware/authMiddleware");

router.post("/",authMiddleware,admin,createCoupon);
router.get("/",authMiddleware,admin,getallCoupon);
router.put("/:id",authMiddleware,admin,updateCoupon);
router.delete("/:id",authMiddleware,admin,deleteCoupon);
router.post('/use', useCoupon);




module.exports=router;