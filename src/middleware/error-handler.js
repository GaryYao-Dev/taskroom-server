const logger = require('../utils/logger'); // Create the logger instance
const errorHandler = (err, req, res, next) => {

  logger.error(err.message);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Bad Request', message: err.message });
  }

  if (err.name === 'NotFoundError') {
    return res
      .status(404)
      .json({ error: 'Resource not found', message: err.message });
  }

  if (err.name === 'CastError') {
    return res
      .status(400)
      .json({ error: 'CastError', message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ error: 'ValidationError', message: err.message });
  }

  if (err.code && err.code === 11000) {
    return res
      .status(400)
      .json({ error: 'Duplicate key error', message: err.message });
  }
  next();
  return res
    .status(500)
    .json({ error: 'Internal Server Error', message: err.message });
};

module.exports = errorHandler;
