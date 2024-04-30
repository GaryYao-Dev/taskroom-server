const express = require('express');

const {
  createColumn,
  getAllColumns,
  getColumnById,
  updateColumnById,
  deleteColumnById,
  sortTasks,
  copyColumn,
  deleteTasks,
} = require('../controllers/columns.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

const columnRouter = express.Router();

columnRouter.post('/', createColumn);
columnRouter.get('/', getAllColumns);
columnRouter.get('/:id', getColumnById);
columnRouter.patch('/:id', updateColumnById);
columnRouter.delete('/:id', deleteColumnById);
columnRouter.patch('/sort/:id', sortTasks);
columnRouter.post('/copy/:id', authenticateJWT, copyColumn);
columnRouter.delete('/tasks/:id', deleteTasks);

module.exports = columnRouter;
