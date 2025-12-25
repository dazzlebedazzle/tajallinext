const user=require("../models/userModel");
const asyncHandler=require("express-async-handler");
const {generateToken}=require("../config/jwtToken");
const {generateRefreshToken}=require("../config/refreshtoken");
const {isValidObjectId}=require("../utils/validatemongodbid");
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
const {emailsender}=require('./emailCtrl');
const cloudinaryuploadImg=require("../utils/cloudinary");
const fs = require('fs');
const Order=require('../models/orderModel');

const generateReferralCode = (firstname, lastname) => {
  return (
    firstname.toLowerCase() +
    lastname.toLowerCase() +
    Math.random().toString(36).substring(2, 6)
  );
};




const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password, referralCode } = req.body;

  const existingUser = await user.findOne({ email});
  const existingUsermob = await user.findOne({ mobile});

  if (existingUser || existingUsermob) {
    throw new Error("User already exists");
  }

  let referredBy = null;
  let discount = 0;

  // If referral code is used
  if (referralCode) {
    const referrer = await user.findOne({ referralCode });

    if (!referrer) {
      throw new Error("Invalid referral code");
    }

    // Give 10% discount to both
    referredBy = referralCode;
    discount = 100;

    referrer.discount = (referrer.discount || 0) + 100;
    await referrer.save();
  }

  const geneateReferalCode = generateReferralCode(firstname, lastname)
  // Create user with unique referral code
  const newUser = await user.create({
    firstname,
    lastname,
    email,
    mobile,
    password,
    referralCode:geneateReferalCode,
    referredBy,
    referralLink:`https://tajalli.co.in/share/${geneateReferalCode}`,
    discount
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      discount: newUser.discount,
      referredBy: newUser.referredBy,
      referralCode: newUser.referralCode,
      referralLink:newUser.referralLink
    }
  });
});
// const createUser= asyncHandler(async(req,res)=>{
//    const email= req.body.email;
//    const findUser= await user.findOne({email: email});
  
//    if(!findUser){
//       const newUser=user.create(req.body);
//       res.json(newUser);
//    }else{
//       throw new Error("user already exists");
//    }
//   })

