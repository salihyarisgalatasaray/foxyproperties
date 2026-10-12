# FOXY Property — Test Credentials

## Admin / Back Office (PostgreSQL `backoffice_users`, role ADMIN)
- Email: `info@foxyproperties.co.uk`
- Password: `Sa281616@`
- Login pages: `/admin` (property CRUD) and `/backoffice` (leads/CRM)
- Seeded idempotently by `/app/scripts/seed-admin.js` (run via `/app/scripts/db-setup.sh`).
  Override with env `ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding if needed.

## Database (local preview)
- `DATABASE_URL` in `/app/.env.local` → `postgresql://foxy:<pw>@localhost:5432/foxy`
- Re-provision after a cluster reset: `bash /app/scripts/db-setup.sh`
- Reset lead rate-limit during testing: `TRUNCATE request_limits;`

## Seeded test leads (for /backoffice/pipeline demo)
- 5 landlord/valuation leads inserted (Amelia Hartley, James Okoro, Priya Shah, Daniel Weiss, Sofia Marchetti)
  across types VALUATION/SWITCH/MANAGEMENT/LETTING + 1 non-matching PROPERTY_ENQUIRY. Safe to delete.
- Login path for Back Office when unauthenticated redirects to `/admin-login`.

## Back office management modules (migration 004)
- Tables: clients, appointments, offers, commissions. Pages under /backoffice: appointments, clients, offers, commissions + dashboard KPIs. Nav gated: appointments/clients/offers -> leads:read; commissions -> finance:read.
- Seed data inserted during testing (John Buyer client/appointment/offer/commission). Safe to delete.

## User Management + Enquiries (migration 006)
- Primary admin is now `info@foxyproperties.co.uk` / `Sa281616@` (old admin@foxyproperty.co.uk is auto-renamed/deactivated)
- Second admin: `yaris@credys.co.uk` (seeded by scripts/seed-admin.js)
- Test agent (created via UI/API, currently DEACTIVATED): `agent.test@foxyproperties.co.uk` / `Agent12345!` role AGENT
- Roles: ADMIN = everything incl. /backoffice/users; AGENT = only /backoffice/enquiries
- Public form: Contact page -> POST /api/enquiries. Admin: /backoffice/enquiries, /backoffice/users
