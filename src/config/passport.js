require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serializzazione dell'utente per la sessione
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configurazione Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth callback ricevuto:', {
        profileId: profile.id,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName
      });

      // Cerca l'utente nel database
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        console.log('Utente esistente trovato:', user.email);
        return done(null, user);
      }

      // Se l'utente non esiste, crealo
      console.log('Creazione nuovo utente con email:', profile.emails?.[0]?.value);
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        profileImage: {
          url: profile.photos[0].value,
          publicId: null
        }
      });

      return done(null, user);
    } catch (error) {
      console.error('Errore durante l\'autenticazione Google:', error);
      return done(error, null);
    }
  }
));

module.exports = passport;
