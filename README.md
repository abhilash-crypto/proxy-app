# Proxy App

A simple, configurable HTTP/reverse proxy server built with Node.js + Express + http-proxy-middleware.

## Structure

```
proxy-app/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── server.js            # entry point
    ├── config/
    │   └── routes.js        # define your path -> upstream target mappings here
    ├── middleware/
    │   ├── logger.js        # request logging
    │   └── errorHandler.js  # centralized error responses
    └── routes/
        └── proxy.js         # mounts proxy middleware from config/routes.js
```

## Setup

```bash
cd proxy-app
npm install
cp .env.example .env
```

Edit `.env` to set your port and default target.
Edit `src/config/routes.js` to add/change which paths forward to which upstream servers.

## Run

```bash
npm start
```

For auto-restart on file changes during development:

```bash
npm run dev
```

## How it works

- Any request to a path prefix defined in `src/config/routes.js` (e.g. `/api/*`) gets
  forwarded to that route's `target` upstream server.
- `pathRewrite` lets you strip or rewrite the path before it reaches the upstream
  (e.g. `/api/users` → `/users`).
- `GET /health` returns `{ status: "ok" }` — point your load balancer/uptime check here.
- Unmatched paths return a `404` JSON response.
- Upstream failures (e.g. target server down) return a `502` JSON response instead of hanging.

## Example

With this route in `src/config/routes.js`:

```js
{ path: "/api", target: "http://localhost:5000", pathRewrite: { "^/api": "" } }
```

A request to `http://localhost:3000/api/users` gets forwarded to `http://localhost:5000/users`.

## Adding a new upstream

Just add another object to the array in `src/config/routes.js` — no other code changes needed.
