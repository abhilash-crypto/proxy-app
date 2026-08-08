const morgan = require("morgan");

/**
 * Returns a configured morgan logger, or a no-op middleware
 * if request logging is disabled via env var.
 */
function requestLogger() {
  const enabled = process.env.ENABLE_REQUEST_LOGGING !== "false";

  if (!enabled) {
    return (req, res, next) => next();
  }

  // [method] url -> status (response time ms)
  return morgan(":method :url -> :status (:response-time ms)");
}

module.exports = requestLogger;
