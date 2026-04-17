import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
  // Only configure Cloudinary if credentials are provided
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('✅ Cloudinary Connected');
  } else {
    console.log('⚠️  Cloudinary not configured (optional for development)');
  }
};

export default connectCloudinary;
