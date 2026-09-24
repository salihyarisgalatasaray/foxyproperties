import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { LandlordJourney } from "@/components/landlord/LandlordJourney";
import { LeadForm } from "@/components/lead/LeadForm";

export const metadata = {
  title: "Landlords | FOXY Property",
  description:
    "Your property, professionally managed. Rental valuation, tenant finding, rent collection and full management with FOXY.",
};

export default function LandlordsPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="LANDLORD HUB"
        title="YOUR PROPERTY. PROFESSIONALLY MANAGED."
        intro="From rental valuation and tenant finding to rent collection and ongoing management, explore a service built around your property."
        image="https://images.pexels.com/photos/7642004/pexels-photo-7642004.jpeg?auto=compress&cs=tinysrgb&w=2000"
        concept
        ctas={[
          { label: "GET A RENTAL VALUATION", href: "/landlords/rental-valuation", primary: true },
          { label: "EXPLORE MANAGEMENT", href: "/property-management" },
        ]}
      />

      <LandlordJourney />

      <section id="certainty" className="border-y border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-12">
          <p className="text-xs tracking-[.3em] text-[#D4AF37]">RENT CERTAINTY</p>
          <h2 className="display mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">
            LOOKING FOR MORE CERTAINTY AROUND RENT?
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
            Explore available rent-protection and management structures for your property. We will
            only describe a specific product once its exact terms are confirmed with you.
          </p>
          <div className="mt-6 border border-white/15 bg-[#141413] p-5 text-xs leading-6 text-white/50">
            We do not describe rent as “guaranteed” in all circumstances. Contract length, protected
            amounts, void-period cover, arrears cover, insurance, eligibility and exclusions vary and
            are confirmed on a per-product basis after review.
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#switch"
              className="bg-[#D4AF37] px-6 py-4 text-xs font-semibold tracking-[.14em] text-black"
            >
              EXPLORE OPTIONS →
            </a>
            <a
              href="#valuation"
              className="border border-[#D4AF37] px-6 py-4 text-xs tracking-[.14em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
            >
              REQUEST A MANAGEMENT REVIEW →
            </a>
          </div>
        </div>
      </section>

      <section id="portfolio" className="mx-auto max-w-6xl px-5 py-24 md:px-12">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">PORTFOLIO LANDLORDS</p>
        <h2 className="display mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">
          MULTIPLE PROPERTIES, ONE CLEAR VIEW.
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
          For multi-property landlords, we are building a portfolio experience connecting occupancy,
          rent, tenancies, maintenance, documents, finance and reporting. No portfolio statistics are
          shown until your real data is connected.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
          {["Portfolio overview", "Occupancy & rent", "Tenancies", "Maintenance", "Documents", "Finance & remortgage"].map(
            (t) => (
              <div key={t} className="bg-[#0E0E0E] p-6 text-sm text-white/70">
                {t}
                <p className="mt-2 text-[10px] tracking-[.14em] text-white/30">DEMO · AWAITING DATA</p>
              </div>
            )
          )}
        </div>
      </section>

      <section id="switch" className="border-t border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:px-12">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">SWITCH TO FOXY</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
              ALREADY WITH ANOTHER AGENT?
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              Explore moving your property management to FOXY. Switching is not always immediate —
              existing contracts and tenancies may need review — so we start with a management
              review.
            </p>
            <ol className="mt-8 space-y-3 text-sm text-[#A7A29A]">
              {["Your property", "Current management", "Current tenancy", "Documents", "Your requirements", "Management review"].map(
                (s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="display text-[#D4AF37]/60">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                )
              )}
            </ol>
          </div>
          <LeadForm
            type="SWITCH"
            source="LANDLORD_SWITCH"
            title="REQUEST A MANAGEMENT REVIEW"
            submitLabel="REQUEST A MANAGEMENT REVIEW"
            testid="switch-form"
            extraFields={[
              { name: "postcode", label: "Property postcode", required: true },
              { name: "current", label: "Current agent / management" },
              { name: "tenancy", label: "Current tenancy status" },
            ]}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
