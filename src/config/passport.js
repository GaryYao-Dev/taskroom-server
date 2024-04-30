const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id).select('-hashed_password');
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

const localOptions = { usernameField: 'email' };

const localStrategy = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false);
      }
      const isMatch = await bcrypt.compare(password, user.hashed_password);
      if (!isMatch) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  },
);

module.exports = { jwtStrategy, localStrategy };
