const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/api/v1/auth/google/callback',
};

const googleStrategy = new GoogleStrategy(
  googleOptions,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const email = profile.emails[0].value;
      const user = await User.findOne({ email });
      console.log('user', user, 'profile', profile);
      if (user) {
        user.googleId = profile.id;
        user.email_verified = true;
        await user.save();
        return done(null, user);
      }
      const newUser = await new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        email_verified: true,
      }).save();
      return done(null, newUser);
    } catch (err) {
      return done(err, false);
    }
  },
);

module.exports = { jwtStrategy, localStrategy, googleStrategy };
