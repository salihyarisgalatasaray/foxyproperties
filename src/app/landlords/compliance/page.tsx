import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";

export const metadata = {
  title: "Compliance Centre — Renters' Rights Act 2025 | FOXY Property",
  description:
    "A plain-English landlord guide to the Renters' Rights Act 2025 (England): the end of Section 21, periodic tenancies, rent increases, the pets right, the Decent Homes Standard, the database and the Ombudsman.",
};

const DATE_CHECKED = "9 June 2026";
const JURISDICTION = "England — private rented sector";

const CHANGES: { tag: string; title: string; body: string }[] = [
  {
    tag: "TENANCIES",
    title: "Section 21 abolished · periodic tenancies",
    body: "Fixed-term assured shorthold tenancies have ended. All tenancies are now assured periodic tenancies that roll on (typically monthly) with no fixed end date. Existing ASTs converted automatically on 1 May 2026.",
  },
  {
    tag: "POSSESSION",
    title: "Section 8 grounds only",
    body: "To regain possession you must rely on a valid legal ground and serve a Section 8 notice on the prescribed form. Grounds such as selling or moving in typically require 4 months' notice and cannot be used in the first 12 months of a tenancy.",
  },
  {
    tag: "RENT",
    title: "Rent increases via Section 13",
    body: "Rent-review clauses are no longer valid. Increases must use the statutory Section 13 process — once a year, at market rate, with at least 2 months' notice (Form 4A). Tenants can challenge increases at the First-tier Tribunal.",
  },
  {
    tag: "LETTING",
    title: "Rental bidding ban · anti-discrimination",
    body: "You must publish an asking rent and cannot invite or accept offers above it. Discrimination against tenants with children or on benefits is prohibited. Breaches can bring civil penalties of up to £7,000.",
  },
  {
    tag: "PETS",
    title: "Strengthened right to request a pet",
    body: "Tenants can request a pet in writing and you must respond within 28 days. Consent cannot be unreasonably refused. Refusal is only reasonable in limited cases (e.g. a superior landlord prohibits pets).",
  },
  {
    tag: "STANDARDS",
    title: "Decent Homes Standard · Awaab's Law",
    body: "The Decent Homes Standard is being extended to the private rented sector, and Awaab's Law requires serious hazards such as damp and mould to be addressed within set timeframes. Some timelines remain subject to consultation.",
  },
  {
    tag: "REGISTRATION",
    title: "PRS Database · Landlord Ombudsman",
    body: "A Private Rented Sector Database and a mandatory Landlord Ombudsman are rolling out from late 2026. Landlords will be required to register themselves and their properties, and to join the Ombudsman scheme.",
  },
  {
    tag: "ENFORCEMENT",
    title: "Penalties for breaches",
    body: "Local authorities can issue financial penalties — up to £7,000 for initial breaches and up to £40,000 (or criminal prosecution) for serious or repeated offences such as illegal re-letting within a restricted period.",
  },
];

const CHECKLIST = [
  "Provide tenants with the Government's Renters' Rights Act Information Sheet.",
  "Move rent increases onto the statutory Section 13 process (Form 4A).",
  "Publish a clear asking rent and stop accepting offers above it.",
  "Have a written process for pet requests (respond within 28 days).",
  "Review possession grounds and Section 8 notice procedures with your agent.",
  "Prepare for database registration and Ombudsman membership.",
];

const SOURCES = [
  { label: "GOV.UK — Renters' Rights Act: an overview for landlords", href: "https://www.gov.uk/guidance/renters-rights-act-an-overview-for-landlords" },
  { label: "GOV.UK — Guide to the Renters' Rights Act", href: "https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act" },
  { label: "GOV.UK — Enforcement measures for landlords", href: "https://www.gov.uk/guidance/enforcement-measures-for-landlords-renters-rights-act-2025" },
  { label: "GOV.UK — Rental discrimination under the Act", href: "https://www.gov.uk/government/publications/rental-discrimination-under-the-renters-rights-act-2025/rental-discrimination-under-the-renters-rights-act-2025" },
  { label: "legislation.gov.uk — Renters' Rights Act 2025 (c. 26)", href: "https://www.legislation.gov.uk/ukpga/2025/26" },
];

export default function CompliancePage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="LANDLORDS · COMPLIANCE CENTRE"
        title="THE RENTERS' RIGHTS ACT 2025, MADE CLEAR."
        intro="A plain-English guide to what the Renters' Rights Act 2025 means for landlords in England — from the end of Section 21 to periodic tenancies, rent increases, pets and the new database."
        image="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=2000"
        concept
        ctas={[
          { label: "REQUEST A COMPLIANCE REVIEW", href: "/landlords#switch", primary: true },
          { label: "GET A RENTAL VALUATION", href: "/landlords/rental-valuation" },
        ]}
      />

      {/* Meta / disclaimer */}
      <section className="mx-auto max-w-6xl px-5 pt-16 md:px-12">
        <div data-testid="compliance-disclaimer" className="grid gap-6 border border-white/12 bg-[#141413] p-6 md:grid-cols-[1fr_auto] md:p-8">
          <div>
            <p className="text-xs leading-6 text-white/60">
              This page is general information, not legal advice. Rules and commencement dates are
              phased and some remain subject to consultation. Always confirm your specific obligations
              with a qualified adviser or the official GOV.UK guidance before acting.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-[10px] tracking-[.16em] text-white/45 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <span>JURISDICTION · {JURISDICTION}</span>
            <span>SOURCES CHECKED · {DATE_CHECKED}</span>
            <span>SOURCE · GOV.UK & legislation.gov.uk</span>
          </div>
        </div>
      </section>

      {/* Key changes */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-12">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">WHAT'S CHANGED</p>
        <h2 className="display mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">KEY CHANGES FOR LANDLORDS.</h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {CHANGES.map((c) => (
            <article key={c.title} data-testid={`compliance-card-${c.tag.toLowerCase()}`} className="flex flex-col bg-[#0E0E0E] p-6">
              <span className="text-[10px] tracking-[.24em] text-[#D4AF37]">{c.tag}</span>
              <h3 className="mt-3 text-base leading-snug text-white">{c.title}</h3>
              <p className="mt-3 text-xs leading-6 text-white/60">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="border-y border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-12">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">STAY COMPLIANT</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-4xl">A LANDLORD READINESS CHECKLIST.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              A starting point, not a substitute for advice. FOXY can review your tenancies and manage
              compliance on your behalf.
            </p>
          </div>
          <ul className="divide-y divide-white/10 border-l border-[#D4AF37]/30 pl-6">
            {CHECKLIST.map((item, i) => (
              <li key={item} data-testid={`compliance-check-${i}`} className="flex items-baseline gap-4 py-4">
                <span className="display text-lg text-[#D4AF37]/70">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-6 text-white/75">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-12">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">SOURCES</p>
        <h2 className="display mt-5 text-2xl leading-tight md:text-3xl">Official guidance</h2>
        <p className="mt-4 text-xs tracking-[.14em] text-white/40">CHECKED {DATE_CHECKED} · {JURISDICTION}</p>
        <ul className="mt-8 grid gap-3" data-testid="compliance-sources">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline gap-3 border-b border-white/10 py-3 text-sm text-white/75 transition-colors hover:text-[#D4AF37]">
                <span className="text-[#D4AF37]">↗</span>
                <span className="group-hover:underline">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
