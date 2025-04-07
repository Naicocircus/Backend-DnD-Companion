const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Ottieni il token dall'header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Autenticazione richiesta' });
    }

    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Trova l'utente
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }

    // Aggiungi l'utente alla richiesta
    req.user = user;
    next();
  } catch (error) {
    console.error('Errore di autenticazione:', error);
    res.status(401).json({ message: 'Token non valido' });
  }
};

module.exports = auth; 