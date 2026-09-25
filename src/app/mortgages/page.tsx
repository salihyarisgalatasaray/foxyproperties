import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/lead/LeadForm";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Mortgages & Property Finance | FOXY Properties",
  description:
    "Property finance, properly considered. Residential, buy-to-let, remortgage and portfolio finance enquiries with FOXY.",
};

const PRODUCTS = [
  {
    id: "residential",
    title: "RESIDENTIAL",
    body: "Finance for the home you intend to live in. We help you understand your options and next steps.",
  },
  {
    id: "btl",
    title: "BUY-TO-LET",
    body: "Finance structured around an investment property and its expected rental income.",
  },
  {
    id: "remortgage",
    title: "REMORTGAGE",
    body: "Reviewing an existing mortgage as a rate or circumstances change.",
  },
  {
    id: "portfolio",
    title: "PORTFOLIO",
    body: "Finance considerations for landlords holding multiple properties.",
  },
];

export default async function MortgagesPage() {
  const t = await getT();
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="PROPERTY FINANCE"
        title="PROPERTY FINANCE, PROPERLY CONSIDERED."
        intro="Connect your property, rent and management with a clear view of finance. We help you understand your options and route you to the right next step."
        image="https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?auto=format&fit=crop&q=85&w=2600"
        concept
        ctas={[
          { label: "FINANCE ENQUIRY", href: "#enquiry", primary: true },
          { label: "MORTGAGE CALCULATOR", href: "/calculators/mortgage" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-12">
        <div className="border border-white/15 bg-[#141413] p-5 text-xs leading-6 text-white/50">
          <strong className="text-white/70">{t("Important:")}</strong> {t("FOXY Properties Investors Ltd is not currently FCA authorised and is not an independent mortgage adviser or a whole-of-market broker. Nothing here is financial advice. We can help you understand your options and, where appropriate, connect you with an authorised adviser.")}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 md:px-12">
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
          {PRODUCTS.map((p) => (
            <div key={p.id} id={p.id} className="bg-[#0E0E0E] p-8 md:p-10">
              <p className="display text-2xl text-[#D4AF37]">{t(p.title)}</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#A7A29A]">{t(p.body)}</p>
              <a
                href="#enquiry"
                className="mt-6 inline-block text-xs tracking-[.14em] text-[#D4AF37] transition-colors hover:text-white"
              >
                {t("MAKE A FINANCE ENQUIRY")} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="enquiry" className="border-t border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:px-12">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("FINANCE ENQUIRY")}</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">{t("SPEAK TO OUR TEAM.")}</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              {t("Tell us what you need and we will explain the next step. This is an enquiry only — no regulated advice is provided through this form.")}
            </p>
          </div>
          <LeadForm
            type="MORTGAGE"
            source="FINANCE_ENQUIRY"
            title="FINANCE ENQUIRY"
            submitLabel="SEND FINANCE ENQUIRY"
            testid="finance-form"
            extraFields={[
              { name: "product", label: "Type (residential / BTL / remortgage / portfolio)" },
              { name: "amount", label: "Approximate amount (£)" },
            ]}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
