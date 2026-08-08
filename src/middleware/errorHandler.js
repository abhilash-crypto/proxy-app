/**
 * Catches errors thrown/passed anywhere in the request chain
 * (including proxy errors) and returns a clean JSON response.
 */
function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 502).json({
    error: true,
    message: err.message || "Bad gateway",
    path: req.originalUrl,
  });
}

module.exports = errorHandler;
