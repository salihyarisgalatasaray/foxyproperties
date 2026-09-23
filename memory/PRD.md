# FOXY Property MVP V7 — PRD & Working Notes

## Original problem statement
Continue development of the existing **FOXY Property MVP V7** codebase (imported from GitHub:
`salihyaris05-ai/foxy-property-platform`, branch `main`). **Phase 1 = Codebase Audit & Stabilisation.**
Make the existing app install, type-check, build and RUN in Emergent Preview while preserving its
architecture, routes, features and premium dark-charcoal/gold brand direction. Do NOT redesign, do NOT
replace with a generic template, do NOT deploy/publish or connect a custom domain yet.

## Brand / compliance rules (must hold)
- Brand: **FOXY PROPERTY INVESTORS LTD** — premium London property, investment & property-finance platform.
- NOT FCA authorised; NO FCA number; NO "Independent Mortgage Adviser"; NO "Whole of Market".
- Mortgage/investment figures are **illustrative/estimated**, not guaranteed.
- Demo properties are **clearly labelled "PROTOTYPE · NOT A LIVE PROPERTY"**. No invented clients/yields/partners.

## Tech stack (source of truth = the repo)
Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4 (`@tailwindcss/postcss`);
GSAP + ScrollTrigger cinematic hero; Sanity CMS (optional); PostgreSQL (`pg`) for CRM/Back Office;
Mapbox GL (optional); Zod validation; bcryptjs; HttpOnly signed session cookie + RBAC.

## Runtime topology in Emergent (preview run-glue — NOT app source, git-ignored)
- Next.js app lives at `/app`, served on **:3000** by `/app/frontend/package.json` runner (`next start`, production build).
- Ingress routes `/api/*` → **:8001**, where `/app/backend/server.py` (FastAPI) **reverse-proxies to Next.js :3000**,
  preserving all App Router API routes (incl. Set-Cookie forwarding).
- Server secrets in `/app/.env.local` (git-ignored). `.yarnrc` sets `--ignore-engines` (Node 20 vs a Sanity peer dep).
- Local PostgreSQL 15 (auto-started by the runner); migrations applied; admin user seeded.

## Phase 1 — what was done (2026-06 / imported build dated 2026-09-18)
- Installed deps (yarn, `--ignore-engines`), added `postcss.config.mjs` (Tailwind v4), `next.config.js` (allowedDevOrigins).
- Fixed TS error: `properties/[slug]/page.tsx` `p.propertyId` → `p.id`.
- Made `sanity/schemaTypes/homepage.ts` dependency-free (plain schema object, matching `area.ts`) so the website
  type-checks/builds without the Studio-only `sanity` SDK. **Type-check: 0 errors. Production build: green (17 routes).**
- Stood up local PostgreSQL + ran `001_crm.sql`, `002_auth_security.sql`; seeded ADMIN user.
- Resolved CRITICAL preview-only hydration failure by serving a **production build** (`next start`) instead of
  Turbopack dev mode (dev HMR/RSC streaming broke through the ingress).
- Defense-in-depth: added `method="post"` + explicit `type="submit"` to the admin-login and finance-enquiry forms
  so credentials/PII can never leak to a URL even if JS fails.
- Scrubbed plaintext credentials that a prior dev-mode test run left in access logs.

## Verification (testing agent — iteration_2)
- Backend: **32/32 pytest (100%)** — leads, auth 401/200 + HttpOnly cookie, RBAC PATCH, public routes,
  invalid-slug 404s, compliance copy, illustrative disclaimers, prototype labels, map placeholder.
- Frontend (preview URL, **100%**): homepage cinematic hero; property search filters; both calculators reactive;
  property/area detail + PROTOTYPE labels; lead enquiry → POST /api/leads → success + persisted; Back Office
  unauth→redirect, login→dashboard, leads list + detail + activity, logout clears session; no creds-in-URL.

## Phase 2 — Cinematic Visual Hero (storyboard-driven)
- Pulled the approved asset from GitHub: `public/hero/desktop/London Luxury Property Storyboard.png` (7-panel contact sheet).
- Programmatically detected the grid geometry and cropped **7 clean photographic panels** (baked storyboard text trimmed),
  exported to `public/hero/panels/{01-london,02-westlondon,03-chelsea,04-property,05-interior,06-theview,07-foxy}.jpg`
  (+ lighter `public/hero/panels/mobile/*.jpg`). ~1 MB total.
- Rebuilt `src/components/hero/CinematicHero.tsx` into a **tall sticky, scroll-driven journey** (GSAP ScrollTrigger scrub):
  per-stage image crossfade (reveal-on-top) + continuous camera push-in (scale) + focus-pull blur + synchronized editorial
  captions, atmospheric scrims + film grain, a storyboard-style 01–07 rail, and a final FOXY stage carrying the CTA that
  transitions into the next homepage section. Timeline windows per brief (London 0–16% … FOXY 91–100%).
- Mouse = extremely subtle atmospheric parallax only (never drives the journey). `gsap.matchMedia` gates desktop (richer,
  720vh) / mobile (lighter, 560vh) / `prefers-reduced-motion` (static 100vh hero with CTA visible).
