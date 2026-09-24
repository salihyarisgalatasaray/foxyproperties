import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";
import { getT } from "@/lib/i18n/server";

export async function Finale() {
  const t = await getT();
  return (
    <section data-testid="home-finale" className="scene-vignette gold-seam-top relative min-h-screen overflow-hidden bg-[#0B0B0A]">
      <ParallaxImage src="/home/finale.jpg" alt="London skyline at dusk from a private terrace" objectPosition="50% 50%" from={-3} to={3} scaleFrom={1.10} scaleTo={1.18} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/45 to-[#0B0B0A]/25" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 py-24 md:px-10 md:py-28">
        <Reveal>
          <div className="leading-none">
            <span className="display block text-3xl tracking-[.16em] text-[#D4AF37]">FOXY</span>
            <span className="block text-[10px] tracking-[.42em] text-white/60">PROPERTY</span>
          </div>
          <h2 className="display mt-8 text-4xl leading-[1.05] md:text-6xl">
            {t("MORE THAN A PROPERTY.")}<br />{t("A LONGER VIEW.")}
          </h2>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="/about" data-testid="finale-about" className="group inline-flex items-center gap-2 bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-colors hover:bg-[#e6c84f]">
              {t("ABOUT FOXY")} <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="/contact" data-testid="finale-consult" className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.16em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
              {t("BOOK A CONSULTATION")} →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
