import { Reveal } from "./Reveal";
import { prototypeProperties } from "@/lib/properties";
import { getT } from "@/lib/i18n/server";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const IMAGES: Record<string, string> = {
  "prototype-chelsea-residence": "/properties/chelsea.jpg",
  "prototype-kensington-residence": "/properties/kensington.jpg",
  "prototype-fulham-residence": "/properties/fulham.jpg",
};

export async function FeaturedEditorial() {
  const t = await getT();
  return (
    <section data-testid="home-featured" className="diag-top relative -mt-[4vw] bg-[#F4F0E8] text-[#0B0B0A]">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-10 md:pb-36 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="text-[11px] tracking-[.34em] text-[#B9953E]">{t("FEATURED PROPERTIES")}</p>
            <h2 className="display mt-4 text-4xl leading-[1.02] md:text-6xl">
              {t("LONDON PROPERTIES")}<br /><span className="text-[#B9953E]">{t("A CONSIDERED SELECTION.")}</span>
            </h2>
          </Reveal>
          <a href="/properties" data-testid="featured-viewall" className="text-xs tracking-[.16em] text-[#0B0B0A]/70 transition-colors hover:text-[#B9953E]">
            {t("VIEW ALL PROPERTIES")} →
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {prototypeProperties.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <a href={`/properties/${p.slug}`} data-testid={`featured-card-${p.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-[#0B0B0A]">
                <img src={IMAGES[p.slug]} alt={`${p.title} — prototype`} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute right-3 top-3 border border-[#D4AF37]/60 bg-black/55 px-2.5 py-1 text-[9px] tracking-[.16em] text-[#D4AF37]">
                  {p.status.replaceAll("_", " ")}
                </span>
                <span className="absolute left-3 top-3 bg-black/55 px-2.5 py-1 text-[8px] tracking-[.16em] text-white/70">PROTOTYPE</span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="display text-xl">{gbp.format(p.price)}</p>
                  <p className="mt-1 text-[11px] tracking-[.14em] text-white/70">{p.area.toUpperCase()}</p>
                  <div className="mt-3 h-px w-8 bg-[#D4AF37] transition-all duration-500 group-hover:w-14" />
                  <div className="mt-3 flex gap-4 text-xs text-white/70">
                    <span>{p.bedrooms} {t("beds")}</span><span>{p.bathrooms} {t("baths")}</span><span>{p.type}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
          <Reveal delay={270}>
            <a href="/properties" data-testid="featured-explore-tile"
              className="group flex aspect-[3/4] flex-col justify-between border border-[#0B0B0A]/15 bg-[#0B0B0A] p-6 text-white">
              <p className="display text-2xl leading-tight">{t("Explore the full")}<br />{t("FOXY collection.")}</p>
              <span className="inline-flex items-center gap-2 text-xs tracking-[.16em] text-[#D4AF37]">
                {t("VIEW ALL PROPERTIES")} <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          </Reveal>
        </div>

        <p className="mt-8 text-[11px] tracking-[.1em] text-[#0B0B0A]/45">
          {t("Prototype records shown for demonstration only — not live property instructions or offers.")}
        </p>
      </div>
    </section>
  );
}
