const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 🛡️ Sicurezza HTTP
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id']
}));

// 🧠 Parser JSON e form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📋 Log richieste
app.use(morgan('dev'));

// 🔐 Sessioni utente
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 ore
  }
}));

// 🔑 Passport.js per login OAuth/Sessioni
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport'); // configura strategie

// 🧱 Rate Limiting su /api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// 📦 Rotte API
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const characterSheetRoutes = require('./routes/characterSheet.routes'); // ✅ la rotta per immagini e schede
const aiRoutes = require('./routes/ai.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/character-sheets', characterSheetRoutes); // ✅ collega le route delle schede
app.use('/api/ai', aiRoutes);
// ✅ Test base
app.get('/', (req, res) => {
  res.json({ message: 'DnD Companion API is running' });
});

// 🧯 Middleware errori generico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;






