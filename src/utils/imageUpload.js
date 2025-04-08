const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const axios = require('axios');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
});

// Upload image to Cloudinary
const uploadToCloudinary = async (fileOrUrl) => {
  try {
    // Caso 1: è un oggetto multer (ha buffer)
    if (fileOrUrl?.buffer) {
      const b64 = Buffer.from(fileOrUrl.buffer).toString('base64');
      const dataURI = `data:${fileOrUrl.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'dnd-companion/profile-images',
        resource_type: 'auto',
        transformation: [
          { width: 200, height: 200, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    //  Caso 2: è un'immagine base64 (stringa data:image...)
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(fileOrUrl, {
        folder: 'dnd-companion/profile-images',
        resource_type: 'auto',
        transformation: [
          { width: 200, height: 200, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    //  Caso 3: è un URL remoto (es. immagine OpenAI)
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('http')) {
      console.log('Scarico immagine da URL remoto:', fileOrUrl);
      
      const response = await axios.get(fileOrUrl, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data).toString('base64');
      const dataURI = `data:image/png;base64,${base64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'dnd-companion/profile-images',
        resource_type: 'auto'
      });
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    throw new Error('Formato immagine non supportato');
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw new Error(`Errore nel caricamento su Cloudinary: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Error deleting image');
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
}; 