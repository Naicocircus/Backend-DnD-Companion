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

// Debug route - RIMUOVERE IN PRODUZIONE
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({}).select('+password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TEMPORARY: Delete all users route
router.delete('/debug/users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All users deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', register);

// @route   POST /api/auth/google-login
// @desc    Login with Google
router.post('/google-login', googleLogin);

// @route   GET /api/auth/user
// @desc    Get user data
router.get('/user', (req, res) => {
  res.json(req.user);
});

// Test protected route
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.delete('/delete', protect, deleteAccount);

module.exports = router; 