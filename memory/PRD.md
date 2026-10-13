# FOXY Property MASTER PLATFORM V2 — PRD & Working Notes

## ✅ CINEMATIC OPENING — scroll-scrubbed 3-chapter hero (2026-06, VERIFIED via screenshots)
- Rebuilt HomeHero into a sticky, scroll-position-driven 3-chapter sequence (London → West London → Inside),
  native scroll (no lock), rAF-throttled, advance/reverse/hold on scroll. Crossfade + restrained scroll-linked scale.
  Discreet 3-dot chapter indicator (replaced 8-scene rail). One headline group visible at a time. Localized
  bottom+left gradients only (removed heavy full overlays); smaller headings. Search shortcut in chapter 1; full
  Buy/Rent/Invest panel moved to a spacious #search section right after. Reduced-motion → static chapter-1 hero.
  FIX: removed `overflow-x-hidden` on home <main> (was breaking position:sticky, caused black frames).
- HONEST ASSET STATUS: NOT true video scrubbing / rendered frame-sequence — no genuine 4K footage/frame sequences
  available in project or via tools. Uses genuine high-res STILL photographs with scroll-scrubbed crossfades.
  Actual dims: hero.jpg 3840×2339 (true 4K width), west.jpg 2560×1717, interior.jpg 2560×1717.
  REMAINING FOOTAGE for real scrubbing: 4–6s stabilised 3840×2160 clips (or rendered image sequences) per chapter
  — (1) slow Thames/skyline, (2) West London period-street reveal, (3) restrained interior push-in — + 1080p +
  mobile crops. Text stays HTML/SVG overlays.
- Deferred: editorial re-layout of Property Lab / Invest·Finance·Let·Manage sections (not changed this pass).


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

## ✅ LEAD EMAIL NOTIFICATION — Resend via Emergent proxy (2026-06, VERIFIED via curl 201 + proxy 202)
- Every new website lead (`POST /api/leads`) triggers an email to `info@foxyproperties.co.uk` (env LEAD_NOTIFY_EMAIL).
  Sender display name "FOXY Properties" (env EMAIL_FROM_NAME). `src/lib/email.ts` (sendEmail + notifyNewLead) POSTs
  to `https://integrations.emergentagent.com/api/v1/email/send` with header `X-Email-Key` (env EMERGENT_EMAIL_KEY,
  server-side only). Base URL hardcoded constant (survives deploy).
- Compliant: recipient is server-side config (not caller input), body is a fixed HTML template with all lead fields
  escaped, no forms/inputs/links. Non-blocking: email failure is caught+logged, lead still returns 201.
- Env added to .env.local + frontend/.env + backend/.env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, LEAD_NOTIFY_EMAIL.
  Note: works in preview now; will also work once the app is deployed on a Next.js-capable template.

## ✅ REBRAND "Foxy Property" → "Foxy Properties" + EMAIL (2026-06, VERIFIED via screenshots)
- Site-wide rename of all brand instances (nav/footer/finale wordmarks split as FOXY + PROPERTIES spans, hero,
  every page body, page <title> metadata, legal "FOXY Properties Investors Ltd"). TR dictionary keys+values updated
  in lockstep. Back Office CommissionsManager "PROPERTY" table header left as-is (column label, not brand).
- Company email `info@foxyproperties.co.uk` added (site had none before) as mailto in SiteFooter (footer-email)
  and Contact page (contact-email). No outbound email templates exist in codebase (LeadForm → /api/leads only).

