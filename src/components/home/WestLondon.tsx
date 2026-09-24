import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";
import { getT } from "@/lib/i18n/server";

export async function WestLondon() {
  const t = await getT();
  return (
    <section id="west" data-testid="home-west" className="scene-vignette gold-seam-top relative min-h-screen overflow-hidden bg-[#0B0B0A]">
      <ParallaxImage src="/home/west.jpg" alt="West London period terrace" objectPosition="50% 35%" from={-7} to={7} scaleFrom={1.16} scaleTo={1.26} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0A] via-[#0B0B0A]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B0B0A] to-transparent" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-24 md:px-10">
        <Reveal>
          <p className="display text-2xl text-[#D4AF37]/70">02</p>
          <p className="mt-3 text-[11px] tracking-[.4em] text-[#D4AF37]">{t("WEST LONDON")}</p>
          <h2 className="display mt-5 text-4xl leading-[1.05] md:text-6xl">
            {t("CHARACTER.")}<br />{t("CONNECTIVITY.")}<br />{t("ESTABLISHED DEMAND.")}
          </h2>
          <a href="/areas" data-testid="west-cta" className="group mt-8 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs tracking-[.16em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
            {t("DISCOVER THE AREAS")} <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
