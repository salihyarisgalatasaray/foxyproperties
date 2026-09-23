# FOXY Property — Test Credentials

## Admin / Back Office (PostgreSQL `backoffice_users`, role ADMIN)
- Email: `admin@foxyproperty.co.uk`
- Password: `Sa281616@`
- Login pages: `/admin` (property CRUD) and `/backoffice` (leads/CRM)
- Seeded idempotently by `/app/scripts/seed-admin.js` (run via `/app/scripts/db-setup.sh`).
  Override with env `ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding if needed.

## Database (local preview)
- `DATABASE_URL` in `/app/.env.local` → `postgresql://foxy:<pw>@localhost:5432/foxy`
- Re-provision after a cluster reset: `bash /app/scripts/db-setup.sh`
- Reset lead rate-limit during testing: `TRUNCATE request_limits;`
