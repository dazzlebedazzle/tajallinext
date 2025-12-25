const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { log } = require('console');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Multer upload configuration
const uploadPhoto = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 2MB
});

// Sharp image resize function
const productImgResize = async (req, res, next) => {
  if (!req.file) return next();
  
  const file = req.file;
  console.log(file);
  const newFilePath = path.join(__dirname, "../public/images/products/", file.filename);
  
  fs.rename(file.path, newFilePath, (err) => {
    if (err) {
      console.error("Error moving file:", err);
      return next(err);
    }
    
    // Update the file path to the new location
    file.path = newFilePath;
    next();
  });
};

module.exports = { productImgResize, uploadPhoto };
