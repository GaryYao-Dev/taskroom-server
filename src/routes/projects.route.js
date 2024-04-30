const express = require('express');
const {
  postProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProjectById,
  getProjectDataById,
  generateInviteLink,
  joinProject,
} = require('../controllers/project.controller');

const { authenticateJWT } = require('../middleware/auth.middleware');

const projectRouter = express.Router();

projectRouter.post('/', authenticateJWT, postProject);
projectRouter.get('/', getAllProjects);
projectRouter.get('/:id', getProjectById);
projectRouter.patch('/:id', updateProject);
projectRouter.delete('/:id', authenticateJWT, deleteProjectById);
projectRouter.get('/data/:id', getProjectDataById);
projectRouter.get('/invite/:id', generateInviteLink);
projectRouter.post('/join/', authenticateJWT, joinProject);

module.exports = projectRouter;
