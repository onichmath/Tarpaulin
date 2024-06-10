const {ServerError} = require('../utils/error.js');

module.exports.errorHandler = (res, err) => {
  console.error('Error handler received:\n', err);
  if (err instanceof ServerError) {
    res.status(err.code).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal Server Error" });
}