const getReferredUsers = asyncHandler(async (req, res) => {
  const currentUser = await user.findById(req.user._id);

  if (!currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const referralCode = currentUser.referralCode;

  // Find all users referred by current user's referral code
  const referredUsers = await user.find({ referredBy: referralCode })
    .select("firstname lastname email discount createdAt")
    .sort({ createdAt: -1 });

  // Calculate total discount earned (assuming it's stored in `discount`)
  const totalPoints = referredUsers.reduce((acc, user) => acc + (user.discount || 0), 0);

  res.status(200).json({
    message: "Referred users fetched successfully",
    totalPoints,
    count: referredUsers.length,
    users: referredUsers,
  });
});



//applyreferallDiscount
const applyReferralDiscount = asyncHandler(async (req, res) => {

  const { totalPrice } = req.body;

  const User = await user.findById(req.user._id);
  if (!User) {
    return res.status(404).json({ message: "User not found" });
  }

  if ((User.discount || 0) < 100) {
    return res.status(400).json({ message: "Not enough points to apply discount" });
  }

  // Calculate 10% discount
  const discountAmount = totalPrice * 0.1;

  // Deduct 10 points
  User.discount -= 100;
  await User.save();

  res.status(200).json({
    message: "Referral discount applied successfully",
    discountAmount,
    remainingPoints: User.discount
  });
});


//login
  const loginUser= asyncHandler(async(req,res)=>{
   const { email, password } = req.body;

  const findUser=await user.findOne({email});
  if(findUser && (await findUser.comparePassword(password))){
    const refreshToken = await generateRefreshToken(findUser._id);
    const updateuser=await user.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken:refreshToken,
      },
      {new:true}
    );
    res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      maxAge:72*60*60*100,
    });
   res.json({
     id:findUser?._id,
      firstname:findUser?.firstname,
      lastname:findUser?.lastname,
      email:findUser?.email,
      mobile:findUser?.mobile,
      role:findUser?.role,
      profileImage:findUser?.profileImage,
      discount: findUser?.discount,
      referredBy: findUser?.referredBy,
      referralCode: findUser?.referralCode,
      referralLink:findUser.referralLink,

      token:generateToken(findUser?._id),
   });
   }
  else{
   throw new Error("invallid credential");
  }
   
  });

  // get all users
  const getAllUsers = asyncHandler(async (req, res) => {
   try{
      const users = await user.find();
  res.json(users);
   }
   catch(error){
      throw new Error(error);
   }
 });

 //update a user

 const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming req.user contains the user ID
  console.log(userId);
  isValidObjectId(userId);
  const updateData = req.body;
 
  if (updateData.password) {
    return res.status(400).json({ message: 'Password cannot be changed through this endpoint. Please use the reset password option.' });
  }

  try {
    // If a file is provided in the request, handle image upload
   
  
    const updatedUser = await user.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update operation
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

 //get a single user

 const getUser = asyncHandler(async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


 //delete a user

 const deleteUser = asyncHandler(async (req, res) => {
   
  try {
    console.log('Request Params:', req.params);
    const User = await user.findByIdAndDelete(req.params.id).select('-password');
    if (User) {
      res.json(User);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

//block and unblock user

const blockUser = asyncHandler(async (req, res) => {
  const User = await user.findById(req.params.id);
  const {id} = req.params;
  isValidObjectId(id);
  if (!User) {
    res.status(404);
    throw new Error('User not found');
  }
  user.Isblocked = true;
  await User.save();
  res.status(200).json({ message: 'User blocked successfully' });
});

const unblockUser = asyncHandler(async (req, res) => {
  const User = await user.findById(req.params.id);
  const {id} = req.params;
  isValidObjectId(id);
  if (!User) {
    res.status(404);
    throw new Error('User not found');
  }
  user.Isblocked = false;
  await User.save();
  res.status(200).json({ message: 'User unblocked successfully' });
});

//handling refreshtoken

const handleRefreshToken = asyncHandler(async (req, res) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: 'No refresh token provided' });
    }

    // Find user by refresh token
    const User = await user.findOne({ refreshToken });
    if (!User) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || User.id !== decoded.id) {
        return res.status(403).json({ message: 'Failed to verify refresh token' });
      }

      // Token is valid, proceed to generate a new access token
      const newAccessToken = generateToken(User.id);

      // Send the new access token as response
      res.json({ newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//logout

const logout= asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token not found' });
  }

  try {
      const User = await user.findOne({ refreshToken });

      if (!User) {
          res.clearCookie('refreshToken', { httpOnly: true, secure: true });
          return res.sendStatus(204);
      }

      await user.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
      res.clearCookie('refreshToken', { httpOnly: true, secure: true });
      return res.sendStatus(204);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

//update password
const updatePassword = asyncHandler(async (req, res) => {
  const { id} = req.user;
  const {password}=req.body;

  
    // Validate MongoDB ID
    isValidObjectId(id);

    // Find user by ID
    const User = await user.findById(id);
    if (password) {
      User.password=password;
      const updatePassword=await User.save();
      res.json(updatePassword)  
    }
    else{
      res.json(User);
    }

    
});

//forgot password token

const forgotPasswordToken=asyncHandler(async(req,res)=>{

  const {email}=req.body;
  const User=await user.findOne({email});


  if(!User) throw new Error("no user found with this email");
  try { const reset_link =process.env.RESET_LINK;
      const token= await User.createPasswordResetToken();
      console.log(token);
      await User.save();
      const resetURL = `${reset_link}/reset-password/${token}`;
      const data={
        to:email,
        subject:"forgot password link",
        text:"hey user",
        htm: `Hi, use this link within 10 minutes to reset your password: <a href="${resetURL}">click here</a>`
      }
      emailsender(data);
      res.json(token);
  } catch (error) {
      throw new Error(error);
  }

})

//reser password
const resetPassword=asyncHandler(async(req,res)=>{
const {password}=req.body;
const {token}=req.params;

const hashedToken= crypto.createHash('sha256').update(token).digest('hex');
console.log(hashedToken);
const User=await user.findOne({
  passwordResetToken:hashedToken,
  passwordResetExpires:{$gt:Date.now()},

});
if(!User) throw new Error("token expired please try again later");
User.password=password;
User.passwordResetToken=undefined;
User.passwordResetExpires=undefined;
await User.save();
res.json(User);
})

const updateUserProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const { url: newPath } = await cloudinaryuploadImg(filePath);
    
    // Delete the file after uploading
    fs.unlinkSync(filePath);

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { profileImage: newPath },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//user ordered products
const getUserOrders = async (req, res) => {
  const  userId = req.user.id; // Assuming user IDs are passed in the request body

 

  try {
    // Find users by the provided user IDs
    const Users = await user.findById(userId);

    if (!Users ) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Collect all order IDs from the users' orders attribute
    const allOrderIds = Users.orders;
     

    // Fetch the order details using the collected order IDs
    const orders = await Order.find({ _id: { $in: allOrderIds } });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching users orders:', error);
    res.status(500).json({ message: "Failed to fetch users orders" });
  }
};
module.exports={createUser,loginUser,getAllUsers,getUser,deleteUser,updateUser, blockUser, unblockUser,handleRefreshToken,logout,updatePassword,forgotPasswordToken,resetPassword,updateUserProfileImage,getUserOrders,getReferredUsers,applyReferralDiscount};
