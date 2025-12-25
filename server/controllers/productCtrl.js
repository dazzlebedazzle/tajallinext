const Product=require("../models/productModel");
const asyncHandler=require("express-async-handler");
const slugify=require("slugify");
const User=require('../models/userModel');
const { isValidObjectId } = require("mongoose");
const cloudinaryuploadImg=require("../utils/cloudinary");
const fs = require('fs');
const Category=require('../models/category');


const createProduct = asyncHandler(async (req, res) => {
  try {
    console.log("🟢 Received product body:", req.body);

    // 1. Slug generation from title
    if (req.body.title) {
      let titlePart = req.body.title.split("|")[0].trim();
      let slug = slugify(titlePart, { lower: true, strict: true });

      let existingProduct = await Product.findOne({ slug });
      let count = 1;
      while (existingProduct) {
        slug = `${slug}-${count}`;
        existingProduct = await Product.findOne({ slug });
        count++;
      }

      req.body.slug = slug;
    }

    // 2. Clean aboutProduct
    if (!Array.isArray(req.body.aboutProduct)) {
      req.body.aboutProduct = [];
    } else {
      req.body.aboutProduct = req.body.aboutProduct
        .map(val => (typeof val === "string" ? val.trim() : null))
        .filter(Boolean);
    }

    // 3. Clean weights
    // 3. Clean weights
// ✅ Normalize weights safely
if (!Array.isArray(req.body.weights)) {
  if (typeof req.body.weights === "string") {
    req.body.weights = req.body.weights
      .split(",")
      .map(w => w.trim())
      .filter(Boolean);
  } else {
    req.body.weights = [];
  }
} else {
  req.body.weights = req.body.weights
    .map(w => (typeof w === "string" ? w.trim() : null))
    .filter(Boolean);
}


    // 4. Validate details
    const defaultDetails = {
      origin: '',
      addedPreservatives: '',
      fssaiApproved: '',
      vegNonVeg: '',
      storage: '',
      allergen: '',
      netQuantity: '',
      height: '',
      length: '',
      width: ''
    };

    req.body.details = { ...defaultDetails, ...(req.body.details || {}) };

    // 5. Ensure images array
    if (!Array.isArray(req.body.images)) {
      req.body.images = [];
    }

    // 6. Create product
    const newProduct = await Product.create(req.body);
    console.log("✅ Product created:", newProduct._id);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
});




// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  // Extract query parameters
  const { limit, page, sortBy, order, ...filters } = req.query;
  console.log(req.query);

  // Convert limit and page to numbers (default to 10 and 1 respectively)
  const limitNum = parseInt(limit, 100) || 100;
  const pageNum = parseInt(page, 100) || 1;
  const skipNum = (pageNum - 1) * limitNum;

  // Build query conditions based on filters
  const queryConditions = {};
  Object.keys(filters).forEach(key => {
    if (typeof filters[key] === 'string') {
      queryConditions[key] = { $regex: filters[key], $options: 'i' }; // Case-insensitive regex search
    } else {
      queryConditions[key] = filters[key];
    }
  });

  // Build the Mongoose query
  let query = Product.find(queryConditions);

  // Apply sorting if specified
  if (sortBy) {
    const sortOrder = order === 'desc' ? -1 : 1; // Default to ascending order
    query = query.sort({ [sortBy]: sortOrder });
  }

  // Apply pagination and limiting
  query = query.skip(skipNum).limit(limitNum);
  if (req.query.page) {
    const productCount = await Product.countDocuments(queryConditions);
    if (skipNum >= productCount) throw new Error("This page does not exist");
  }

  // Execute the query
  const products = await query.exec();

  // Respond with the products
  res.json(products);
});
    

//update product

// const updateProduct = asyncHandler(async (req, res) => {
//     try {
//         if(req.body.title){
//             req.body.slug=req.body.title;
//         }
//       const { id } = req.params;
//       const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
//       if (!updatedProduct) {
//         res.status(404).json({ message: 'Product not found' });
//       } else {
//         res.status(200).json(updatedProduct);
//       }
//     } catch (error) {
//       throw new Error(error);
//     }
//   });

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.title) {
      // Extract text before the first "|"
      let titlePart = req.body.title.split("|")[0].trim();

      // Generate slug
      let slug = slugify(titlePart, { lower: true, strict: true });

      // Ensure uniqueness
      let existingProduct = await Product.findOne({ slug });
      let count = 1;
      while (existingProduct) {
        slug = `${slug}-${count}`;
        existingProduct = await Product.findOne({ slug });
        count++;
      }

      req.body.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update Slug 

const updateSlug = async (req, res) => {
  try {
    const { productId, slug } = req.body;

    // Ensure slug is unique
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ error: "Slug already exists, choose another one." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { slug },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json({ message: 'Product deleted' });
      }
    } catch (error) {
      throw new Error(error);
    }
  });
