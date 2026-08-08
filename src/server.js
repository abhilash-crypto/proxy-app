require("dotenv").config();

const express = require("express");
const cors = require("cors");

const requestLogger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const mountProxyRoutes = require("./routes/proxy");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
  })
);
app.use(requestLogger());

// Health check — useful for load balancers / uptime monitors
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Mounts every route defined in src/config/routes.js
mountProxyRoutes(app);

// Fallback for anything not matched by a proxy route
app.use((req, res) => {
  res.status(404).json({ error: true, message: "No matching proxy route" });
});

// Must be registered last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
