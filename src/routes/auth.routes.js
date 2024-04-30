const authRouter = require('express').Router();
const {
  authenticateLocal,
  emailVerified,
} = require('../middleware/auth.middleware');
const {
  register,
  login,
  verifyEmail,
  sendVerificationEmail,
} = require('../controllers/auth.controller');

authRouter.post('/register', register);
authRouter.post('/login', authenticateLocal, emailVerified, login);
authRouter.post('/verify', sendVerificationEmail);
authRouter.patch('/verifyEmail', verifyEmail);

module.exports = authRouter;
