# FOXY Property MASTER PLATFORM V2 — PRD & Working Notes

## Original problem statement (V2)
Transform the existing FOXY Property app into a premium end-to-end London property platform:
DISCOVER → BUY → INVEST → FINANCE → LET → MANAGE → MONITOR → SELL. Serve buyers, sellers,
investors, landlords, portfolio landlords, tenants, overseas buyers and management clients.
Preserve ALL existing working architecture (routes, calculators, DB, auth, RBAC, Back Office,
cinematic hero, brand). NOT a generic estate-agent template. **HMO is OUT OF SCOPE.**
DO NOT DEPLOY/PUBLISH — build + test in preview and stop for approval.

## Brand / compliance rules (must hold)
- Colours: bg #0B0B0A/#0E0E0E, gold #D4AF37, soft-gold #B9953E, ivory #F4F0E8, muted #A7A29A.
- Serif (Playfair) headlines; Inter for UI/data. Premium British, architectural, cinematic.
- NOT FCA authorised; NO FCA number; NOT "Independent Mortgage Adviser"/"Whole of Market".
- All investment/rental/finance figures = ILLUSTRATIVE, never guaranteed. No "GUARANTEED RENT".
- No invented properties/prices/yields/testimonials/clients/awards/memberships/fees.
- Prototype/concept imagery clearly labelled ("CONCEPT IMAGERY · NOT A LIVE LISTING").
- Regulatory memberships, protection products & fees = configurable, shown only when verified.

## Tech stack
Next.js 16 (App Router) + React 19 + TS (strict) + Tailwind v4; GSAP/ScrollTrigger cinematic hero;
PostgreSQL (`pg`) for CRM/auth/properties; Emergent Object Storage for images; Sanity + Mapbox
optional (graceful fallback). bcryptjs + HttpOnly signed session cookie + RBAC.

## Runtime topology (preview run-glue, git-ignored)
- Next.js on :3000 via `/app/frontend/package.json` runner (`next start`, PRODUCTION build).
- **Changes require `yarn build` + `supervisorctl restart frontend`** (no hot reload in prod mode).
- Ingress: `/api/*` → :8001 (FastAPI reverse proxy `/app/backend/server.py`) → Next.js :3000.
- Secrets in `/app/.env.local`. Local PostgreSQL 15.
- **DB bootstrap:** `/app/scripts/db-setup.sh` (idempotent: role+db+migrations+admin seed) is now
  invoked by the runner before `next start`. `/app/scripts/seed-admin.js` seeds the ADMIN user.
- Preview URL: https://dev-foxy-pull.preview.emergentagent.com

## DB schema
- leads {id,type,source,status,name,email,phone,message,marketing_consent,privacy_notice_version,assigned_to,created_at,updated_at}
- activities, audit_logs, request_limits (rate limit)
- backoffice_users {id,email,name,password_hash,role[ADMIN|PROPERTY|FINANCE|MARKETING|CONTENT],active}
- properties {id,title,description,location/area,price,property_type,listing_type,bedrooms,bathrooms,sqft,status,photos,...}

## Lead `type` enum (extended in V2 Phase A)
PROPERTY_ENQUIRY, VIEWING, INVESTMENT, MORTGAGE, BUY_TO_LET, REMORTGAGE, PORTFOLIO, SELLER,
LANDLORD, TENANT, VALUATION, MANAGEMENT, SWITCH, MAINTENANCE, LETTING, CONSULTATION, GENERAL.

## What was done BEFORE V2 (V7 / phases 1–4 — all verified)
- Audit & stabilisation, TS fixes, production-mode serving (fixed hydration).
- Cinematic scroll hero (7-stage GSAP, 4K responsive assets, reduced-motion fallback).
- Homepage: animated overlay + hero search + featured (PROTOTYPE) properties.
- Admin panel `/admin/properties`: property CRUD, Live⇄Coming Soon, object-storage photo upload
  with drag-and-drop reorder + cover. Public `/properties` filters + slider. `/backoffice` leads/RBAC.
- Calculators: `/calculators/mortgage`, `/calculators/buy-to-let`. Areas `/areas` + `/areas/[slug]`.

## ✅ GLOBAL POLISH — scroll reveals, page transitions, gold-gradient CTAs (2026-06, VERIFIED, iteration_14, frontend 100%)
- `components/site/ScrollReveal.tsx`: IntersectionObserver reveals every `main section` on non-home pages (fade+slide),
  above-fold revealed instantly, reduced-motion safe, observer disconnected on cleanup. Homepage excluded (bespoke anim).
