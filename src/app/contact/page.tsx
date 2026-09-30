import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/lead/LeadForm";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Book a Consultation | FOXY Properties",
  description: "Book a consultation with FOXY Properties — London property, investment, finance, lettings and management.",
};

export default async function ContactPage() {
  const t = await getT();
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="GET IN TOUCH"
        title="BOOK A CONSULTATION."
        intro="Whether you are buying, selling, investing, letting or managing, tell us what you need and we will arrange a considered conversation."
        image="https://images.unsplash.com/photo-1740596261028-29a7ad308157?auto=format&fit=crop&q=85&w=2600"
        concept
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:px-12">
        <div>
          <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("HOW CAN WE HELP?")}</p>
          <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
            {t("START A CONVERSATION.")}
          </h2>
          <ul className="mt-8 space-y-3 text-sm leading-7 text-[#A7A29A]">
            {[
              "Buying or selling in London",
              "Property investment & buy-to-let",
              "Lettings, landlords & management",
              "Property finance enquiries",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#D4AF37]">—</span>
                {t(item)}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-md text-xs leading-6 text-white/40">
            {t("We only request the information needed to respond. No advice, valuation or fee is provided through this form.")}
          </p>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[11px] tracking-[.2em] text-white/50">{t("EMAIL US")}</p>
            <a
              href="mailto:info@foxyproperties.co.uk"
              data-testid="contact-email"
              className="mt-2 inline-block text-sm text-[#D4AF37] transition-colors hover:text-white"
            >
              info@foxyproperties.co.uk
            </a>
            <p className="mt-5 text-[11px] tracking-[.2em] text-white/50">{t("CALL US")}</p>
            <a
              href="tel:+442080929196"
              data-testid="contact-phone"
              className="mt-2 inline-block text-sm text-[#D4AF37] transition-colors hover:text-white"
            >
              0208 092 9196
            </a>
            <p className="mt-5 text-[11px] tracking-[.2em] text-white/50">{t("VISIT US")}</p>
            <p data-testid="contact-address" className="mt-2 text-sm leading-6 text-[#A7A29A]">
              Unit 7A/2, West Road, Tottenham, London, N17 0QT
            </p>
          </div>
        </div>
        <LeadForm
          type="CONSULTATION"
          source="CONSULTATION"
          title="BOOK A CONSULTATION"
          submitLabel="BOOK A CONSULTATION"
          testid="consultation-form"
          extraFields={[{ name: "topic", label: "What is this regarding?" }]}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
