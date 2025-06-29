import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Uploads a file to Cloudinary (image or video).
 * @param {string} filePath - Local path to the file.
 * @param {'image' | 'video'} resourceType - Type of the media.
 * @returns {Promise<object>} - Cloudinary upload result.
 */
export const uploadOnCloudinary = async (filePath, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
