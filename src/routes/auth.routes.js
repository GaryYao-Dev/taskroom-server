const authRouter = require('express').Router();
const {
  authenticateLocal,
  emailVerified,
  authenticateJWT,
  authenticateGoogle, 
  authenticateGoogleCallback
} = require('../middleware/auth.middleware');
const {
  register,
  login,
  verifyEmail,
  sendVerificationEmail,
  generateOTP,
  verifyOTP,
  resetPassword,
  googleLogin,
} = require('../controllers/auth.controller');

authRouter.post('/register', register);
authRouter.post('/login', authenticateLocal, emailVerified, login);
authRouter.post('/verify', sendVerificationEmail);
authRouter.patch('/verifyEmail', verifyEmail);
authRouter.post('/generateOTP', generateOTP);
authRouter.post('/verifyOTP', verifyOTP);
authRouter.patch('/resetPassword', authenticateJWT, resetPassword);
authRouter.get('/google', authenticateGoogle);
authRouter.get('/google/callback', authenticateGoogleCallback , googleLogin);

module.exports = authRouter;
