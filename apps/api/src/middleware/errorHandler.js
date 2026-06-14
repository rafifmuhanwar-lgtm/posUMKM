const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 422;
    message = err.errors.map((e) => e.message).join(', ');
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Data conflict (already exists).';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  sendResponse(res, statusCode, false, null, message);
};

module.exports = errorHandler;
