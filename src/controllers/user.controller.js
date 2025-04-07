const User = require('../models/User');
const uploadToCloudinary = require('../config/cloudinary');

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato' });
    }

    // Upload su Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'dnd-companion/profile-images');

    // Aggiorna utente nel DB
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    user.profileImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
    await user.save();

    res.status(200).json({ success: true, profileImage: user.profileImage });
  } catch (err) {
    console.error('Errore upload immagine:', err);
    res.status(500).json({ message: 'Errore durante il caricamento immagine' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero utenti' });
  }
}; 