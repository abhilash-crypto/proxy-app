const { createProxyMiddleware } = require("http-proxy-middleware");
const routes = require("../config/routes");

/**
 * Mounts each configured route onto the express app as
 * a proxy middleware pointing at its target upstream.
 */
function mountProxyRoutes(app) {
  routes.forEach((route) => {
    app.use(
      route.path,
      createProxyMiddleware({
        target: route.target,
        changeOrigin: route.changeOrigin ?? true,
        pathRewrite: route.pathRewrite || {},
        on: {
          error: (err, req, res) => {
            console.error(`[proxy error] ${route.path} ->`, err.message);
            if (!res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
            }
            res.end(
              JSON.stringify({
                error: true,
                message: `Upstream ${route.target} unreachable`,
              })
            );
          },
        },
      })
    );
    console.log(`[route] ${route.path} -> ${route.target}`);
  });
}

module.exports = mountProxyRoutes;
