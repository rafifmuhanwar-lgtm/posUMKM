const sendResponse = (res, statusCode, success, data, message, meta = null) => {
  const responseBody = {
    success,
    message,
    data,
  };

  if (meta) {
    responseBody.meta = meta;
  }

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  sendResponse,
};