## ✅ WHATSAPP FLOATING BUTTON (2026-06, VERIFIED via screenshot)
- Global floating WhatsApp button (bottom-right, every page) via `components/site/WhatsAppButton.tsx` mounted in root
  layout. Green (#25D366), inline WhatsApp SVG icon, subtle `animate-ping` pulse ring, hover scale.
- Number from env `NEXT_PUBLIC_WHATSAPP_NUMBER=+447751435737` (in .env.local; NEXT_PUBLIC so it inlines at build —
  rebuild after change). Opens `https://wa.me/447751435737` (non-digits stripped). Hidden gracefully if unset.

## ✅ EN/TR LANGUAGE TOGGLE — i18n (2026-06, VERIFIED via screenshots + assertions)
- Navbar EN · TR toggle (top-right, next to LOGIN/GET STARTED; also in mobile panel). `components/i18n/language.tsx`
  (LanguageProvider + useT + useLang + setLang + LanguageToggle). Preference saved to BOTH localStorage and a
  `foxy_lang` cookie; toggling reloads the page so server-rendered text switches too. Persists across nav + refresh.
- Source-string dictionary approach: `src/lib/i18n/dictionary.ts` (English source → Turkish). Missing key → English,
  so EN always renders. `src/lib/i18n/index.ts` (translate), `src/lib/i18n/server.ts` (getLang/getT for server comps).
  Root layout reads cookie, sets <html lang>, wraps app in LanguageProvider.
- TRANSLATED (public): Navbar, Footer, Home (all sections: HomeHero, WestLondon, InteriorSection+PricePanel,
  PropertyLab, LifecycleJourney, PropertyLifecycle, SceneStats, FeaturedEditorial, Finale), Properties
  (PropertySearch + PropertyFlipCard), Investment, Mortgages, Areas, About, Sell, Lettings, Contact, Insights,
  Property Management, Landlords + shared LeadForm, ManagementSlider, LandlordJourney, PageHero, JourneyRail.
  Prices stay £ (GBP) per user. Verified TR on home/properties/landlords/contact + toggle persistence (all PASS).
- NOT YET TRANSLATED (render English, no breakage) — NEXT ITERATION: landlords/rental-valuation wizard,
  landlords/compliance, calculators/mortgage, calculators/buy-to-let, areas/[slug], properties/[slug],
  RentalValuationJourney, LandlordRevenueSimulator, MortgageCalculator, BuyToLetCalculator, FinanceEnquiryForm,
  AreasMapPanel labels. PHASE 2 (agreed): Admin / Back Office panels.

## ✅ HMO HIDDEN (2026-06)
- Removed all HMO surfaces from the public site (nav item, HomeHero search tab, PropertyLab tab + room labels,
  PropertySearch intent). HMO reserved for a future separate consultancy site.

## ✅ LOGIN FIX (2026-06)
- Root cause: preview Postgres wiped on pod restart (admin user gone) + runner's db-setup ran before cluster ready.
  Re-seeded DB; added a `pg_isready` wait loop to `scripts/db-setup.sh` so seeding no longer races on boot.

## ✅ LEAD → CLIENT CONVERSION (2026-06, VERIFIED via curl + screenshot)
- One-click convert a website lead into a CRM client record. Button lives ONLY on the lead detail
  page (`/backoffice/leads/[id]`) via `components/backoffice/ConvertLeadButton.tsx` (testid lead-convert-button).
- New endpoint `POST /api/backoffice/leads/[id]/convert` (leads:update): reads lead → inserts into `clients`
  (full_name=name, phone, email, interest=rent if type∈{TENANT,LETTING,RENT} else buy, status=WARM,
  notes=message + provenance, source_lead_id=lead.id) + activities CONVERTED_TO_CLIENT.
- Lead is left UNCHANGED after conversion (per user). Duplicate conversion BLOCKED via unique index
  `clients.source_lead_id` (migration 005) → returns 409 + existing clientId; UI shows "already converted".
- Verified: first convert 201, second 409, client row created (interest=buy/WARM), detail page shows
  green "Client record created" + VIEW IN CLIENTS when already converted.

## ✅ CINEMATIC POLISH — scene vignette + gold light seams (2026-06)
- Added CSS `.scene-vignette` (soft inset darkening frame) + `.gold-seam-top/bottom` (thin gold line + radial bloom)
  to hero, West London, Interior and Finale for a filmic scene-to-scene flow. Pure CSS, no perf cost, no layout change.
  Hero visually confirmed; structure unchanged so no black-gap regression.

## ✅ BUGFIX — homepage black/empty scroll gap + full-page scenes (2026-06, VERIFIED, iteration_15, frontend 100%)
- Root cause: hero was a 215vh section with a 100vh sticky inner → ~100vh of empty black parent bg showed between
  hero and West London while scrolling.
- Fix: hero is now a plain 100vh (`h-screen`) full-viewport section with a NON-pinned GSAP ScrollTrigger scrub zoom
  (img 1.06→1.26, start top top / end bottom top) + desktop mouse parallax — no dead zone, West follows immediately.
- West/Interior/Finale set to `min-h-screen` (true full page). Finale image replaced with a genuine 3840×2160 photo.
- Verified: no black gap at any scrollY (desktop 1440 & mobile 390), all scenes ~100vh, hero zoom works, finale 4K,
  0 overflow, 0 console errors, regression pages fine.

## ✅ GLOBAL POLISH — scroll reveals, page transitions, gold-gradient CTAs (2026-06, VERIFIED, iteration_14, frontend 100%)
- Section camera parallax (2026-06): `components/home/ParallaxImage.tsx` gives West London, Interior & Finale a
  scroll-linked vertical drift + slow push-in (GSAP ScrollTrigger scrub), overscaled so no edge gaps;
  reduced-motion static. Depth-tuned per scene (2026-06): far skyline/Finale drifts slow (yPercent ±3), West
  London street medium (±7), near Interior room fastest (±11) — each overscaled to match, giving layered depth.
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
- [Jun 2026] Back office management system — 5 modules (tested iteration_26, 100% frontend + 100% backend):
  migration 004 (clients, appointments, offers, commissions). (1) Appointments & Viewings — month/week calendar,
  add form, status Pending/Confirmed/Completed/Cancelled (WhatsApp intentionally omitted per user). (2) Client CRM —
  Hot/Warm/Cold, budget/areas/interest, status filters. (3) Offers & Negotiations — grouped per property, status +
  counter notes. (4) Commission Tracker — date-range filter, running total, CSV export. (5) Dashboard KPI cards.
  APIs /api/backoffice/{clients,appointments,offers,commissions} gated by leads:read/update & finance:read; nav links
  added. Fixed a minor commissions date-filter race with a request-seq guard.
- [Jun 2026] Areas heat layer (tested iteration_25, 100%, 0 errors): added a Mapbox heatmap ('foxy-heat' source+layer,
  gold ramp) to the /areas 3D map with an OFF / DENSITY / LISTING VALUE control (AreasMapPanel.tsx), legend, and an
  always-visible "ILLUSTRATIVE — activates when a dated source is connected" note (no fabricated market stats; weights
  derived from current prototype listings). PropertyMap gained heatPoints + heatVisible props with setHeat/setHeatData
  controller methods. Wired via propertyMapPoints() on /areas.
- [Jun 2026] Mobile LIST|MAP tabs on /properties (tested iteration_24, 100%, 0 errors): below xl a view-tabs toggle
  (view-tab-list / view-tab-map) switches between the card grid and the full-width 3D map; xl+ hides tabs and shows
  both side-by-side. PropertyMap gained a resizeKey prop -> map.resize() when the (initially hidden) map becomes
  visible, so the canvas sizes correctly (verified 350x574 on mobile after switch).
- [Jun 2026] Card↔Map sync on /properties (tested iteration_23, 100%, 0 errors): added a sticky 3D PropertyMap sidebar
  (xl screens) beside the flip-card grid. Hovering/focusing a card highlights its map pin (gold glow ring + enlarged
  marker via PropertyMap.setActive/activeSlug, no camera jump); leaving the grid clears it; map markers stay in sync
  with active filters (mapPoints = useMemo over filtered items, coords from AREA_CENTERS + per-slug offset).
  PropertyFlipCard onActivate; PropertyMap now supports activeSlug (hover) alongside selectedSlug (fly) & click-fly.
- [Jun 2026] Mobile flip hint (tested iteration_22, 100%): subtle animated gold corner-peel with "TAP" label on the
  FIRST /properties card only (hint={i===0}). CSS-gated to '@media (hover:none)' (hidden on desktop), removed once the
  card is flipped, reduced-motion safe. Elements: .flip-hint (data-testid=flip-hint), cornerPeel keyframes.
- [Jun 2026] Mobile tap-to-flip on property cards (tested iteration_21, 100% 4/4): PropertyFlipCard is now a client
  component — on touch (matchMedia '(hover:none)') the first tap flips (adds .is-flipped, no navigation), VIEW PROPERTY
  button navigates, tapping the back unflips. Desktop hover-flip + click-to-navigate unchanged (no regression).
  CSS '.flip-card.is-flipped .flip-inner' forces the flip regardless of hover.
- [Jun 2026] Map building highlight + flyTo (tested iteration_20, 100% frontend, 0 console errors): PropertyMap now
  draws a gold ground 'spotlight' glow (foxy-glow source + fill/line layers) at the selected property, tints the
  selected building GOLD via feature-state on the foxy-3d-buildings fill-extrusion (case expression), and animates
  camera.flyTo (zoom 16.2, pitch 62, bearing -28, 2.2s) on marker click / on load (selectedSlug or single-point).
  Property detail passes selectedSlug so it auto-flies+highlights; /areas flies on marker click. LOCATION section
  given id=location.
- [Jun 2026] 3D visual features (tested iteration_19, 100% frontend, 0 errors):
  (1) 3D card flip on /properties — `PropertyFlipCard.tsx` + CSS (perspective/preserve-3d/backface, hover rotateY,
  touch+reduced-motion safe). Front: image/area/title/price; back: price, beds/baths/size, VIEW PROPERTY link.
  (2) Multi-layer parallax — HomeHero headline+search drift at different GSAP scrub speeds; `ParallaxBackground.tsx`
  adds subtle scroll parallax to all PageHero backgrounds (data-testid=parallax-bg).
  (3) Mapbox GL JS 3D maps — `PropertyMap.tsx` (dark-v11, pitch 55, NavigationControl visualizePitch, fill-extrusion
  3D buildings, gold markers + escaped popups -> /properties/<slug>). On /areas (all property pins), /areas/[slug]
  (area+pins), /properties/[slug] (LOCATION single pin). Coords in lib/properties.ts; areaCenter() in lib/areas.ts.
  Token set as NEXT_PUBLIC_MAPBOX_TOKEN in .env.local (client maps require NEXT_PUBLIC_ prefix; inlined at build —
  rebuild if changed). Graceful fallback if missing. MAPBOX NO LONGER MOCKED.
- [Jun 2026] Pipeline drag-and-drop: cards now move between status columns via native HTML5 DnD (columns are drop
  targets with onDragOver/onDrop -> moveTo; cards draggable with onDragStart + dataTransfer). Old ←/→ arrows removed.
  Kept a per-card "Move to" <select> fallback (pipeline-select-<id>) for touch/keyboard. Column highlights on hover-over,
  card dims while dragging. Tested (iteration_18): 100% frontend, native DnD + select fallback both persist after reload,
  arrows gone, filters intact.
- [Jun 2026] Pipeline quick filters + search added to `PipelineBoard.tsx`: text search (name/email/phone),
  type dropdown, source dropdown, live "N shown" count, Clear button. Filters applied client-side via useMemo;
  stage-move still works and filters persist through a move. Tested (iteration_17): 100% frontend, all filter
  scenarios PASS (search amelia->1, type VALUATION->2, source LANDLORD_SWITCH->1, Clear resets, move persists).
  NOTE: preview Postgres is ephemeral (pod recycles wipe leads); production DB is persistent. Re-seed for demo via
  /app/memory/test_credentials.md instructions.
- [Jun 2026] Landlord Revenue Simulator: added SINGLE / COMPARE SERVICES mode toggle. Compare view shows Let only
  (6%) vs Fully managed (12%) side-by-side (net/mo, net/yr, mgmt fee, retained %) plus a difference callout
  (`sim-compare`, `sim-compare-letonly`, `sim-compare-managed`, `sim-compare-diff`). Refactored to a compute(fee)
  helper; single-mode testids unchanged. Build OK; toggle verified rendering; math consistent (managed keeps ~£2,160
  less/yr than let-only at default inputs = the extra mgmt fee).
- [Jun 2026] Back Office pipeline for landlord/valuation leads: new `/backoffice/pipeline` page + client
  `src/components/backoffice/PipelineBoard.tsx` — 6-column kanban (leadStatuses) filtered to
  type IN (VALUATION,LANDLORD,MANAGEMENT,SWITCH,LETTING) OR source ILIKE 'LANDLORD%'; ←/→ move stage via existing
  PATCH /api/backoffice/leads/[id]/status (leads:update guarded, optimistic + rollback). Nav link added in
  backoffice layout (leads:read guarded). Verified: SSR board renders, unrelated leads excluded, PATCH persists
  (NEW→CONTACTED), leads survive restart. Rental valuation journey feeds this pipeline (source=LANDLORD_VALUATION).
- [Jun 2026] Phase B batch (4 items):
  (1) Rental Valuation journey `/landlords/rental-valuation` — 7-step interactive wizard
  (`src/components/landlord/RentalValuationJourney.tsx`) + progress bar; submits to /api/leads type=VALUATION,
  source=LANDLORD_VALUATION (verified 201); no auto valuation figure (policy).
  (2) Timeline durations on homepage PropertyLifecycle (per-stage duration label on node + `lifecycle-duration` chip).
  (3) Landlord Revenue Simulator `src/components/investment/LandlordRevenueSimulator.tsx` on /investment#simulator
  (sliders: rent/void/maintenance, service fee tabs 6/9/12%); PropertyLab `lab-open` now -> /investment#simulator.
  Math verified (£3k rent, fully-managed -> £26,215 net/yr, £2,185/mo).
  (4) Compliance Centre `/landlords/compliance` — Renters' Rights Act 2025 (England PRS), 8 change cards, checklist,
  GOV.UK/legislation.gov.uk sources, JURISDICTION + SOURCES CHECKED 9 Jun 2026 + not-legal-advice disclaimer.
  Nav: Landlords now a dropdown (Hub / Rental Valuation / Compliance Centre). NOTE: testing_agent timed out; verified
  via SSR checks + curl (leads 201) + calc verification + screenshots.
- [Jun 2026] Added interactive PropertyLifecycle timeline (`src/components/home/PropertyLifecycle.tsx`) between
  LifecycleJourney and FeaturedEditorial: 4 clickable nodes (ACQUIRE→/properties, FINANCE→/mortgages, LET→/lettings,
  MANAGE→/property-management) with lucide icons, gold progress line, per-node auto-advance progress ring (6s,
  pause-on-hover), fade-swapping detail panel + 3-step list per stage. lucide-react added. Tested (iteration_16):
  7/7 frontend checks PASS, 100%, 0 console errors.
- [Jun 2026] Added animated stat badges to each LifecycleJourney scene via `src/components/home/SceneStats.tsx`
  (client CountUp + IntersectionObserver, `.scene-stat` CSS reveal in globals.css, reduced-motion safe). 2 illustrative
  stats per scene (yield/horizon, rate/decision, time-to-let/occupancy, 24-7/inspections) + "ILLUSTRATIVE" micro-label.
- [Jun 2026] Added LifecycleJourney (`src/components/home/LifecycleJourney.tsx`) — 4 full-bleed 100vh cinematic
  scenes between PropertyLab and FeaturedEditorial: 07 INVEST→/investment, 08 FINANCE→/mortgages, 09 LET→/lettings,
  10 MANAGE→/property-management. Alternating left/right align, ParallaxImage depth-tuned, AI 2560px assets
  (invest/finance/letting/management.jpg). Hero side-nav SCENES updated to 8 anchored scenes. Rebuilt + restarted.
- [Jun 2026] Regenerated west.jpg (2560×1717) + interior.jpg (2560×1717) as AI cinematic scenes and lab_house.jpg
  (2048×3052) as AI 4K architectural cutaway render (Gemini), LANCZOS-upscaled + unsharp, quality 90 progressive JPEG.
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

## 2026-06 — Home clips → Object Storage
- Migrated the 3 home cinematic clips out of the git-tracked `public/home/` (~49MB) into Emergent
  Object Storage under `foxy-property/home/clip-{london,west,interior}.mp4` (one-time uploader:
  `scripts/upload_home_clips.py`).
- `/api/media/[...path]` now supports HTTP Range (206 Partial Content, Accept-Ranges) so `<video>` can seek.
- Chapter 0 hero clip swapped to a user-picked Pexels clip (id 3568719, dusk London skyline + Thames),
  uploaded as `foxy-property/home/clip-hero.mp4` (new filename busts the immutable CDN cache).
- `HomeHero.tsx`: each chapter now plays its clip as a muted/looping/autoplay background video
  (served via `/api/media/...`), image kept as poster + reduced-motion fallback.
- Verified: uploads OK; `/api/media` 200 full + 206 range via proxy (8001); hero video renders live on preview.
  Object Storage is a remote persistent service (survives pod sleep, unlike local Postgres).

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

## 2026-06 — Mortgages section fully removed
- Deleted /mortgages, /calculators/mortgage pages and MortgageCalculator component
- Removed Mortgages from header nav; footer column now "AREAS & INSIGHTS" (Mortgages/Buy-to-Let links removed)
- Removed Finance/EXPLORE MORTGAGES/REFINANCE CTAs & stages from home LifecycleJourney, PropertyLifecycle, PropertyLab (+ dead hero/property components)
- Insights "Mortgages & Finance" topic removed; landlords chip -> "Finance & reporting"; BTL calculator "Estimated mortgage" -> "Estimated loan"
- FCA disclaimers (footer/About) no longer mention "mortgage"; i18n dictionary cleaned
- Kept internal CRM lead enum values MORTGAGE/REMORTGAGE in api/leads (not user-facing)
- Note: after deleting routes, clear .next/dev + .next/types before yarn build

## 2026-06 — User Management + Customer Enquiries
- Migration 006: AGENT role, enquiries table (NEW/READ/IN_PROGRESS/RESOLVED); primary admin renamed to info@foxyproperties.co.uk (old admin@foxyproperty.co.uk deactivated); seed now ON CONFLICT DO NOTHING so UI edits persist
- /backoffice/users (ADMIN only, users:manage): add/edit (name, email, password, role Admin/Agent), activate/deactivate; guards: no self-deactivate/demote, ≥1 active admin
- Session re-checks DB on each request → deactivation/role changes apply instantly
- AGENT sees only /backoffice/enquiries (other routes redirect)
- Contact page EnquiryForm → POST /api/enquiries: saves, emails info@foxyproperties.co.uk + customer confirmation (24h)
- /backoffice/enquiries list + status select; unread badge in sidebar (polls 30s + updates on change)
- Tested: iteration_27 — 17/17 backend, all frontend flows pass
## Backlog
- Claude AI integration (awaiting purpose) · Deployment needs Next.js template job + managed Postgres

## 2026-06 — Enquiry Notes + Dashboard Calendar & Tasks
- Migration 007: enquiry_notes (NOTE/CALL/EMAIL/MEETING, author, time), tasks (description, related CLIENT/PROPERTY/TEXT + label, due_date, assignee, priority, completed_at)
- Enquiries: per-row Notes panel with timeline + reply log (internal only)
- Dashboard "Calendar & Tasks": Today's Viewings (appointments, Europe/London), Upcoming 7 days, Overdue (red, days overdue), inline Add Task, complete from widget; red overdue badge on Dashboard nav
- Agents: "My Tasks" page (/backoffice/tasks) with only their tasks/viewings (viewings matched by appointment agent name)
- Permissions tasks:own / tasks:manage; CountBadge generic component replaces UnreadEnquiriesBadge
- Tested: iteration_28 all flows pass

## 2026-06 — Follow-up from Enquiry + Home chapter 2 video
- Enquiry notes panel: "+ CREATE FOLLOW-UP TASK" opens AddTaskForm prefilled (description, customer name/phone/email, due tomorrow); appears in dashboard Upcoming
- Home chapter 2 (WEST LONDON) now uses user clip (Ealing Broadway) transcoded 4K→1080p H.264 faststart (112MB→27MB) at foxy-property/home/clip-chapter2.mp4; poster public/home/chapter2.jpg
- ffmpeg is available via `pip install imageio-ffmpeg` (binary under /root/.venv/.../imageio_ffmpeg/binaries/)
- scripts/upload_home_clips.py now takes args: <local file> <object name> ...

## 2026-06 — Code review fixes (backend/tests)
- Secrets moved out of test files into backend/tests/config.py (env / tests/.env, .env.example template); random throwaway passwords for test users
- `is True/False` → `==`; property CRUD test split into fixture + 5 focused tests
- Stale tests updated: mortgage pages now asserted 404; compliance check allows the negative "not currently FCA authorised" disclaimer

## 2026-06 — Deployment prep (path A: new Next.js job + external Postgres)
- scripts/db-migrate.js: tracked migrations (schema_migrations), baselines existing preview DB, verified on empty DB (7/7 applied, idempotent)
- package.json: `start` = migrate; seed; next start · `db:migrate` script
- seed-admin.js: passwords from ADMIN_PASSWORD / EXTRA_ADMIN_PASSWORD env (no hardcoded secrets)
- Checklist: memory/MIGRATION_TO_NEXTJS_JOB.md

## 2026-06 — Neon Postgres wired (project foxy / morning-dust-07708297, branch production, aws-eu-west-2, PG 17, db foxydb)
- Neon CLI 8.4.3 (needs Node 22 → /opt/node22, app still runs on Node 20), skills in .claude/skills, `neon init` → .neon + neon.ts (postgres only), `neon deploy` pulled DATABASE_URL (pooled), DATABASE_URL_UNPOOLED, NEON_BRANCH into .env.local
- App queries: node-postgres Pool on pooled DATABASE_URL (long-running next start). Migrations/seed: direct DATABASE_URL_UNPOOLED
- db-setup.sh: external DB → only db-migrate + seed (local Postgres skipped); env loaders strip quotes
- New: scripts/db-check.js (`yarn db:check`), scripts/neon-e2e-check.js (HTTP flow → verifies rows in Neon)
- Verified: npm run build OK; pytest 28/28 + 30/30 via preview URL; neon-e2e-check 8/8 PASS
- Preview data from local Postgres was NOT copied (only test data). Neon API key kept outside repo at /root/.neon_api_key (pod-local)
