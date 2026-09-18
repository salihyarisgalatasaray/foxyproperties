# FOXY Property — Test Credentials & Local Services

## Back Office admin (seeded via scripts-seed-user.mjs)
- URL: `/admin-login`
- Email: `admin@foxyproperty.co.uk`
- Password: `FoxyAdmin2026!Demo`
- Role: `ADMIN` (full RBAC matrix)

> Demo/local credential for the Emergent Preview only. Not a production account.
> Re-seed with: `DATABASE_URL="$DATABASE_URL" node scripts-seed-user.mjs <email> <password> "<name>" <ROLE>`

## Local PostgreSQL (pod-local dev database)
- DATABASE_URL: `postgresql://foxy:a2d0887a5d533d92344a942e@localhost:5432/foxy`
- Role `foxy` (LOGIN, SUPERUSER for local dev), database `foxy`
- Cluster: PostgreSQL 15 (`pg_ctlcluster 15 main start`) — auto-started by the frontend runner.
- Migrations applied: `database/migrations/001_crm.sql`, `002_auth_security.sql`

## Runtime topology (Emergent preview run-glue)
- Next.js app (at `/app`) runs on port 3000 via `/app/frontend` runner (`next dev`).
- `/api/*` requests are routed by the ingress to port 8001, where a FastAPI reverse
  proxy (`/app/backend/server.py`) forwards them to the Next.js server on 3000.
- Env: `/app/.env.local` (server secrets; git-ignored).

## Not yet configured (optional integrations — degrade gracefully)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `SANITY_API_READ_TOKEN` (homepage falls back to local FOXY copy)
- `NEXT_PUBLIC_MAPBOX_TOKEN` (map shows a placeholder; area navigation still works)
