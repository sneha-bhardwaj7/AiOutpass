// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// // Debug — remove after confirming it works
// console.log("☁️  Cloudinary config loaded:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY ? "✅ set" : "❌ MISSING",
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ MISSING",
// });

module.exports = cloudinary;