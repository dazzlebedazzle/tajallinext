// // controllers/cartController.js

// const User = require('../models/userModel');
// const asyncHandler = require('express-async-handler');

// // Get user's cart
// const getCart = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);
//   res.json(user.cart);
// });


// // Add to cart
// const addToCart = asyncHandler(async (req, res) => {
//   const { productId, title, image, category, weight, totalPrice, quantity,cartId } = req.body;
//   const user = await User.findById(req.user.id);

//   if (!user.cart) {
//     user.cart = [];
//   }

//   // Check if the item already exists in the cart with the same productId and weight
//   const existingItemIndex = user.cart.findIndex(item =>
//     item.productId.toString() === productId && item.weight === weight
//   );

//   if (existingItemIndex !== -1) {
//     // If exists, update the quantity
//     user.cart[existingItemIndex].quantity += quantity;
//   } else {
//     // If not exists, add the new item
//     user.cart.push({ productId, title, image, category, weight, totalPrice, quantity,cartId });
//   }

//   await user.save();
//   res.json(user.cart);
// });

// // Remove from cart
// const removeFromCart = asyncHandler(async (req, res) => {
//   const { productId, weight } = req.body;
//   const user = await User.findById(req.user.id);

//   // Filter out the item based on productId and weight
//   user.cart = user.cart.filter(item =>
//     !(item.productId.toString() === productId && item.weight === weight)
//   );

//   await user.save();

//   res.json(user.cart);
// });

// // Update cart item quantity
// const updateCartQuantity = asyncHandler(async (req, res) => {
//   const { productId, weight, quantity } = req.body;
//   const user = await User.findById(req.user.id);
  
//   // Find the cart item by productId and weight
//   const cartItem = user.cart.find(item =>
//     item.productId.toString() === productId && item.weight === weight
//   );

//   if (cartItem) {
//     // Update the quantity of the found cart item
//     cartItem.quantity = quantity;
//   }
//   else{console.log("item not found")}
//   console.log(cartItem.quantity);
//   await user.save();
  
//   res.json(user.cart);
// });




// module.exports = {
//   getCart,
//   addToCart,
//   removeFromCart,
//   updateCartQuantity
// };


const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Get user's cart (Handles both guest and logged-in users)
const getCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    // Guest cart from local storage
    const guestCart = req.cookies.guestCart ? JSON.parse(req.cookies.guestCart) : [];
    return res.json(guestCart);
  }

  // Logged-in user's cart
  const user = await User.findById(req.user.id);
  res.json(user.cart);
});