- Verified (testing agent iteration_3, frontend 100%, 9/9): scroll journey + caption order, storyboard assets actually used,
  final CTA hrefs/navigation, reduced-motion fallback, mobile responsive (no overflow), zero console errors. Type-check 0
  errors, production build green. Compliance copy unchanged/clean.
- **Sharpness upgrade:** the original storyboard crops were low-resolution (~375–500px wide), so full-bleed they looked soft.
  Replaced all 7 panels with **high-resolution 1264×848 sharp cinematic renders** (faithful to the approved storyboard scenes,
  generated using the storyboard panels as reference) at the same filenames + lighter mobile variants. Verified iteration_4 (100%).

## Phase 3 — Homepage enhancements (on top of the cinematic hero)
- **Animated opening overlay** on the London stage: eyebrow + headline "FIND YOUR PLACE IN LONDON." + subheadline + a **property search bar** (Location, Property Type = Buy/Rent/Invest, Min £, Max £), fading out as the journey begins. On-load fade/slide entrance via `gsap.from` (respects reduced-motion).
- **Hero search** submits to `/properties?location=&intent=&min=&max=`; `PropertySearch` now pre-fills the Location filter from `?location`.
- **Navbar**: gold underline hover animation (`.nav-underline`) + gold hover colour on each link and the consultation button.
- **Scroll cue**: "SCROLL TO EXPLORE" made brighter + a bouncing gold arrow (`.foxy-bounce`, reduced-motion safe).
- **Featured Properties** section below the hero: 3 cards reusing the clearly-labelled PROTOTYPE properties (self-hosted images under `/public/properties/`, area, title, £ price, Bed/Bath, PROTOTYPE label, gold "VIEW PROPERTY" → `/properties/<slug>`).
- Verified (testing agent iteration_6, frontend 100%, 9/9): entrance, search + handoff, journey preserved, nav hover, scroll cue, featured cards + navigation, reduced-motion, mobile, zero console errors. Type-check 0 errors, production build green.

## Phase 4 — Admin panel + DB-backed properties
- **Auth**: reuses the existing Postgres/bcrypt session (role `ADMIN` has `properties:edit`). New login at `/admin` → `/admin/properties`. Admin `admin@foxyproperty.co.uk` / `Sa281616@` (login min-length lowered to 8 for this 9-char password — shorter than recommended; advise a longer one before production).
- **Property management** (`/admin/properties`, guarded): add/edit/delete, Live⇄Coming Soon toggle, multi-photo upload. Fields: title, description, area, price, type (apartment/house/commercial), listing (buy/rent), beds, baths, size sqft, status, photos.
- **Storage**: Emergent Object Storage via `src/lib/storage.ts` (Node fetch, init/put/get); uploads at `POST /api/admin/upload`, served publicly through `GET /api/media/[...path]`. Keys in `.env.local` (`EMERGENT_LLM_KEY`, `INTEGRATION_PROXY_URL`).
- **Data**: `properties` table (migration `003_properties.sql`); `src/lib/propertiesDb.ts` CRUD. Public `GET /api/properties` returns ALL admin properties (LIVE + COMING_SOON) + labelled prototypes.
- **Public /properties**: rewritten filters — Buy/Rent toggle, Location, Bedrooms, Property Type, dual price-range slider (min/max); card hover = image zoom + gold border glow; real admin photos render. Detail page resolves DB property (with photo gallery) or prototype.
- Verified (testing agent iteration_7 + curl): backend 100% (7/7 admin suite; login/CRUD/upload/media/public list), UI admin CRUD/toggle/delete + public filters + slider; object storage upload→serve confirmed; COMING_SOON public listing fixed & verified. Type-check 0 errors, build green.

## Not yet configured (optional integrations — degrade gracefully, no crash)
- **Sanity**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`,
  `SANITY_API_READ_TOKEN` → homepage falls back to approved FOXY copy.
- **Mapbox**: `NEXT_PUBLIC_MAPBOX_TOKEN` → map shows a placeholder; area navigation still works.
- **PostgreSQL (production)**: currently pod-local dev DB; a managed Postgres `DATABASE_URL` is needed for prod.
- **Session/limit secrets**: `BACKOFFICE_SESSION_SECRET`, `RATE_LIMIT_SECRET` are locally generated for preview;
  set fresh production values before launch.

## Backlog (post-approval)
- P1: Provide Sanity + Mapbox credentials to light up CMS content and the London map.
- P1: Provide managed production `DATABASE_URL` and production secrets; run migrations there.
- P2: Content pages linked in the header but not yet built (`/investment`, `/mortgages`, `/about`, `/contact`).
- P2: Pin `next`/`react` versions in package.json for reproducible builds (currently `latest`).
- P0 (pre-launch, from README): TLS at edge, CSRF/origin + CSP/security headers, trusted-proxy IP handling,
  retention/deletion + privacy/legal review, monitoring/alerting, dependency scanning.

## DO NOT
- Do not deploy/publish or connect `foxyproperty.co.uk` yet (awaiting user approval).
- Do not redesign or replace the cinematic hero / brand direction.
