const express = require('express')

const {
  createColumn,
  getAllColumns,
  getColumnById,
  updateColumnById,
  deleteColumnById,
} = require('../controllers/columns.controller')

const columnRouter = express.Router()

columnRouter.post('/', createColumn)
columnRouter.get('/', getAllColumns)
columnRouter.get('/:id', getColumnById)
columnRouter.patch('/:id', updateColumnById)
columnRouter.delete('/:id', deleteColumnById)

module.exports = columnRouter