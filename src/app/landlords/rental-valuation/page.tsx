import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { RentalValuationJourney } from "@/components/landlord/RentalValuationJourney";

export const metadata = {
  title: "Rental Valuation | FOXY Property",
  description:
    "Start your interactive rental valuation journey. Tell us about your London property and a FOXY specialist will arrange a personalised, no-obligation rental valuation.",
};

export default function RentalValuationPage() {
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="LANDLORDS · RENTAL VALUATION"
        title="WHAT COULD YOUR PROPERTY ACHIEVE?"
        intro="Answer a few quick questions about your property and we'll arrange a personalised rental valuation. It takes under a minute — and there's no obligation."
        image="https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=2000"
        concept
        ctas={[{ label: "START THE JOURNEY", href: "#journey", primary: true }]}
      />

      <section id="journey" className="mx-auto max-w-5xl px-5 py-24 md:px-12">
        <RentalValuationJourney />
        <p className="mt-8 text-xs leading-6 text-white/40">
          This journey collects your requirements only. No valuation figure, rental estimate or
          guarantee is produced automatically — every figure is confirmed by a FOXY specialist after a
          proper assessment of your property and current market evidence.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
