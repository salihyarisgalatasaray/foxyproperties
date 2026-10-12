import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "London Insights | FOXY Properties",
  description:
    "London property intelligence from FOXY. Verified market data is shown with its source, period and last-updated date.",
};

const TOPICS = [
  "London Property Market",
  "Prime & West London",
  "Rental Market & Yields",
  "Buy-to-Let & Investment",
  "Regulation & Compliance",
];

export default async function InsightsPage() {
  const t = await getT();
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="LONDON INTELLIGENCE"
        title="LONDON PROPERTY INTELLIGENCE."
        intro="Considered analysis of the London market. We publish verified data only — every statistic will carry its source, period and last-updated date."
        image="https://images.unsplash.com/photo-1490642914619-7955a3fd483c?auto=format&fit=crop&q=85&w=2600"
        concept
      />

      <section className="mx-auto max-w-6xl px-5 py-24 md:px-12">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("TOPICS")}</p>
        <h2 className="display mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">
          {t("INSIGHT, NOT NOISE.")}
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
          {t("Our insight library is being built around primary sources such as ONS, HM Land Registry and GOV.UK. We do not mass-produce thin content or publish unsourced figures.")}
        </p>

        <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <div key={topic} className="bg-[#0E0E0E] p-8">
              <p className="text-sm font-semibold tracking-[.1em] text-white">{t(topic)}</p>
              <p className="mt-3 text-sm leading-6 text-[#A7A29A]">
                {t("Verified analysis coming soon.")}
              </p>
              <p className="mt-4 text-[10px] tracking-[.16em] text-white/30">
                {t("SOURCE · PERIOD · LAST UPDATED — TO BE PUBLISHED")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
