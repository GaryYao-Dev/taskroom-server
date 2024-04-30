const express = require('express');
const {
  postUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  getUserProfile,
  getProjectsForUser,
} = require('../controllers/users.controller');
// const { validateUser } = require('../middleware/userValidation');

const { authenticateJWT } = require('../middleware/auth.middleware');

const userRouter = express.Router();

userRouter.post('/', postUser);
userRouter.get('/', getAllUsers);
userRouter.get('/projects', authenticateJWT, getProjectsForUser);
userRouter.get('/:id', authenticateJWT, getUserById);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUserById);
userRouter.get('/profile', authenticateJWT, getUserProfile);

module.exports = userRouter;
