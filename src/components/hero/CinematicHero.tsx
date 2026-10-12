"use client";

import { useLayoutEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type Stage = {
  key: string;
  index: string;
  place: string;
  line: string;
  slug: string;
  pos: string;
  a: number;
  b: number;
};

// Seven stages cropped from the approved storyboard asset. Windows follow the requested scroll timeline (0–100%).
const STAGES: Stage[] = [
  { key: "london", index: "01", place: "LONDON", line: "A GLOBAL CITY. A CITY OF OPPORTUNITY.", slug: "01-london", pos: "50% 52%", a: 0.0, b: 0.16 },
  { key: "west", index: "02", place: "WEST LONDON", line: "CHARACTER. CONNECTIVITY. ESTABLISHED DEMAND.", slug: "02-westlondon", pos: "50% 50%", a: 0.16, b: 0.32 },
  { key: "chelsea", index: "03", place: "CHELSEA", line: "PRIME LONDON, CONSIDERED DIFFERENTLY.", slug: "03-chelsea", pos: "50% 50%", a: 0.32, b: 0.48 },
  { key: "property", index: "04", place: "PROPERTY", line: "A PROPERTY IS MORE THAN A NUMBER.", slug: "04-property", pos: "50% 45%", a: 0.48, b: 0.64 },
  { key: "interior", index: "05", place: "INTERIOR", line: "DESIGNED FOR THE WAY YOU WANT TO LIVE.", slug: "05-interior", pos: "50% 50%", a: 0.64, b: 0.78 },
  { key: "view", index: "06", place: "THE VIEW", line: "A DIFFERENT PERSPECTIVE ON LONDON.", slug: "06-theview", pos: "50% 48%", a: 0.78, b: 0.91 },
  { key: "foxy", index: "07", place: "FOXY", line: "", slug: "07-foxy", pos: "50% 50%", a: 0.91, b: 1.0 },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function CinematicHero({
  eyebrow,
  title = "YOUR NEXT PROPERTY DECISION STARTS HERE.",
  intro = "London property. Strategic investment. Long-term thinking.",
  ctaLabel = "EXPLORE PROPERTIES",
  ctaHref = "/properties",
}: Props) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Array<HTMLDivElement | null>>([]);
  const capsRef = useRef<Array<HTMLDivElement | null>>([]);
  const openingRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const railNumRef = useRef<HTMLSpanElement>(null);
  const railLabelRef = useRef<HTMLSpanElement>(null);
  const railBarRef = useRef<HTMLSpanElement>(null);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const loc = String(f.get("location") || "").trim();
    const intent = String(f.get("intent") || "");
    const min = String(f.get("min") || "").trim();
    const max = String(f.get("max") || "").trim();
    if (loc) params.set("location", loc);
    if (intent) params.set("intent", intent);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ""}`);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cfg = { scaleTo: 1.22 };
    let lastStage = -1;
    const HOLD = 0.1; // dramatic static hold on the London opening before the first move

    const render = (p: number) => {
      const ep = p <= HOLD ? 0 : (p - HOLD) / (1 - HOLD);

      // Image layers: crossfade (each reveals on top) + continuous push-in + focus-pull blur.
      for (let i = 0; i < STAGES.length; i++) {
        const layer = layersRef.current[i];
        if (!layer) continue;
        const s = STAGES[i];
        const w = s.b - s.a || 1;
        const local = clamp01((ep - s.a) / w);
        const CF = 0.05;
        const op = i === 0 ? 1 : clamp01((ep - (s.a - CF)) / CF);
        const scale = 1.06 + (cfg.scaleTo - 1.06) * local;
        const blur = (1 - op) * 6;
        layer.style.opacity = String(op);
        layer.style.transform = `scale(${scale.toFixed(4)})`;
        layer.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
      }

      // Opening block (headline + subheadline + search) holds through the beat, then fades as the journey begins.
      const s0 = STAGES[0];
      const w0 = s0.b - s0.a;
      const out0 = clamp01((ep - (s0.b - w0 * 0.3)) / (w0 * 0.3));
      if (openingRef.current) {
        const o = 1 - out0;
        openingRef.current.style.opacity = String(o);
        openingRef.current.style.transform = `translateY(calc(-50% + ${(-out0 * 18).toFixed(1)}px))`;
        openingRef.current.style.pointerEvents = o < 0.5 ? "none" : "auto";
      }

      // Editorial captions (stages 02–06) synchronized with the imagery.
      for (let i = 1; i < 6; i++) {
        const cap = capsRef.current[i];
        if (!cap) continue;
        const s = STAGES[i];
        const w = s.b - s.a;
        const inP = clamp01((ep - s.a) / (w * 0.34));
        const outP = clamp01((ep - (s.b - w * 0.22)) / (w * 0.22));
        const op = inP * (1 - outP);
        const ty = (1 - inP) * 30 - outP * 22;
        cap.style.opacity = String(op);
        cap.style.transform = `translateY(calc(-50% + ${ty.toFixed(1)}px))`;
      }

      // Final FOXY editorial + CTA transitions in for the last leg.
      const fp = clamp01((ep - 0.905) / 0.06);
      if (finalRef.current) {
        finalRef.current.style.opacity = String(fp);
        finalRef.current.style.transform = `translateY(calc(-50% + ${((1 - fp) * 30).toFixed(1)}px))`;
      }

      // Scroll hint lingers through the opening hold, then fades.
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p / (HOLD + 0.04)));

      // Storyboard-style stage rail.
      let cur = 0;
      for (let i = 0; i < STAGES.length; i++) if (ep >= STAGES[i].a - 0.02) cur = i;
      if (railBarRef.current) railBarRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      if (cur !== lastStage) {
        lastStage = cur;
        if (railNumRef.current) railNumRef.current.textContent = STAGES[cur].index;
        if (railLabelRef.current) railLabelRef.current.textContent = STAGES[cur].place;
      }
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Animated on-load entrance for the opening headline / subheadline / search bar.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tw = gsap.from(".hero-opening-item", { y: 28, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.15 });
        return () => tw.kill();
      });

      // Reduced motion: static, usable hero — first frame + opening + final CTA visible, no pinning.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.style.height = "100vh";
        layersRef.current.forEach((l, i) => {
          if (!l) return;
          l.style.opacity = i === 0 ? "1" : "0";
          l.style.transform = "scale(1.04)";
          l.style.filter = "none";
        });
        capsRef.current.forEach((c) => c && (c.style.opacity = "0"));
        if (openingRef.current) openingRef.current.style.opacity = "1";
        if (finalRef.current) finalRef.current.style.opacity = "0";
        if (hintRef.current) hintRef.current.style.opacity = "0";
      });

      // Full scroll-driven journey (desktop richer, mobile lighter).
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const isDesktop = !!context.conditions?.desktop;
          cfg.scaleTo = isDesktop ? 1.22 : 1.12;
          section.style.height = isDesktop ? "720vh" : "560vh";

          const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: isDesktop ? 0.7 : 0.4,
            onUpdate: (self) => render(self.progress),
          });
          render(0);

          // Extremely subtle atmospheric mouse parallax (desktop only) — never drives the journey.
          let onMove: ((e: PointerEvent) => void) | null = null;
          if (isDesktop && parallaxRef.current) {
            const quickX = gsap.quickTo(parallaxRef.current, "x", { duration: 0.9, ease: "power3.out" });
            const quickY = gsap.quickTo(parallaxRef.current, "y", { duration: 0.9, ease: "power3.out" });
            onMove = (e: PointerEvent) => {
              if (e.pointerType === "touch") return;
              quickX((e.clientX / window.innerWidth - 0.5) * 16);
              quickY((e.clientY / window.innerHeight - 0.5) * 12);
            };
            window.addEventListener("pointermove", onMove, { passive: true });
          }

          const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

          return () => {
            st.kill();
            window.clearTimeout(refresh);
            if (onMove) window.removeEventListener("pointermove", onMove);
            if (parallaxRef.current) gsap.set(parallaxRef.current, { x: 0, y: 0 });
          };
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid="cinematic-hero"
      aria-label="FOXY — a cinematic journey into London property"
      style={{ height: "720vh" }}
      className="relative bg-[#0B0B0A] text-white"
    >
      <h1 className="sr-only">{title}</h1>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Image layers (cropped storyboard panels, responsive up to 4K) */}
        <div ref={parallaxRef} className="absolute inset-0">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => { layersRef.current[i] = el; }}
              data-testid={`hero-layer-${s.key}`}
              className="absolute inset-0 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, transform: "scale(1.06)" }}
            >
              <img
                src={`/hero/panels/${s.slug}-1920.jpg`}
                srcSet={`/hero/panels/${s.slug}-1280.jpg 1280w, /hero/panels/${s.slug}-1920.jpg 1920w, /hero/panels/${s.slug}-3840.jpg 3840w`}
                sizes="100vw"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: s.pos }}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </div>
          ))}
        </div>

        {/* Atmospheric overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/5" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

        {/* Editorial layer */}
        <div className="absolute inset-0 z-10">
          {/* Opening: animated headline + subheadline + search bar */}
          <div
            ref={openingRef}
            data-testid="hero-opening"
            className="absolute left-6 top-1/2 z-20 w-[min(92vw,44rem)] -translate-y-1/2 md:left-16"
          >
            <p className="hero-opening-item mb-4 text-[11px] tracking-[.42em] text-[#D4AF37]">
              {eyebrow || "LONDON PROPERTY · DIFFERENTLY"}
            </p>
            <h2 className="hero-opening-item display text-[2.7rem] leading-[1.02] md:text-[4.4rem]">FIND YOUR PLACE IN LONDON.</h2>
            <p className="hero-opening-item mt-5 max-w-xl text-base leading-8 text-[#C9C4BB] md:text-lg">
              Explore exceptional homes across prime London — buy, rent or invest, considered differently.
            </p>

            <form
              onSubmit={onSearch}
              method="get"
              data-testid="hero-search"
              className="hero-opening-item mt-8 grid grid-cols-1 gap-2 border border-[#D4AF37]/30 bg-black/55 p-3 backdrop-blur-md sm:grid-cols-[1.5fr_1fr_0.9fr_0.9fr_auto]"
            >
              <input
                name="location"
                data-testid="hero-search-location"
                aria-label="Location"
                placeholder="Location"
                className="bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 focus:ring-1 focus:ring-[#D4AF37]"
              />
              <select
                name="intent"
                data-testid="hero-search-type"
                aria-label="Property type"
                defaultValue="Buy"
                className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option className="bg-[#141413] text-white">Buy</option>
                <option className="bg-[#141413] text-white">Rent</option>
                <option className="bg-[#141413] text-white">Invest</option>
              </select>
              <input
                name="min"
                type="number"
                min="0"
                inputMode="numeric"
                data-testid="hero-search-min"
                aria-label="Minimum price"
                placeholder="Min £"
                className="bg-white/5 px-3 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 focus:ring-1 focus:ring-[#D4AF37]"
              />
              <input
                name="max"
                type="number"
                min="0"
                inputMode="numeric"
                data-testid="hero-search-max"
                aria-label="Maximum price"
                placeholder="Max £"
                className="bg-white/5 px-3 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                data-testid="hero-search-submit"
                className="group inline-flex items-center justify-center gap-2 bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.16em] text-black transition-colors duration-300 hover:bg-[#e6c84f]"
              >
                SEARCH
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </form>
          </div>

          {/* Stage captions 02–06 */}
          {STAGES.slice(1, 6).map((s, idx) => {
            const i = idx + 1;
            return (
              <div
                key={s.key}
                ref={(el) => { capsRef.current[i] = el; }}
                data-testid={`hero-caption-${s.key}`}
                className="absolute left-6 top-1/2 max-w-3xl md:left-16"
                style={{ opacity: 0, transform: "translateY(-50%)" }}
              >
                <p className="mb-4 text-[11px] tracking-[.42em] text-[#D4AF37]">
                  {s.index} <span className="text-white/30">—</span> {s.place}
                </p>
                <p className="display text-[2.6rem] leading-[1.04] text-white md:text-[4.4rem]">{s.line}</p>
              </div>
            );
          })}

          {/* Final FOXY stage → transitions into the next homepage section */}
          <div
            ref={finalRef}
            data-testid="hero-final"
            className="absolute left-6 top-1/2 max-w-3xl md:left-16"
            style={{ opacity: 0, transform: "translateY(-50%)" }}
          >
            <p className="mb-4 text-[11px] tracking-[.42em] text-[#D4AF37]">
              07 <span className="text-white/30">—</span> FOXY
            </p>
            <p className="display text-[2.7rem] leading-[1.0] md:text-[5rem]">{title}</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#A7A29A] md:text-lg">{intro}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                data-testid="hero-explore-cta"
                href={ctaHref}
                className="group inline-flex items-center gap-2 bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-colors duration-300 hover:bg-[#e6c84f]"
              >
                {ctaLabel}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                data-testid="hero-journey-cta"
                href="/properties"
                className="group inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.16em] text-white transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                START YOUR JOURNEY
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Storyboard stage rail (desktop) */}
        <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-4 md:flex">
          <div className="text-right">
            <span ref={railNumRef} className="block text-[11px] tracking-[.3em] text-[#D4AF37]">01</span>
            <span ref={railLabelRef} className="block text-[10px] tracking-[.26em] text-white/50">LONDON</span>
          </div>
          <div className="relative h-40 w-px bg-white/15">
            <span ref={railBarRef} className="absolute left-0 top-0 block h-full w-px origin-top bg-[#D4AF37]" style={{ transform: "scaleY(0)" }} />
          </div>
          <span className="text-[10px] tracking-[.26em] text-white/30">07</span>
        </div>

        {/* Scroll hint with bouncing arrow */}
        <div ref={hintRef} data-testid="hero-scroll-hint" className="absolute bottom-8 left-6 z-20 flex flex-col items-start gap-2 md:left-16">
          <span className="text-[10px] font-medium tracking-[.34em] text-white/85" style={{ textShadow: "0 1px 12px rgba(0,0,0,.65)" }}>
            SCROLL TO EXPLORE
          </span>
          <span className="foxy-bounce text-lg leading-none text-[#D4AF37]" aria-hidden="true">↓</span>
        </div>
      </div>
    </section>
  );
}