- `components/site/RouteTransition.tsx`: subtle `.page-fade` between routes; skips /admin & /backoffice to avoid remounting stateful trees.
- `globals.css`: `.reveal/.is-in`, `.page-fade`, and site-wide gold→amber gradient + lift/glow on hover for CTA
  buttons/links (`a/button.bg-[#D4AF37]`). Full-screen hero, Playfair/Inter typography and mobile responsiveness were already in place.
- Verified iteration_14: 0 stuck sections across 7 pages, transitions & hovers work, reduced-motion + responsive (390/768/1440, 0 overflow), admin/backoffice load, 0 console errors.

## ✅ V2 VISUAL REDESIGN — Homepage to reference mockup (2026-06, VERIFIED, iteration_13, frontend 100%)
- Hero cinematic scroll restored (2026-06): `HomeHero` is now a pinned sticky section (215vh desktop / 165vh
  mobile) with GSAP ScrollTrigger scrub — the London image zooms (scale 1.05→1.45), content rises+fades, plus
  subtle desktop mouse parallax; reduced-motion = static 100vh hero. Removed WestLondon `-mt-[4vw]` overlap so
  the hero is a clean full page (next section no longer peeks in at the bottom).
- New premium header (`SiteHeader.tsx`): transparent-over-hero → dark translucent+blur on scroll; nav Buy▾/Rent/Invest/HMO/Sell/Let/Landlords/Property Lab/Mortgages/Areas/Insights/About + Login(/admin) + Get Started(/contact); hamburger below 1280px.
- New homepage (`app/page.tsx`) = curated cinematic bands (consolidated, no repeated journeys):
  HomeHero (full-viewport 3840px London skyline, scene rail 01-07, Buy/Rent/Invest/HMO search → /properties)
  → WestLondon → InteriorSection (floating PROTOTYPE price panel) → PropertyLab (SELL/LET/BTL/HMO/REFINANCE/MANAGE
  tabs, architectural cutaway + HMO room labels + ILLUSTRATIVE analysis panel) → FeaturedEditorial (IVORY band,
  image-led prototype cards) → Finale (terrace skyline, ABOUT/BOOK CTAs). Components in `src/components/home/`.
- Diagonal clip-path section dividers; IntersectionObserver `Reveal` fade-ins; hero ken-burns; all reduced-motion safe.
- `PropertySearch` now consumes intent(hmo/invest→buy)/beds/type from the hero query.
- Assets in `/public/home/`: hero.jpg genuine 3840×2339 (Unsplash); west/interior real photos 2560px; lab_house.jpg
  & finale.jpg AI CONCEPT (~1264px, labelled). Old CinematicHero/LifecycleJourney/PropertyLifecycle/FeaturedProperties
  retained in repo but no longer on homepage.
- Verified iteration_13: all testids/links, header scroll toggle, search wiring, Property Lab tabs+HMO, responsive 390/768/1440 zero overflow, reduced-motion, regression pages clean, 0 console errors.

## ✅ RESPONSIVE AUDIT (2026-06, VERIFIED, iteration_12, frontend 100%)
- All 13 routes checked at mobile 390 / tablet 768 / desktop 1440 = 39/39 with ZERO horizontal overflow.
- Mega-menu fits one row at 1024 & 1280; hamburger + mobile panel below 1024; heroes, lead forms,
  ManagementSlider, PropertyLifecycle tiles and footer all fit and stack correctly at every width.
- Tuned oversized headings for tablet: `/areas/[slug]` h1 → text-5xl→lg:text-8xl; `/areas` h1 responsive scale.

## ✅ V2 PHASE F (partial) — Homepage Journey (2026-06, VERIFIED, iteration_10, frontend 100%)
- **Featured Properties staggered reveal** (`components/property/FeaturedProperties.tsx`, now client):
  GSAP ScrollTrigger fades + slides the heading and 3 prototype cards in with a 0.16s stagger as the
  section enters view, then clearProps so the hover lift still works; reduced-motion shows cards
  immediately. Verified iteration_11 (frontend 100%, normal + reduced-motion).- `components/hero/LifecycleJourney.tsx` (NEW): cinematic GSAP ScrollTrigger scrub section placed right
  after the hero, continuing the story through 8 stages (PROPERTY VALUE → INVESTMENT → FINANCE → LETTING
  → TENANT → RENT → MANAGEMENT → LANDLORD DASHBOARD), each with crossfading full-bleed visual + editorial
  caption + CTA into the matching page; right-side progress rail; reduced-motion stacked fallback; mobile lighter.
