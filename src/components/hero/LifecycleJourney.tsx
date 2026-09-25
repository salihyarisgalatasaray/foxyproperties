"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stage = {
  key: string;
  index: string;
  place: string;
  line: string;
  cta: string;
  href: string;
  img: string;
  pos?: string;
  concept?: boolean;
};

const STAGES: Stage[] = [
  { key: "value", index: "08", place: "PROPERTY VALUE", line: "UNDERSTAND THE NUMBER BEHIND THE PROPERTY.", cta: "EXPLORE PROPERTIES", href: "/properties", img: "/journey/value.jpg" },
  { key: "investment", index: "09", place: "INVESTMENT", line: "STRATEGIC RETURNS, ILLUSTRATED HONESTLY.", cta: "ANALYSE AN INVESTMENT", href: "/investment" , img: "/journey/investment.jpg" },
  { key: "finance", index: "10", place: "FINANCE", line: "PROPERTY FINANCE, PROPERLY CONSIDERED.", cta: "FINANCE ENQUIRY", href: "/mortgages", img: "/journey/finance.jpg" },
  { key: "letting", index: "11", place: "LETTING", line: "FROM AVAILABLE TO LET, CONSIDERED PROPERLY.", cta: "EXPLORE LETTINGS", href: "/lettings", img: "/journey/letting.jpg" },
  { key: "tenant", index: "12", place: "TENANT", line: "THE RIGHT TENANT, THE RIGHT HOME.", cta: "REGISTER AS A TENANT", href: "/lettings#register", img: "/journey/tenant.jpg" },
  { key: "rent", index: "13", place: "RENT", line: "RENT COLLECTED. ARREARS MONITORED.", cta: "EXPLORE MANAGEMENT", href: "/property-management#options", img: "/journey/rent.jpg" },
  { key: "management", index: "14", place: "MANAGEMENT", line: "YOUR PROPERTY. OUR ATTENTION.", cta: "EXPLORE MANAGEMENT", href: "/property-management", img: "/journey/management.jpg" },
  { key: "dashboard", index: "15", place: "LANDLORD DASHBOARD", line: "ONE CLEAR VIEW OF YOUR PORTFOLIO.", cta: "PORTFOLIO LANDLORDS", href: "/landlords#portfolio", img: "/journey/dashboard.jpg", concept: true },
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function LifecycleJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Array<HTMLDivElement | null>>([]);
  const capsRef = useRef<Array<HTMLDivElement | null>>([]);
  const railNumRef = useRef<HTMLSpanElement>(null);
  const railLabelRef = useRef<HTMLSpanElement>(null);
  const railBarRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const n = STAGES.length;
    let last = -1;

    const render = (p: number) => {
      for (let i = 0; i < n; i++) {
        const layer = layersRef.current[i];
        if (!layer) continue;
        const a = i / n;
        const b = (i + 1) / n;
        const w = b - a || 1;
        const local = clamp01((p - a) / w);
        const CF = 0.6 / n;
        const op = i === 0 ? 1 : clamp01((p - (a - CF)) / CF);
        const scale = 1.05 + 0.14 * local;
        const blur = (1 - op) * 6;
        layer.style.opacity = String(op);
        layer.style.transform = `scale(${scale.toFixed(4)})`;
        layer.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
      }
      for (let i = 0; i < n; i++) {
        const cap = capsRef.current[i];
        if (!cap) continue;
        const a = i / n;
        const b = (i + 1) / n;
        const w = b - a;
        const inP = clamp01((p - a) / (w * 0.32));
        const outP = i === n - 1 ? 0 : clamp01((p - (b - w * 0.24)) / (w * 0.24));
        const op = inP * (1 - outP);
        const ty = (1 - inP) * 32 - outP * 24;
        cap.style.opacity = String(op);
        cap.style.transform = `translateY(${ty.toFixed(1)}px)`;
        cap.style.pointerEvents = op > 0.6 ? "auto" : "none";
      }
      let cur = 0;
      for (let i = 0; i < n; i++) if (p >= i / n - 0.02) cur = i;
      if (railBarRef.current) railBarRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      if (cur !== last) {
        last = cur;
        if (railNumRef.current) railNumRef.current.textContent = STAGES[cur].index;
        if (railLabelRef.current) railLabelRef.current.textContent = STAGES[cur].place;
      }
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.style.height = "auto";
        if (staticRef.current) staticRef.current.style.display = "block";
        const sticky = section.querySelector<HTMLDivElement>("[data-sticky]");
        if (sticky) sticky.style.display = "none";
      });

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const isDesktop = !!context.conditions?.desktop;
          section.style.height = isDesktop ? "760vh" : "620vh";
          if (staticRef.current) staticRef.current.style.display = "none";
          const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: isDesktop ? 0.7 : 0.4,
            onUpdate: (self) => render(self.progress),
          });
          render(0);
          const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);
          return () => {
            st.kill();
            window.clearTimeout(refresh);
          };
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid="lifecycle-journey"
      aria-label="The FOXY properties lifecycle journey"
      style={{ height: "760vh" }}
      className="relative bg-[#0B0B0A] text-white"
    >
      <div data-sticky className="sticky top-0 h-screen w-full overflow-hidden">
        {STAGES.map((s, i) => (
          <div
            key={s.key}
            ref={(el) => { layersRef.current[i] = el; }}
            data-testid={`journey-layer-${s.key}`}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0, transform: "scale(1.05)" }}
          >
            <img
              src={s.img}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: s.pos || "50% 50%" }}
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/5" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />

        <div className="absolute inset-0 z-10">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => { capsRef.current[i] = el; }}
              data-testid={`journey-caption-${s.key}`}
              className="absolute left-6 top-1/2 max-w-3xl -translate-y-1/2 md:left-16"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="mb-4 text-[11px] tracking-[.42em] text-[#D4AF37]">
                {s.index} <span className="text-white/30">—</span> {s.place}
                {s.concept && (
                  <span className="ml-3 border border-white/25 px-2 py-0.5 text-[8px] tracking-[.2em] text-white/60">
                    CONCEPT
                  </span>
                )}
              </p>
              <p className="display text-[2.4rem] leading-[1.05] md:text-[4.2rem]">{s.line}</p>
              <a
                href={s.href}
                data-testid={`journey-cta-${s.key}`}
                className="group mt-7 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs tracking-[.16em] text-white transition-colors duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                {s.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>

        <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-4 md:flex">
          <div className="text-right">
            <span ref={railNumRef} className="block text-[11px] tracking-[.3em] text-[#D4AF37]">08</span>
            <span ref={railLabelRef} className="block text-[10px] tracking-[.26em] text-white/50">PROPERTY VALUE</span>
          </div>
          <div className="relative h-40 w-px bg-white/15">
            <span ref={railBarRef} className="absolute left-0 top-0 block h-full w-px origin-top bg-[#D4AF37]" style={{ transform: "scaleY(0)" }} />
          </div>
          <span className="text-[10px] tracking-[.26em] text-white/30">15</span>
        </div>
      </div>

      {/* Reduced-motion fallback: stacked, fully usable */}
      <div ref={staticRef} style={{ display: "none" }} className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">THE FOXY JOURNEY</p>
        <h2 className="display mt-5 text-4xl">FROM PROPERTY TO PORTFOLIO.</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {STAGES.map((s) => (
            <a key={s.key} href={s.href} className="block border border-white/10 bg-[#141413] p-7 transition hover:border-[#D4AF37]/60">
              <p className="text-[11px] tracking-[.3em] text-[#D4AF37]">{s.index} — {s.place}</p>
              <p className="display mt-3 text-2xl leading-snug">{s.line}</p>
              <span className="mt-4 inline-block text-xs tracking-[.16em] text-[#D4AF37]">{s.cta} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
