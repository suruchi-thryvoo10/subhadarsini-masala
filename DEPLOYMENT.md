# Subhadarshini Deployment Guide

The live deployment runs on Vercel as two separate projects:

| Project  | Root directory | URL |
| -------- | -------------- | --- |
| Frontend | `frontend/`    | https://subhadarsini-masala.vercel.app |
| Backend  | `backend/`     | https://subhadarsini-masala-xs82-beta.vercel.app |

## 1. Backend (Vercel serverless)

`backend/vercel.json` routes every request to `backend/api/index.ts`, which
connects to MongoDB before handing the request to the Express app in
`src/app.ts`. The connection is cached on `globalThis` so warm invocations reuse
it, and `bufferCommands` is disabled so a missing/unreachable database fails
immediately with a clear error instead of a 10-second "buffering timed out".

### Required environment variables

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `MONGODB_URI` | **yes** | Without it the API returns `503 MONGODB_URI_MISSING`. There is deliberately no localhost fallback in production. |
| `JWT_SECRET` | yes | Auth token signing. |
| `JWT_REFRESH_SECRET` | yes | Refresh token signing. |
| `FRONTEND_URL` | recommended | Added to the CORS allow-list. |
| `REDIS_URL` | no | Omit it — the API falls back to an in-process cache. |
| `NODE_ENV` | no | **Leave unset.** Vercel sets it itself; forcing `development` on a deployment used to leak stack traces in API error responses. |

### MongoDB Atlas

Vercel functions do not have static outbound IPs. Under
**Atlas → Network Access**, `0.0.0.0/0` must be allow-listed, otherwise every
serverless invocation fails server selection even though `MONGODB_URI` is set.

### Verifying a deployment

```bash
curl https://<backend>/api/v1/health/db
```

It reports `readyState`, whether `MONGODB_URI` is present, and the masked
cluster host — never the credentials. A `503` response includes a hint
describing which of the two failure modes applies.

```bash
curl https://<backend>/api/v1/products | head -c 400
```

## 2. Frontend (Vercel static build)

Set `VITE_API_URL` to the backend origin (no trailing slash, no `/api` suffix).
If it is missing, `src/config/api.ts` falls back to the default production
backend so a deployed build still works, but setting it explicitly is preferred.

Product images are served from `frontend/public/images/products/` as
root-relative paths stored in the database, so they resolve identically in
local development and in production.

## 3. Local development

```bash
# terminal 1
cd backend && npm install && npm run dev      # http://127.0.0.1:5000

# terminal 2
cd frontend && npm install && npm run dev     # http://localhost:3000
```

`vite.config.ts` proxies `/api` to the local backend, so `VITE_API_URL` should
stay empty locally. If no MongoDB is reachable, the backend falls back to an
in-memory MongoDB (`mongodb-memory-server`, a devDependency) — development only.

### Re-syncing the catalogue and product images

```bash
cd backend && npm run fix:images
```

Idempotent: it upserts categories and products from `src/seed/autoSeed.ts`,
repairs any product image that drifted from `src/data/productImages.ts`, and
prints a per-category verification report.
