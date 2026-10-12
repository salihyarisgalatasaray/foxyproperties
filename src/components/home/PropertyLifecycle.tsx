"use client";
import { useEffect, useRef, useState } from "react";
import { Home, KeyRound, ShieldCheck } from "lucide-react";
import { useT } from "@/components/i18n/language";
import { Reveal } from "./Reveal";

type Stage = {
  key: string;
  label: string;
  title: string;
  copy: string;
  steps: string[];
  cta: string;
  href: string;
  duration: string;
  Icon: typeof Home;
};

const STAGES: Stage[] = [
  {
    key: "acquire",
    label: "ACQUIRE",
    title: "Find & secure the right property",
    copy: "From curated search to completion, we help you buy with clarity and conviction across prime London.",
    steps: ["Curated search & private viewings", "Offer strategy & negotiation", "Due diligence & legal coordination"],
    cta: "EXPLORE PROPERTIES",
    href: "/properties",
    duration: "TYP. 8–12 WEEKS",
    Icon: Home,
  },
  {
    key: "let",
    label: "LET",
    title: "Bring it to market",
    copy: "We position your property, reference quality tenants and handle full compliance from day one.",
    steps: ["Rental valuation & marketing", "Tenant referencing & compliance", "Tenancy setup & move-in"],
    cta: "EXPLORE LETTINGS",
    href: "/lettings",
    duration: "TYP. 1–3 WEEKS",
    Icon: KeyRound,
  },
  {
    key: "manage",
    label: "MANAGE",
    title: "Care for it, long term",
    copy: "Dedicated management, proactive maintenance and transparent reporting keep your asset performing.",
    steps: ["Rent collection & statements", "Proactive maintenance", "Inspections & renewals"],
    cta: "EXPLORE MANAGEMENT",
    href: "/property-management",
    duration: "ONGOING",
    Icon: ShieldCheck,
  },
];

const DURATION = 6000;

export function PropertyLifecycle() {
  const t = useT();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setActive((a) => (a + 1) % STAGES.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, paused]);

  const select = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  const s = STAGES[active];

  return (
    <section
      id="lifecycle"
      data-testid="home-lifecycle"
      className="diag-top relative -mt-[4vw] overflow-hidden border-t border-white/5 bg-[#121210]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-36">
        <Reveal>
          <p className="text-[11px] tracking-[.4em] text-[#D4AF37]">{t("THE FOXY LIFECYCLE")}</p>
          <h2 className="display mt-5 max-w-3xl text-4xl leading-[1.05] md:text-5xl">
            {t("ONE PROPERTY.")}<br />{t("ONE GUIDED JOURNEY.")}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#A7A29A] md:text-base">
            {t("From the first viewing to long-term stewardship — follow how FOXY supports every stage of your property.")}
          </p>
        </Reveal>

        {/* Timeline nodes */}
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 md:block" />
          <div
            className="absolute left-0 top-6 hidden h-px bg-[#D4AF37] transition-[width] duration-500 ease-out md:block"
            style={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
            {STAGES.map((st, i) => {
              const done = i <= active;
              const isActive = i === active;
              return (
                <button
                  key={st.key}
                  onClick={() => select(i)}
                  data-testid={`lifecycle-node-${st.key}`}
                  className="group relative flex items-center gap-4 text-left md:flex-col md:items-start"
                >
                  <span
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isActive
                        ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                        : done
                        ? "border-[#D4AF37]/70 bg-[#121210] text-[#D4AF37]"
                        : "border-white/20 bg-[#121210] text-white/40 group-hover:border-[#D4AF37]/60 group-hover:text-[#D4AF37]"
                    }`}
                  >
                    <st.Icon className="h-5 w-5" strokeWidth={1.5} />
                    {isActive && !paused && (
                      <svg className="pointer-events-none absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="23"
                          fill="none"
                          stroke="rgba(212,175,55,.55)"
                          strokeWidth="2"
                          strokeDasharray={2 * Math.PI * 23}
                          strokeDashoffset={2 * Math.PI * 23 * (1 - progress)}
                        />
                      </svg>
                    )}
                  </span>
                  <span className="md:mt-4">
                    <span className="block text-[10px] tracking-[.24em] text-white/40">0{i + 1}</span>
                    <span
                      className={`mt-1 block text-sm tracking-[.16em] transition-colors ${
                        isActive ? "text-[#D4AF37]" : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {t(st.label)}
                    </span>
                    <span className="mt-1 block text-[9px] tracking-[.18em] text-white/35">{t(st.duration)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div key={s.key} data-testid="lifecycle-detail" className="lifecycle-fade">
            <span data-testid="lifecycle-duration" className="inline-flex items-center gap-2 border border-[#D4AF37]/30 px-3 py-1.5 text-[10px] tracking-[.2em] text-[#D4AF37]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" /> {t(s.duration)}
            </span>
            <h3 className="display mt-5 text-3xl leading-tight md:text-4xl">{t(s.title)}</h3>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#C9C4BB] md:text-base">{t(s.copy)}</p>
            <a
              href={s.href}
              data-testid="lifecycle-cta"
              className="group mt-8 inline-flex items-center gap-2 bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-colors hover:bg-[#e6c84f]"
            >
              {t(s.cta)} <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          <ul key={`${s.key}-steps`} className="lifecycle-fade divide-y divide-white/10 border-l border-[#D4AF37]/30 pl-6">
            {s.steps.map((step, i) => (
              <li key={step} data-testid={`lifecycle-step-${i}`} className="flex items-baseline gap-4 py-4">
                <span className="display text-lg text-[#D4AF37]/70">0{i + 1}</span>
                <span className="text-sm leading-6 text-white/75">{t(step)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-[10px] tracking-[.2em] text-white/35">
          {t("ILLUSTRATIVE JOURNEY · SERVICES SUBJECT TO ELIGIBILITY & TERMS")}
        </p>
      </div>
    </section>
  );
}
