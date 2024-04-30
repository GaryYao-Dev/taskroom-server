const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/jwt');
const { sendMail } = require('../utils/nodemailer');
const { html } = require('../templates/verificationEmailTemplates');

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
      html(user.username, token, req.headers.origin),
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
      { new: true },
    );
    if (user.email_verified) {
      res.status(200).json({ message: 'Email verified' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  sendVerificationEmail,
  verifyEmail,
};
