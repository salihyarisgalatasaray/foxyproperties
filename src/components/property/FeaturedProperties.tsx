import Link from "next/link";
import { prototypeProperties } from "@/lib/properties";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

// Local self-hosted imagery used purely to illustrate the prototype cards (clearly labelled).
const IMAGES: Record<string, string> = {
  "prototype-chelsea-residence": "/properties/chelsea.jpg",
  "prototype-kensington-residence": "/properties/kensington.jpg",
  "prototype-fulham-residence": "/properties/fulham.jpg",
};

export function FeaturedProperties() {
  return (
    <section data-testid="featured-properties" className="mx-auto max-w-6xl px-5 pb-32 md:px-12">
      <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <p className="text-xs tracking-[.3em] text-[#D4AF37]">FEATURED PROPERTIES</p>
          <h2 className="display mt-4 text-3xl md:text-5xl">A considered selection.</h2>
        </div>
        <Link href="/properties" className="hidden shrink-0 text-xs tracking-[.16em] text-[#D4AF37] transition-colors hover:text-white md:block">
          VIEW ALL →
        </Link>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {prototypeProperties.map((p) => (
          <article
            key={p.id}
            data-testid={`featured-card-${p.slug}`}
            className="group flex flex-col overflow-hidden border border-white/10 bg-[#141413] transition-transform duration-500 hover:-translate-y-1.5"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={IMAGES[p.slug]}
                alt={`${p.title} — prototype`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 border border-[#D4AF37]/60 bg-black/60 px-3 py-2 text-[10px] tracking-[.18em] text-[#D4AF37]">
                {p.status.replaceAll("_", " ")}
              </span>
              <span className="absolute bottom-4 left-4 text-[10px] tracking-[.18em] text-white/70">PROTOTYPE · NOT A LIVE PROPERTY</span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="text-[11px] tracking-[.22em] text-[#D4AF37]">{p.area.toUpperCase()}</p>
              <h3 className="display mt-2 text-2xl">{p.title}</h3>
              <p className="mt-3 text-lg text-white/90">{gbp.format(p.price)}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-4 text-sm text-white/65">
                <span>{p.bedrooms} Bed</span>
                <span>{p.bathrooms} Bath</span>
                <span>{p.type}</span>
              </div>
              <Link
                href={`/properties/${p.slug}`}
                data-testid={`featured-view-${p.slug}`}
                className="group/btn mt-6 inline-flex items-center justify-center gap-2 bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.16em] text-black transition-colors duration-300 hover:bg-[#e6c84f]"
              >
                VIEW PROPERTY
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-[11px] tracking-[.12em] text-white/35">
        Prototype records shown for demonstration only — not live property instructions or offers.
      </p>
    </section>
  );
}