- `components/property/PropertyLifecycle.tsx` (NEW): interactive "ONE PROPERTY. EVERY STAGE." selector
  (BUY→FINANCE→LET→MANAGE→REVIEW→SELL) with hover/focus detail panel + click-through to each journey.
- 8 cohesive AI CONCEPT images generated (Gemini nano-banana) in the FOXY dark/gold aesthetic, stored at
  `/public/journey/*.jpg`, dashboard stage labelled CONCEPT.
- Wired into `src/app/page.tsx`: Hero → LifecycleJourney → decision → PropertyLifecycle → Featured → Footer.
- Verified: 8 captions scrub to full opacity at distinct depths, all CTAs correct, interactive panel updates,
  reduced-motion fallback readable, mobile no overflow, all assets 200, zero console errors. Type-check 0, build green.

## ✅ V2 PHASE A — Navigation + Core Service Pages (2026-06, VERIFIED, iteration_9, 92%→fixed)
New/changed files:
- `components/navigation/SiteHeader.tsx` — rebuilt premium MEGA-MENU (PROPERTIES, SELL, LETTINGS,
  LANDLORDS, INVESTMENT, MORTGAGES, AREAS, INSIGHTS, ABOUT) + EN|TR + BOOK A CONSULTATION,
  hover dropdowns + full mobile panel (data-testids: nav-*, nav-sub-*, nav-mobile-toggle/panel, nav-m-*).
- `components/navigation/SiteFooter.tsx` — 4-column footer + full compliance disclaimer block.
- `components/site/PageHero.tsx` (concept-imagery label, CTAs), `components/site/JourneyRail.tsx`.
- `components/lead/LeadForm.tsx` — reusable, POST /api/leads, honeypot + privacy + marketing consent.
- `components/landlord/LandlordJourney.tsx` — "What would you like us to help with?" 7 needs → contextual form.
- `components/management/ManagementSlider.tsx` — YOU MANAGE ↔ FOXY MANAGES (Let Only/Rent Collection/Fully Managed).
- Pages: `/sell`, `/lettings`, `/landlords`, `/property-management`, `/investment`, `/mortgages`,
  `/insights`, `/about`, `/contact`. Added SiteHeader+SiteFooter to `/properties`, `/areas`, `/areas/[slug]`,
  and SiteFooter to homepage.
- `api/leads/route.ts` — enum extended; rateLimit() moved inside try/catch (DB failure → 503 not 500).
- `scripts/db-setup.sh` + `scripts/seed-admin.js` (new) wired into runner.
Verified: type-check 0 errors, prod build green (all routes), mega-menu + mobile nav, all 9 pages render,
lead forms persist (curl 201 for LANDLORD/CONSULTATION), admin login 200 / bad 401, ManagementSlider + LandlordJourney work.

## ROADMAP — remaining V2 phases (priority order)
- **Phase B (P0):** Interactive landlord tools — Rental Valuation (`/landlords/rental-valuation`),
  Landlord Service Options comparison, Landlord Revenue Simulator, Sell-or-Let tool (`/tools/sell-or-let`),
  Landlord Health Check, Rent-protection/certainty (configurable, no guarantees).
- **Phase C (P0):** Compliance Centre (`/landlords/compliance`) + Renters' Rights (Act 2025) — WEB RESEARCH
  GOV.UK/legislation.gov.uk, record SOURCE + DATE CHECKED + JURISDICTION; FOXY credentials blank until verified.
- **Phase D (P1):** Tenant experience (`/rent`, `/rent/register`, `/tenants`, `/tenants/maintenance`),
  Maintenance portal (ticket statuses + emergency guidance), Landlord/Tenant portals (My FOXY, RBAC-separated, DEMO-labelled).
- **Phase E (P1):** Back Office expansion — lead pipelines (Sales/Landlord/Buyer/Finance), lettings/landlords/
  tenancies/rent/management/maintenance modules; Switch-to-FOXY doc upload; Portfolio landlords.
- **Phase F (P2):** Homepage cinematic extension (more stages: investment→finance→letting→management→landlord),
  Property Lifecycle interactive section, property-detail lettings fields, unified BUY/RENT search, SEO/structured data.
- **Config/integrations still needed:** Sanity + Mapbox keys; managed prod DATABASE_URL + fresh prod secrets;
  verified FOXY fees/memberships/regulatory status; production security hardening (CSRF/CSP/TLS/retention).

## DO NOT
- Do not deploy/publish or connect foxyproperty.co.uk (awaiting approval).
- Do not build HMO anything. Do not invent data/fees/credentials/guarantees.
- Do not switch to `next dev` (breaks over ingress). Rebuild after code changes.
