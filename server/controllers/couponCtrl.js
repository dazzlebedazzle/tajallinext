const Coupon=require("../models/couponModel");
const asyncHandler=require("express-async-handler");
const {isValidObjectId}=require("../utils/validatemongodbid");

const createCoupon=asyncHandler(async(req,res)=>{

    try{
        const newCoupon=await Coupon.create(req.body);
        res.json(newCoupon);
    }
    catch(error){
        throw new Error(error);
    }
})

//get all coupons
const getallCoupon=asyncHandler(async(req,res)=>{

    try{
        const coupon=await Coupon.find();
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
})

//update coupon

const updateCoupon=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    isValidObjectId(id);
    try{
        const updatecoupon=await Coupon.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatecoupon);
    }
    catch(error){
        throw new Error(error);
    }
})

//delete coupon
const deleteCoupon=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    isValidObjectId(id);
    try{
        const deletecoupon=await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    }
    catch(error){
        throw new Error(error);
    }
})

const useCoupon = asyncHandler(async (req, res) => {
    const { couponName, price } = req.body;
    console.log(couponName, price);

    try {
        // Check if the coupon exists
        const coupon = await Coupon.findOne({ name: couponName });
        if (!coupon) {
            res.status(404);
            throw new Error('No coupon exists with this name');
        }

        // Check if the coupon is expired
        const currentDate = new Date();
        if (currentDate > coupon.expiry) {
            res.status(400);
            throw new Error('Coupon has expired');
        }

        // Apply discount
        const discountedPrice = price - (price * (coupon.discount / 100));

        // 🧨 If it's one-time use, delete it after use
        if (coupon.isOneTime) {
            await Coupon.deleteOne({ _id: coupon._id });
            console.log(`One-time coupon '${couponName}' deleted after use.`);
        }


        res.json({ originalPrice: price, discountedPrice, discount: coupon.discount,  oneTimeUsed: coupon.isOneTime });
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
});
module.exports={createCoupon,getallCoupon,updateCoupon,deleteCoupon,useCoupon};