module.exports = {
  success: (res, status = 200, message = 'Success', data = null) => {
    res.status(status).json({
      success: true,
      message,
      data
    });
  },

  error: (res, status = 500, message = 'Error', error = null) => {
    console.error(error);
    res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};