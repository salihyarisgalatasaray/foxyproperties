type CTA = { label: string; href: string; primary?: boolean };
import { ParallaxBackground } from "./ParallaxBackground";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  ctas,
  concept,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  ctas?: CTA[];
  concept?: boolean;
  align?: "left" | "center";
}) {
  return (
    <section
      data-testid="page-hero"
      className="relative flex min-h-[78vh] items-end overflow-hidden pt-[82px]"
    >
      <ParallaxBackground image={image} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/55 to-[#0B0B0A]/25" />
      {concept && (
        <span className="absolute right-5 top-[100px] border border-white/25 bg-black/40 px-3 py-1 text-[9px] tracking-[.2em] text-white/70 backdrop-blur md:right-12">
          CONCEPT IMAGERY · NOT A LIVE LISTING
        </span>
      )}
      <div
        className={`relative mx-auto w-full max-w-6xl px-5 pb-20 md:px-12 md:pb-28 ${
          align === "center" ? "text-center" : ""
        }`}
      >
        <p className="foxy-fade-up text-xs tracking-[.32em] text-[#D4AF37]">{eyebrow}</p>
        <h1 className="foxy-fade-up display mt-6 max-w-4xl text-4xl leading-[1.05] md:text-7xl">
          {title}
        </h1>
        {intro && (
          <p
            className={`foxy-fade-up mt-7 max-w-2xl text-lg leading-8 text-[#C9C4BB] ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {intro}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div
            className={`foxy-fade-up mt-10 flex flex-wrap gap-4 ${
              align === "center" ? "justify-center" : ""
            }`}
          >
            {ctas.map((c) => (
              <a
                key={c.label}
                href={c.href}
                data-testid={`hero-cta-${c.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className={
                  c.primary
                    ? "bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-transform hover:-translate-y-0.5"
                    : "border border-[#D4AF37] px-7 py-4 text-xs tracking-[.16em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
                }
              >
                {c.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
