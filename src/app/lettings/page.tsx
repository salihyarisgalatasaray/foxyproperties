import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { LeadForm } from "@/components/lead/LeadForm";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Lettings | FOXY Property",
  description: "Property lettings in London, considered properly — for tenants and landlords.",
};

function Block({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-20">
      <p className="text-xs tracking-[.3em] text-[#D4AF37]">{eyebrow}</p>
      <h2 className="display mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">{title}</h2>
      <div className="mt-7 max-w-3xl text-sm leading-7 text-[#A7A29A]">{children}</div>
    </section>
  );
}

export default async function LettingsPage() {
  const t = await getT();
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="FOXY LETTINGS"
        title="PROPERTY LETTINGS, CONSIDERED PROPERLY."
        intro="Whether you are looking for a home to rent or letting a property, FOXY brings a premium, well-managed approach to lettings across London."
        image="https://images.unsplash.com/photo-1787047049857-1ed45e801f71?auto=format&fit=crop&q=85&w=2600"
        concept
        ctas={[
          { label: "PROPERTIES TO RENT", href: "/properties?intent=rent", primary: true },
          { label: "REGISTER AS A TENANT", href: "#register" },
        ]}
      />

      <Block id="find" eyebrow={t("FIND A HOME")} title={t("FIND YOUR NEXT HOME IN LONDON.")}>
        <p>
          {t("Browse our available properties to rent. Prototype and concept listings are clearly labelled and do not represent live inventory.")}
        </p>
        <a
          href="/properties?intent=rent"
          className="mt-6 inline-block border border-[#D4AF37] px-6 py-4 text-xs tracking-[.14em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
        >
          {t("BROWSE PROPERTIES TO RENT")} →
        </a>
      </Block>

      <section id="register" className="border-y border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.1fr] md:px-12">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("REGISTER AS A TENANT")}</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
              {t("TELL US WHAT YOU’RE LOOKING FOR.")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              {t("Register your requirements and we will be in touch about suitable homes. We only ask for the information we need.")}
            </p>
          </div>
          <LeadForm
            type="TENANT"
            source="LETTINGS_REGISTER"
            title="REGISTER YOUR INTEREST"
            submitLabel="REGISTER AS A TENANT"
            testid="tenant-register-form"
            extraFields={[
              { name: "area", label: "Preferred area" },
              { name: "beds", label: "Bedrooms needed" },
              { name: "budget", label: "Monthly budget (£)" },
              { name: "movein", label: "Ideal move-in date" },
            ]}
          />
        </div>
      </section>

      <Block id="guide" eyebrow={t("TENANT GUIDE")} title={t("RENTING WITH CONFIDENCE.")}>
        <ul className="grid gap-4 md:grid-cols-2">
          {[
            ["Book a viewing", "Arrange a viewing of a property that interests you."],
            ["Referencing", "Standard referencing confirms your ability to rent the property."],
            ["Moving in", "Deposit protection, inventory and a clear start to your tenancy."],
            ["During your tenancy", "Report maintenance and stay informed throughout."],
          ].map(([title, d]) => (
            <li key={title} className="border border-white/10 bg-[#141413] p-6">
              <p className="text-sm font-semibold tracking-[.1em] text-white">{t(title)}</p>
              <p className="mt-2 text-sm leading-6 text-[#A7A29A]">{t(d)}</p>
            </li>
          ))}
        </ul>
      </Block>

      <section id="viewing" className="mx-auto max-w-6xl px-5 py-16 md:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("BOOK A VIEWING")}</p>
            <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">{t("ARRANGE A VIEWING.")}</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#A7A29A]">
              {t("Let us know which property you would like to see and when suits you.")}
            </p>
          </div>
          <LeadForm
            type="VIEWING"
            source="LETTINGS_VIEWING"
            title="BOOK A VIEWING"
            submitLabel="REQUEST A VIEWING"
            testid="lettings-viewing-form"
            extraFields={[
              { name: "property", label: "Property / reference" },
              { name: "when", label: "Preferred date & time" },
            ]}
          />
        </div>
      </section>

      <section id="maintenance" className="border-t border-white/10 bg-[#0E0E0E]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-12">
          <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("MAINTENANCE")}</p>
          <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">{t("REPORT MAINTENANCE.")}</h2>
          <div className="mt-6 border border-red-400/40 bg-red-500/5 p-5 text-sm leading-7 text-red-200">
            <strong>{t("Emergency?")}</strong> {t("If there is an immediate risk to life, gas leak, fire or flood, contact the emergency services (999) or the relevant emergency provider first. Do not wait for an online report.")}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
            {t("For non-emergency maintenance, a dedicated tenant maintenance portal with photo/video reporting and ticket tracking is being prepared. In the meantime, please contact FOXY to report an issue.")}
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block border border-[#D4AF37] px-6 py-4 text-xs tracking-[.14em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
          >
            {t("CONTACT FOXY")} →
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
