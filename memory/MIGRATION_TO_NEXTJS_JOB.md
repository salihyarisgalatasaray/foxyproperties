# Move FOXY to a Next.js job + external PostgreSQL

## 1. Database — DONE: Neon project `foxy` (morning-dust-07708297), branch production, db foxydb, London
- Schema + admins already applied. In the new job: copy DATABASE_URL + DATABASE_URL_UNPOOLED from this job's .env.local (or `neon link --project-id morning-dust-07708297 --branch production` + `neon env pull`)

### (original instructions)
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
| DATABASE_URL | Neon pooled URL (app traffic) |
| DATABASE_URL_UNPOOLED | Neon direct URL (migrations/seed) |
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


## Ready-to-paste prompt for the NEW job (choose "Full Stack App", mention Next.js)
> Bu GitHub reposundaki FOXY Properties uygulamasını taşıyoruz: Next.js 16 App Router SSR uygulaması repo kökünde (`yarn build` = next build, `yarn start` = migrations + admin seed + next start, port 3000). Veritabanı harici Neon PostgreSQL (node-postgres; app DATABASE_URL pooled, migrations DATABASE_URL_UNPOOLED). Lütfen Next.js şablonunu kullan, `memory/MIGRATION_TO_NEXTJS_JOB.md` ve `memory/PRD.md` dosyalarını oku, .env.local'ı birlikte oluşturalım, ön izlemeyi çalıştır, test et ve yayına al.

## Secrets to enter (Publish → Manage Publishes → Secrets → Custom keys)
DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_BRANCH, BACKOFFICE_SESSION_SECRET (new), RATE_LIMIT_SECRET (new),
ADMIN_EMAIL, ADMIN_PASSWORD, EXTRA_ADMIN_PASSWORD, EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, LEAD_NOTIFY_EMAIL,
EMERGENT_LLM_KEY, INTEGRATION_PROXY_URL, NEXT_PUBLIC_MAPBOX_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID,
NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_READ_TOKEN, NEXT_PUBLIC_WHATSAPP_NUMBER
Note: NEXT_PUBLIC_* values are baked in at build time — they must also be in the new job's .env.local before building.
Note: Object Storage media (homepage videos/property photos) live under the old job's storage namespace; verify /api/media works in the new job, else re-upload with scripts/upload_home_clips.py.
