const express = require('express');
const passport = require('passport');
const router = express.Router();
const { 
  login, 
  register, 
  googleCallback, 
  logout, 
  googleLogin,
  deleteAccount 
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User');

// @route   GET /api/auth/google
// @desc    Auth with Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  googleCallback
);

// @route   GET /api/auth/logout
// @desc    Logout user
router.get('/logout', protect, logout);

// ✅ GET /api/auth/user - restituisce utente completo dal DB
router.get('/user', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.json(user);
  } catch (error) {
    console.error('Errore nel recupero utente:', error);
    res.status(500).json({ message: 'Errore nel recupero utente' });
  }
});

// Test protected route
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', register);

// @route   POST /api/auth/google-login
// @desc    Login with Google (frontend)
router.post('/google-login', googleLogin);

// @route   DELETE /api/auth/delete
// @desc    Delete account
router.delete('/delete', protect, deleteAccount);

// ❗️ Debug routes - solo per sviluppo
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({}).select('+password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/debug/users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All users deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;