/**
 * Define your proxy routes here.
 *
 * path        - the incoming path prefix to match (on this proxy server)
 * target      - the upstream server to forward matching requests to
 * pathRewrite - optional, rewrite the path before sending upstream
 * changeOrigin- usually true, makes the proxy set the Host header to match target
 */

module.exports = [
  {
    path: "/api",
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // /api/users -> /users on target
  },
  {
    path: "/auth",
    target: "http://localhost:6000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  },

  // Add more routes below as needed, e.g.:
  // {
  //   path: "/media",
  //   target: "https://cdn.example.com",
  //   changeOrigin: true,
  // },
];
