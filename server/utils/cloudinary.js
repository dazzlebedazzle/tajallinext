const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY
});

const cloudinaryuploadImg = async (fileToUpload) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUpload, { resource_type: "auto" }, (error, result) => {
            if (error) return reject(error);
            resolve({
                url: result.secure_url,
            });
        });
    });
};

module.exports = cloudinaryuploadImg;
