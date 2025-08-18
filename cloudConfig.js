const cloudinary = require("cloudinary").v2;
const {cloudinaryStorage, CloudinaryStorage} = require("multer-storage-cloudinary");

//connect with cloudinary
cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,   

});

//cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "MentorMap",
        allowed_formats: ["jpg", "png" , "jpeg"],
        transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" }
        ]

    }
});

module.exports = {
    cloudinary,
    storage,
}