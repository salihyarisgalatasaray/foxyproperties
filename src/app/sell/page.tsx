import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { JourneyRail } from "@/components/site/JourneyRail";
import { LeadForm } from "@/components/lead/LeadForm";

export const metadata = {
  title: "Sell Your Property | FOXY Property",
  description:
    "Thinking of selling in London? Understand your property before your next move with FOXY Property.",
};

export default function SellPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="SELL WITH FOXY"
        title="THINKING OF SELLING?"
        intro="Understand your property before making your next move. A considered, well-marketed sale — led by people, not templates."
        image="https://images.unsplash.com/photo-1764416166529-99edb0e405a6?auto=format&fit=crop&q=85&w=2600"
        concept
        ctas={[
          { label: "REQUEST A PROPERTY VALUATION", href: "#valuation", primary: true },
          { label: "EXPLORE PROPERTIES", href: "/properties" },
        ]}
      />

      <JourneyRail
        eyebrow="THE SELLER JOURNEY"
        heading="A CLEAR PATH FROM DECISION TO COMPLETION."
        testid="sell-journey"
        steps={[
          { title: "PROPERTY", body: "We understand your property, your position and your timeline." },
          { title: "VALUATION", body: "A considered market appraisal. We do not invent figures to win instructions." },
          { title: "MARKETING", body: "Premium presentation, photography and targeted exposure." },
          { title: "VIEWINGS", body: "Qualified, well-managed viewings that respect your home." },
          { title: "OFFERS", body: "Clear negotiation with your objectives at the centre." },
          { title: "PROGRESSION", body: "Active sales progression through to exchange." },
          { title: "COMPLETION", body: "A managed completion and a considered next move." },
        ]}
      />

      <section id="valuation" className="mx-auto max-w-6xl px-5 pb-28 md:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">PROPERTY VALUATION</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
              REQUEST A PROPERTY VALUATION.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              Share a few details and a member of our team will arrange a considered appraisal. We do
              not provide an automated valuation figure online — every property and street is
              different.
            </p>
          </div>
          <LeadForm
            type="SELLER"
            source="SELL_VALUATION"
            title="REQUEST A VALUATION"
            submitLabel="REQUEST A PROPERTY VALUATION"
            testid="sell-valuation-form"
            extraFields={[
              { name: "postcode", label: "Property postcode", required: true },
              { name: "ptype", label: "Property type" },
              { name: "beds", label: "Bedrooms" },
            ]}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
