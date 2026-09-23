import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { JourneyRail } from "@/components/site/JourneyRail";
import { LeadForm } from "@/components/lead/LeadForm";

export const metadata = {
  title: "Property Investment | FOXY Property",
  description:
    "Strategic London property investment. Understand purchase, finance, rent, costs and estimated yield — illustrative, never guaranteed.",
};

export default function InvestmentPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="PROPERTY INVESTMENT"
        title="STRATEGIC LONDON INVESTMENT."
        intro="Property is more than a number. Understand the purchase, the finance and the numbers before you make your move. All figures are illustrative estimates, never guaranteed."
        image="https://images.unsplash.com/photo-1549483249-f0b359d1e289?auto=format&fit=crop&q=85&w=2600"
        concept
        ctas={[
          { label: "ANALYSE AN INVESTMENT", href: "/calculators/buy-to-let", primary: true },
          { label: "SPEAK TO OUR TEAM", href: "#enquiry" },
        ]}
      />

      <JourneyRail
        eyebrow="THE INVESTMENT JOURNEY"
        heading="FROM PROPERTY TO ESTIMATED YIELD."
        testid="investment-journey"
        steps={[
          { title: "PROPERTY", body: "The right property in the right London location." },
          { title: "PURCHASE", body: "Purchase price and acquisition costs." },
          { title: "DEPOSIT", body: "Your capital position and loan-to-value." },
          { title: "FINANCE", body: "Buy-to-let finance and interest assumptions." },
          { title: "RENT", body: "Expected rent — shown only where verified." },
          { title: "COSTS", body: "Service charge, management, maintenance and insurance." },
          { title: "ESTIMATED CASH FLOW", body: "Illustrative monthly and annual position." },
          { title: "ESTIMATED YIELD", body: "Illustrative gross and net yield." },
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-12">
        <div className="border border-[#D4AF37]/30 bg-[#141413] p-8 md:p-12">
          <p className="text-xs tracking-[.3em] text-[#D4AF37]">INVESTMENT CALCULATOR</p>
          <h2 className="display mt-5 text-3xl leading-tight md:text-4xl">
            MODEL AN INVESTMENT.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A7A29A]">
            Use our buy-to-let calculator to estimate LTV, gross and net yield, annual costs and cash
            flow. Results are illustrative only and do not constitute financial advice or a promise of
            returns.
          </p>
          <a
            href="/calculators/buy-to-let"
            className="mt-7 inline-block bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black"
          >
            OPEN THE CALCULATOR →
          </a>
        </div>
      </section>

      <section id="enquiry" className="border-t border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:px-12">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">INVESTMENT ENQUIRY</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
              DISCUSS AN INVESTMENT.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              Tell us what you are considering. We never promise returns — we help you understand the
              numbers.
            </p>
          </div>
          <LeadForm
            type="INVESTMENT"
            source="INVESTMENT_ENQUIRY"
            title="INVESTMENT ENQUIRY"
            submitLabel="SEND INVESTMENT ENQUIRY"
            testid="investment-form"
            extraFields={[
              { name: "budget", label: "Approximate budget (£)" },
              { name: "area", label: "Areas of interest" },
            ]}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
