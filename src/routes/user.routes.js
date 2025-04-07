const express = require('express');
const { getAllUsers } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../utils/imageUpload');
const User = require('../models/User');

const router = express.Router();

// Upload immagine profilo
router.post('/upload-profile-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessuna immagine caricata' });
    }

    // Upload su Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);
    
    // Aggiorna utente nel DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        profileImage: {
          url: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Restituisci l'utente completo aggiornato
    res.json({ 
      success: true,
      user: updatedUser,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    console.error('Errore upload immagine:', error);
    res.status(500).json({ 
      message: 'Errore durante il caricamento dell\'immagine',
      error: error.message 
    });
  }
});

// Get all users
router.get('/', getAllUsers);

module.exports = router; 