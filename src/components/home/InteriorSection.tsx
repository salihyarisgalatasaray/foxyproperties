import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";

export function InteriorSection() {
  return (
    <section id="interior" data-testid="home-interior" className="diag-top relative -mt-[4vw] min-h-[90vh] overflow-hidden bg-[#0B0B0A]">
      <ParallaxImage src="/home/interior.jpg" alt="Luxury London interior" objectPosition="50% 45%" from={-11} to={11} scaleFrom={1.24} scaleTo={1.36} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0A]/95 via-[#0B0B0A]/40 to-[#0B0B0A]/20" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B0B0A] to-transparent" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 py-24 md:px-10">
        <Reveal>
          <p className="display text-2xl text-[#D4AF37]/70">05</p>
          <p className="mt-3 text-[11px] tracking-[.4em] text-[#D4AF37]">INSIDE THE PROPERTY</p>
          <h2 className="display mt-5 max-w-2xl text-4xl leading-[1.05] md:text-6xl">
            BEAUTIFUL SPACES.<br />BETTER DECISIONS.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#C9C4BB] md:text-base">
            Explore exceptional homes with the detail, insight and context you need.
          </p>
          <a href="/properties" data-testid="interior-cta" className="group mt-8 inline-flex items-center gap-2 text-xs tracking-[.16em] text-[#D4AF37] transition-colors hover:text-white">
            VIEW PROPERTY <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>

      {/* Floating property information panel (prototype / illustrative) */}
      <div data-testid="interior-price-panel" className="absolute bottom-16 right-5 z-10 w-[min(88vw,20rem)] border border-white/12 bg-black/70 p-6 backdrop-blur-md md:right-10">
        <p className="display text-3xl text-white">£1,250,000</p>
        <p className="mt-1 text-sm text-[#A7A29A]">Kensington, London W8</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-4 text-sm text-white/75">
          <span>3 Bedrooms</span><span>2 Bathrooms</span><span>1,450 sq ft</span>
        </div>
        <p className="mt-4 text-[10px] tracking-[.18em] text-[#D4AF37]/80">PROTOTYPE · NOT A LIVE PROPERTY</p>
      </div>
    </section>
  );
}
