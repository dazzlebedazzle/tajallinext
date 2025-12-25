// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('../models/userModel'); // Adjust the path as necessary

// const authMiddleware = asyncHandler(async (req, res, next) => {
//     let token;
  
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       try {
//         token = req.headers.authorization.split(' ')[1];
  
//         // Decode token to get user I D
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         // Find the user by ID and attach it to the request object
//         req.user = await User.findById(decoded.id).select('-password');
//         // console.log(req.user);
      
   
//         if (!req.user) {
//           res.status(401);
//           throw new Error('Not authorized, user not found');
//         }


  
//         next();
//       } catch (error) {
//         console.error(error);
//         res.status(401);
//         throw new Error('Not authorized, token failed');
//       }
//     }
  
//     if (!token) {
//       res.status(401);
//       throw new Error('Not authorized, no token');
//     }
//   });

//   //is admin function

//   const admin = asyncHandler(async (req, res, next) => {
//     const {email}=req.user;
//     const adminuser= await User.findOne({email});
//     if (adminuser.role!=='admin') {
//       res.status(403);
//       throw new Error('Not authorized as an admin');
//     } else {
//       next();
//     }
//   });
  
  
//   module.exports = { authMiddleware ,admin};


const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Adjust the path as necessary

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        // Decode token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user by ID and attach it to the request object
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }

        // Check if a guest cart exists in cookies
        if (req.cookies.guestCart) {
          let guestCart = JSON.parse(req.cookies.guestCart);
          
          if (guestCart.length > 0) {
            console.log("Merging guest cart with user cart...");

            // Merge guest cart with user's database cart
            guestCart.forEach(guestItem => {
              const existingItemIndex = req.user.cart.findIndex(item =>
                item.productId.toString() === guestItem.productId && item.weight === guestItem.weight
              );

              if (existingItemIndex !== -1) {
                // If the product already exists, update quantity
                req.user.cart[existingItemIndex].quantity += guestItem.quantity;
              } else {
                // Otherwise, add new product
                req.user.cart.push(guestItem);
              }
            });

            await req.user.save();  // Save the updated cart
            res.clearCookie('guestCart');  // Remove guest cart after merging
          }
        }

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
});

// Admin authorization middleware
const admin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if (adminUser.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized as an admin');
    } else {
      next();
    }
});

module.exports = { authMiddleware, admin };
