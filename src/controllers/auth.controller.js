const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // 👉 Se l'account è stato creato via Google
    if (user.authProvider === 'google') {
      return res.status(400).json({
        message: 'Questo account è stato registrato con Google. Usa il login con Google.'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password non corretta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Errore login' });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Registration attempt for:', email);

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: existingUser.authProvider === 'google'
            ? 'Questa email è collegata a un account Google. Usa Accedi con Google.'
            : 'Email già registrata'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Username già in uso'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      lastLogin: Date.now()
    });

    console.log('User created:', user._id);

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      characters: user.characters,
      lastLogin: user.lastLogin
    };

    res.status(201).json({
      success: true,
      user: userData,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    const { user } = req;
    const token = generateToken(user);

    res.json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during Google authentication'
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error during logout'
      });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

// Login with Google
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Token mancante' });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Migliora qualità immagine profilo (se possibile)
    const highResPicture = picture?.replace('=s96-c', '=s400-c') || picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        profileImage: {
          url: highResPicture
        },
        authProvider: 'google',
        googleId
      });
    } else {
      // Aggiorna immagine profilo solo se non esiste o se l'utente usa Google
      if (!user.profileImage || user.authProvider === 'google') {
        user.profileImage = {
          url: highResPicture
        };
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      message: 'Login con Google riuscito',
      user,
      token
    });
  } catch (err) {
    console.error('Errore login Google:', err);
    res.status(500).json({ message: 'Errore durante il login con Google' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Account eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'account' });
  }
}; 