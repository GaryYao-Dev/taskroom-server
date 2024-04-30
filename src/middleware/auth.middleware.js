const passport = require('passport');
const {
  jwtStrategy,
  localStrategy,
  googleStrategy,
} = require('../config/passport');
const User = require('../models/user.model');

passport.use(jwtStrategy);
passport.use(localStrategy);
passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

const authenticateJWT = passport.authenticate('jwt', { session: false });
const authenticateLocal = passport.authenticate('local', { session: false });
const emailVerified = (req, res, next) => {
  if (req.user.email_verified) {
    next();
  } else {
    res.status(401).json({ message: 'Email not verified' });
  }
};
const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
});
const authenticateGoogleCallback = passport.authenticate('google', {
  failureRedirect: 'https://taskroom.ygy3389.com/login',
});

module.exports = {
  authenticateJWT,
  authenticateLocal,
  emailVerified,
  authenticateGoogle,
  authenticateGoogleCallback,
};
