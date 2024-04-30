const passport = require('passport');
const { jwtStrategy, localStrategy } = require('../config/passport');

passport.use(jwtStrategy);
passport.use(localStrategy);

const authenticateJWT = passport.authenticate('jwt', { session: false });
const authenticateLocal = passport.authenticate('local', { session: false });
const emailVerified = (req, res, next) => {
  if (req.user.email_verified) {
    next();
  } else {
    res.status(401).json({ message: 'Email not verified' });
  }
};

module.exports = {
  authenticateJWT,
  authenticateLocal,
  emailVerified,
};