// Get Single Product
const getProductById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
   
      const product = await Product.findById(id);
      console.log(product);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      throw new Error(error);
    }
  });
  

  //get single product by slug 
 const getProductBySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("Requested Slug:", slug);

    // Find product by slug instead of ID
    const product = await Product.findOne({ slug: slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// const getProductBySlug = asyncHandler(async (req, res) => {
//   try {
//     const { slug } = req.params;
//     console.log(slug);
 
//     const product = await Product.findById(slug);
//     console.log(product);
//     if (!product) {
//       res.status(404).json({ message: 'Product not found' });
//     } else {
//       res.status(200).json(product);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

//add to wishlist

const addToWishlist=asyncHandler(async(req,res)=>{
  const { _id}=req.user;
  const {prodId}=req.body;
  try {
    const user=await User.findById(_id);
    const alreadyadded= await user.wishlist.find((id)=>id.toString()===prodId);
    if(alreadyadded){

      let user = await User.findByIdAndUpdate(
        _id,
        {
        $pull: {wishlist:{prodId}},
      },
      {
        new:true,
      }
    );
    res.json(user);

    }
    else{
      let user = await User.findByIdAndUpdate(
        _id,
        {
        $push: {wishlist:prodId},
      },
      {
        new:true,
      }
    );
    res.json(user);

    }
  } catch (error) {
    throw new Error(error);
  }

})

//rating functionality

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId,comment } = req.body;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure product.ratings is an array and each rating has a postedby property
    let alreadyRated = product.ratings.find(
      (rating) => rating.postedby && rating.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      // Update existing rating
      const updateRating = await Product.updateOne(
        {
          _id: prodId,
          "ratings._id": alreadyRated._id
        },
        {
          $set: { "ratings.$.star": star,"ratings.$.comment": comment}
        },
        {
          new: true
        }
      );
    } else {
      // Add new rating
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment:comment,
              postedby: _id
            }
          }
        },
        {
          new: true
        }
      );
    }
    //get all rating function
    const getallratings=await Product.findById(prodId);
    let totalRating=getallratings.ratings.length;
    let ratingsum=getallratings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0);
    let actualRating=Math.round(ratingsum/totalRating);
    let finalproduct=await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating:actualRating,
      },
      {new:true},
    );
    res.json(finalproduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//upload images function


const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // if (!isValidObjectId(id)) {
  //   res.status(400);
  //   throw new Error("Invalid product ID");
  // }

  try {
    const uploader = (path) => cloudinaryuploadImg(path, "images");
    const urls = [];
    const files = req.files;
    

    for (const file of files) {
      const { path } = file;
      console.log("path", path);
      const {url}=  await uploader(path);
      urls.push(url);  
      console.log("1");                                                     
      //fs.unlinkSync(path);
      console.log("2");
    }

    const findProduct = await Product.findByIdAndUpdate(
      
      id,
      {
        images: urls, // Directly map the URLs array to the images field
      },
      { new: true }
    );
console.log(findProduct);
    if (!findProduct) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(findProduct);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});


//search function
const searchProducts = async (req, res) => {
  console.log('1234');

  
  let { query } = req.query;
    query = query.trim();

  try {
    // Step 2: Check if the search query matches any category name
    const category = await Category.findOne({ name: query });

    let products;
    if (category) {
      // Step 3: If a category is found, fetch products based on the category
      products = await Product.find({ category: category.name });
    } else {
      // Step 4: If no category is found, search for products based on the product title
      products = await Product.find({ title: { $regex: query, $options: 'i' } });
    }

    res.status(200).json({ products });
   
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

  module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    addToWishlist,
    rating,
    uploadImages,
    searchProducts,
    updateSlug,
    getProductBySlug
  };