// Add to cart (Handles both guest and logged-in users)
const addToCart = asyncHandler(async (req, res) => {
  const { productId, title, image, category, weight, totalPrice, quantity, cartId,slug } = req.body;


  if (!req.user) {
    // If user is not logged in, store cart in cookies
    let guestCart = req.cookies.guestCart ? JSON.parse(req.cookies.guestCart) : [];

    // Check if the item already exists in the guest cart
    const existingItemIndex = guestCart.findIndex(item =>
      item.productId === productId && item.weight === weight
    );

    if (existingItemIndex !== -1) {
      guestCart[existingItemIndex].quantity += quantity;
    } else {
      guestCart.push({ productId, title, image, category, weight, totalPrice, quantity, cartId,slug });
    }

    // Store updated guest cart in cookies
    res.cookie('guestCart', JSON.stringify(guestCart), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json(guestCart);
  }

  // If user is logged in, update the database cart
  const user = await User.findById(req.user.id);
  if (!user.cart) user.cart = [];

  // Check if the item already exists in the user's cart
  const existingItemIndex = user.cart.findIndex(item =>
    item.productId.toString() === productId && item.weight === weight
  );

  if (existingItemIndex !== -1) {
    user.cart[existingItemIndex].quantity += quantity;
  } else {
    user.cart.push({ productId, title, image, category, weight, totalPrice, quantity, cartId,slug });
  }

  await user.save();
  res.json(user.cart);
});

// Merge guest cart with user cart after login
// const mergeCartAfterLogin = asyncHandler(async (req, res) => {
//   console.log("merger called")
//   if (!req.user) return res.status(401).json({ message: "User not logged in" });

//   const user = await User.findById(req.user.id);
//   let guestCart = req.cookies.guestCart ? JSON.parse(req.cookies.guestCart) : [];

//   // Merge guest cart items into user's cart
//   guestCart.forEach(guestItem => {
//     const existingItemIndex = user.cart.findIndex(item =>
//       item.productId.toString() === guestItem.productId && item.weight === guestItem.weight
//     );

//     if (existingItemIndex !== -1) {
//       user.cart[existingItemIndex].quantity += guestItem.quantity;
//     } else {
//       user.cart.push(guestItem);
//     }
//   });

//   await user.save();
//   res.clearCookie('guestCart'); // Clear guest cart after merging
//   res.json(user.cart);
// });

// const mergeCartAfterLogin = asyncHandler(async (req, res) => {
//   console.log("MergeCart called");

//   if (!req.user) return res.status(401).json({ message: "User not logged in" });

//   const user = await User.findById(req.user.id);
//   let guestCart = req.cookies.guestCart ? JSON.parse(req.cookies.guestCart) : [];

//   if (!user.cart) user.cart = []; // Ensure cart is initialized as an array

//   let cartUpdated = false;
//   console.log(guestCart)

//   // Merge guest cart into user cart
//   guestCart.forEach(guestItem => {
//     const existingItem = user.cart.find(item => 
//       item.productId.toString() === guestItem.productId && item.weight === guestItem.weight
//     );

//     if (existingItem) {
//       existingItem.quantity += guestItem.quantity; // Update quantity if item exists
//     } else {
//       user.cart.push({ ...guestItem, _id: undefined }); // Push new item to user cart
//     }
//     cartUpdated = true;
//   });

//   if (cartUpdated) {
//     await User.updateOne({ _id: user.id }, { cart: user.cart }); // Use updateOne for reliability
//     res.clearCookie('guestCart'); // Clear guest cart after merging
//     return res.json(user.cart);
//   }
  
//   return res.json({ message: "No new items to merged", cart: user.cart });
  
        
// });

const mergeCartAfterLogin = asyncHandler(async (req, res) => {
  console.log("MergeCart called");

  if (!req.user) return res.status(401).json({ message: "User not logged in" });

  const user = await User.findById(req.user.id);
  let guestCart = req.body.guestCart; // Extract guestCart from request body

  if (!Array.isArray(guestCart) || guestCart.length === 0) {
    return res.status(400).json({ message: "Guest cart is empty or invalid" });
  }

  if (!user.cart) user.cart = []; // Ensure user's cart is initialized

  let cartUpdated = false;

  console.log("Guest Cart:", guestCart);
  console.log("User's Existing Cart:", user.cart);

  // Merge guest cart into user cart
  guestCart.forEach((guestItem) => {
    const guestWeight = guestItem.weight.toString();
  
    const existingItem = user.cart.find(
      (item) =>
        item.productId.toString() === guestItem.productId &&
        item.weight.toString() === guestWeight
    );
  
    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      const { cartId, _id, ...newItem } = guestItem;
  
      if (!newItem.slug) {
        console.warn("Skipping item with missing slug:", newItem);
        return;
      }
  
      user.cart.push({
        ...newItem,
        weight: guestWeight, // ensure consistent type
      });
    }
  
    cartUpdated = true;
  });
  

  if (cartUpdated) {
    await user.save(); // Save updated cart in database
    return res.json({ message: "Cart merged successfully", cart: user.cart });
  }

  return res.json({ message: "No new items merged", cart: user.cart });
});



// Remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, weight } = req.body;

  if (!req.user) {
    // Remove item from guest cart
    let guestCart = req.cookies.guestCart ? JSON.parse(req.cookies.guestCart) : [];
    guestCart = guestCart.filter(item => !(item.productId === productId && item.weight === weight));
    res.cookie('guestCart', JSON.stringify(guestCart), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json(guestCart);
  }

  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(item => !(item.productId.toString() === productId && item.weight === weight));
  await user.save();
  res.json(user.cart);
});

// Update cart quantity
const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, weight, quantity } = req.body;

  if (!req.user) {
    // Update quantity in guest cart
    let guestCart = req.cookies.guestCart ? JSON.parse(req.cookies.guestCart) : [];
    const cartItem = guestCart.find(item => item.productId === productId && item.weight === weight);
    if (cartItem) cartItem.quantity = quantity;
    res.cookie('guestCart', JSON.stringify(guestCart), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json(guestCart);
  }

  const user = await User.findById(req.user.id);
  const cartItem = user.cart.find(item => item.productId.toString() === productId && item.weight === weight);
  if (cartItem) cartItem.quantity = quantity;
  await user.save();
  res.json(user.cart);
});

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  mergeCartAfterLogin
};
