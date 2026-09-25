import { getT } from "@/lib/i18n/server";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "PROPERTY",
    links: [
      ["Properties for Sale", "/properties?intent=buy"],
      ["Properties to Rent", "/properties?intent=rent"],
      ["Sell Your Property", "/sell"],
      ["Investment", "/investment"],
    ],
  },
  {
    title: "LANDLORDS",
    links: [
      ["Landlord Hub", "/landlords"],
      ["Rental Valuation", "/landlords#valuation"],
      ["Property Management", "/property-management"],
      ["Switch to FOXY", "/landlords#switch"],
    ],
  },
  {
    title: "FINANCE & AREAS",
    links: [
      ["Mortgages", "/mortgages"],
      ["Buy-to-Let", "/mortgages#btl"],
      ["Areas", "/areas"],
      ["Insights", "/insights"],
    ],
  },
  {
    title: "COMPANY",
    links: [
      ["About FOXY", "/about"],
      ["Book a Consultation", "/contact"],
      ["Lettings", "/lettings"],
      ["Back Office", "/backoffice"],
    ],
  },
];

export async function SiteFooter() {
  const t = await getT();
  return (
    <footer data-testid="site-footer" className="border-t border-white/10 bg-[#0B0B0A]">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <p className="display text-2xl tracking-[.14em] text-[#D4AF37]">FOXY</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[#A7A29A]">
              {t("FOXY Properties Investors Ltd. Premium London property, investment, finance, lettings and management — considered properly.")}
            </p>
            <a
              href="mailto:info@foxyproperties.co.uk"
              data-testid="footer-email"
              className="mt-5 inline-block text-sm text-[#D4AF37] transition-colors hover:text-white"
            >
              info@foxyproperties.co.uk
            </a>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] tracking-[.2em] text-white/50">{t(col.title)}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-white/70 transition-colors hover:text-[#D4AF37]"
                    >
                      {t(label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-3 border-t border-white/10 pt-8 text-xs leading-6 text-white/40">
          <p>
            {t("FOXY Properties Investors Ltd is not currently FCA authorised. Nothing on this website constitutes financial, mortgage, tax or legal advice. All investment, rental and finance figures shown are illustrative estimates only and are not guaranteed.")}
          </p>
          <p>
            {t("Prototype and concept imagery is used for demonstration and is clearly labelled; it does not represent live FOXY listings. Regulatory memberships, protection schemes and fees are displayed only once verified.")}
          </p>
          <p className="pt-2 text-white/50">
            © {new Date().getFullYear()} FOXY Properties Investors Ltd · London, England
          </p>
        </div>
      </div>
    </footer>
  );
}
