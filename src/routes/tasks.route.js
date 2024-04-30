const express = require('express');
const {
  postTask,
  getAllTasks,
  updateTask,
  getTaskById,
  deleteTaskById,
  copyTask,
} = require('../controllers/tasks.controller');

const { authenticateJWT } = require('../middleware/auth.middleware');

const taskRouter = express.Router();

taskRouter.post('/', authenticateJWT, postTask);
taskRouter.get('/', authenticateJWT, getAllTasks);
taskRouter.get('/:id', authenticateJWT, getTaskById);
taskRouter.patch('/:id', updateTask);
taskRouter.delete('/:id', deleteTaskById);
taskRouter.post('/copy/:id', authenticateJWT, copyTask);

module.exports = taskRouter;
