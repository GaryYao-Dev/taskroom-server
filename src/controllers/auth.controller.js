const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/jwt');
const { sendMail } = require('../utils/nodemailer');
const {
  html: verificationEmail,
} = require('../templates/verificationEmailHtml');
const { html: resetPasswordEmail } = require('../templates/resetPasswordHtml');
const { html: otpEmail } = require('../templates/otp');
const NotFoundError = require('../errors/not.found');

const User = require('../models/user.model');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: name,
      email,
      hashed_password: hashedPassword,
    });

    !user && res.status(400).json({ message: 'User could not be created' });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
};

const login = (req, res) => {
  const token = generateToken(req.user);
  return res.json({ token });
};

const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (user.email_verified) {
      res.status(208).json({ message: 'Email already verified' });
      return;
    }

    const token = generateToken({ id: user.id });

    const infoRes = await sendMail(
      'Verify your email',
      email,
      verificationEmail(user.username, token, req.headers.origin)
    );
    if (infoRes?.accepted.includes(email)) {
      res.status(200).json({ message: 'Email sent' });
    }
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const { id } = verifyToken(token);
    const user = await User.findByIdAndUpdate(
      id,
      { email_verified: true },
      { new: true }
    );
    if (user.email_verified) {
      res.status(200).json({ message: 'Email verified' });
    }
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const token = generateToken({ id: user.id });
    const infoRes = await sendMail(
      'Reset your password',
      email,
      resetPasswordEmail(user.username, token, req.headers.origin)
    );
    if (infoRes?.accepted.includes(email)) {
      res.status(200).json({ message: 'Email sent' });
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const id = req.user.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findById(id);
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (isMatch) {
      res.status(400).json({
        message: 'New password must be different from the previous password.',
      });
      return;
    }

    await user.updateOne({ hashed_password: hashedPassword });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

const generateOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiredAt = Date.now() + 60 * 1000 * 5;
    await User.findByIdAndUpdate(
      user.id,
      {
        otp: {
          code: hashedOTP,
          expiredAt,
          attemps: 0,
        },
      },
      { runValidators: true }
    ).exec();

    const infoRes = await sendMail(
      'Reset your password',
      email,
      otpEmail(user.username, otp)
    );
    if (infoRes?.accepted.includes(email)) {
      res.status(200).json({ message: 'OTP sent successfully' });
    }

    throw new Error('Error while sending OTP');
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user.id) {
      throw new NotFoundError(`User with email ${email} not found`);
    }
    console.log('here');
    const { code, expiredAt, attemps } = user.otp;
    if (attemps >= 3) {
      res.status(400).json({ message: 'Too many attempts' });
      return;
    }
    const isMatch = await bcrypt.compare(otp, code);
    if (!isMatch) {
      user.otp.attemps = attemps + 1;
      await user.save();
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    const now = Date.now();
    if (now > expiredAt) {
      res.status(400).json({ message: 'OTP expired' });
      return;
    }

    user.otp = undefined;
    await user.save();

    const token = generateToken({ id: user.id });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    res.redirect(`https://taskroom.garyyao.au/login?token=${token}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  generateOTP,
  verifyOTP,
  googleLogin,
};
