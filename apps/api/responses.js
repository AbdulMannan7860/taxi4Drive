function sendSuccess(res, data = {}, message = "", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendError,
  sendSuccess
};
