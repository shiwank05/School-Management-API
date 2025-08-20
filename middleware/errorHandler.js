function errorHandler(err, req, res, next) {
  console.error('Error:', err.stack);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry detected'
    });
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      success: false,
      message: 'Database table not found'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

module.exports = errorHandler;