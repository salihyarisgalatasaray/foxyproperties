# FOXY Property MVP V7

V7 connects the public website, CMS content and protected FOXY Back Office into one production-oriented scaffold.

## Included
- Next.js App Router public site and cinematic FOXY hero
- Homepage copy binding from Sanity with safe local fallbacks
- Areas / London Intelligence and Mapbox scaffold from V6
- Property search/detail, mortgage and buy-to-let calculators
- PostgreSQL CRM persistence
- Back Office sign-in with HttpOnly signed session cookie
- RBAC roles: ADMIN, PROPERTY, FINANCE, MARKETING, CONTENT
- Permission checks on protected Back Office APIs
- Transaction-safe lead status + activity + audit updates
- Server-side Zod validation
- Database-backed rate-limit baseline for login and public lead submission
- Honeypot-compatible lead schema
- Separate marketing consent and privacy notice version

## Database
Run in order:
```bash
psql "$DATABASE_URL" -f database/migrations/001_crm.sql
psql "$DATABASE_URL" -f database/migrations/002_auth_security.sql
```

Create the first Back Office user (use a strong unique password):
```bash
DATABASE_URL="$DATABASE_URL" node scripts-seed-user.mjs admin@example.com 'YOUR-STRONG-PASSWORD' 'FOXY Admin' ADMIN
```

## Environment
Copy `.env.example` to `.env.local`. `BACKOFFICE_SESSION_SECRET`, `RATE_LIMIT_SECRET`, database credentials and Sanity read tokens are server secrets and must not use the `NEXT_PUBLIC_` prefix.

## Sanity
Add the exported `homepage` schema to the Studio schema registry alongside the existing `area` schema. The public homepage uses published content when Sanity is configured and falls back to the approved FOXY copy if it is unavailable.

For a full editorial workflow, wire Sanity Presentation / Draft Mode / Visual Editing in the Studio deployment. Keep any draft read token server-only.

## Security gates before production
This is a strong application scaffold, not a substitute for deployment security review. Before public launch:
- terminate TLS at the hosting edge and configure secure production environment variables;
- use a managed PostgreSQL service with encrypted backups and least-privilege credentials;
- put the Back Office behind the chosen production identity/MFA strategy if stronger assurance is required;
- configure trusted proxy/IP handling before relying on `x-forwarded-for` for abuse controls;
- add CSRF/origin protections appropriate to the final hosting/auth topology;
- add CSP and security headers;
- define retention/deletion workflows and complete privacy/legal review;
- add monitoring, alerting, dependency scanning and restore testing;
- do not expose Back Office routes until the database migrations and auth secrets are configured.

## Regulatory copy
This build does not claim FCA authorisation, an FCA number, whole-of-market status, independent adviser status, guaranteed returns, or guaranteed mortgage eligibility. Finance calculators remain illustrative.
