"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/i18n/language";

export type Stat = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  static?: string; // non-numeric display (e.g. "24/7"), skips count-up
};

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({ s, run }: { s: Stat; run: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run || s.static) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(s.to);
      return;
    }
    let raf = 0;
    const dur = 1300;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(s.to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, s.to, s.static]);

  if (s.static) return <>{s.static}</>;
  return (
    <>
      {s.prefix ?? ""}
      {val.toFixed(s.decimals ?? 0)}
      {s.suffix ?? ""}
    </>
  );
}

export function SceneStats({ stats, align = "left" }: { stats: Stat[]; align?: "left" | "right" }) {
  const t = useT();
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      data-testid="scene-stats"
      className={`mt-10 flex flex-wrap gap-4 ${align === "right" ? "justify-end" : ""}`}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          data-testid={`scene-stat-${i}`}
          className={`scene-stat group relative min-w-[9rem] overflow-hidden border border-white/12 bg-black/40 px-5 py-4 backdrop-blur-md transition-colors hover:border-[#D4AF37]/50 ${inView ? "is-in" : ""}`}
          style={{ transitionDelay: `${i * 120}ms` }}
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
          <p className="display text-3xl leading-none text-[#D4AF37] md:text-4xl">
            <CountUp s={s} run={inView} />
          </p>
          <p className="mt-2 text-[10px] tracking-[.22em] text-white/55">{t(s.label)}</p>
        </div>
      ))}
    </div>
  );
}
