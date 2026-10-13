# Move FOXY to a Next.js job + external PostgreSQL

## 1. Create the database (Neon or Supabase, Postgres 15+)
- Neon: neon.tech → New project → region **London / EU West** → copy the connection string
  (`postgresql://USER:PASS@HOST/DB?sslmode=require`)
- Supabase: supabase.com → New project → Settings → Database → Connection string (URI, "Session" pooler)
- Keep `?sslmode=require` at the end.

## 2. Save the code to GitHub
- In this job: "Save to GitHub" (chat input bar).

## 3. Create the new Emergent job
- Template: **Next.js + FastAPI** (`nextjs-fastapi`), import the GitHub repo.
- App is at repo root: `yarn build` → `next build`, `yarn start` → migrations + admin seed + `next start` (port 3000).
- `/frontend` and `/backend` here are preview-only glue for the old template; the new template does not need them.

## 4. Deployment secrets / env vars (values: copy from this job's /app/.env.local)
| Key | Notes |
|---|---|
| DATABASE_URL | **New** external Postgres URL from step 1 |
| BACKOFFICE_SESSION_SECRET | Use a NEW long random value in production |
| RATE_LIMIT_SECRET | Use a NEW long random value in production |
| ADMIN_EMAIL | optional, default info@foxyproperties.co.uk |
| ADMIN_PASSWORD | Primary admin password (seeded on first start only) |
| EXTRA_ADMIN_PASSWORD | Password for yaris@credys.co.uk (omit to skip) |
| EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, LEAD_NOTIFY_EMAIL | Email notifications |
| EMERGENT_LLM_KEY, INTEGRATION_PROXY_URL | Object Storage (media/videos) |
| NEXT_PUBLIC_MAPBOX_TOKEN | Maps |
| NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_READ_TOKEN | CMS |
| NEXT_PUBLIC_WHATSAPP_NUMBER | WhatsApp button |

## 5. First start
- `yarn start` runs `scripts/db-migrate.js` (creates all tables, tracked in `schema_migrations`) and `scripts/seed-admin.js`, then starts Next.js.
- Manual run against any DB: `DATABASE_URL=... yarn db:migrate`

## 6. Check after deploy
- `/` loads with videos (served from Object Storage via `/api/media/...`)
- `/admin-login` → sign in as info@foxyproperties.co.uk
- Submit a Contact enquiry → shows in Back Office → Enquiries, emails arrive
- Re-create Agent users and data (preview data is NOT copied; export with `pg_dump` from this job if needed)

## Optional: copy existing preview data
`pg_dump --data-only --exclude-table=schema_migrations --exclude-table=request_limits "$OLD_URL" | psql "$NEW_URL"` (after step 5 created the tables)
