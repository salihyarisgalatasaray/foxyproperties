"use client";
import { useEffect, useRef } from "react";

export function ParallaxBackground({ image, className = "" }: { image: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (below) .. 1 (above), 0 when section centered
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const shift = Math.max(-60, Math.min(60, progress * -60));
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.18)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-testid="parallax-bg"
      className={`absolute inset-0 bg-cover bg-center will-change-transform ${className}`}
      style={{ backgroundImage: `url(${image})`, transform: "scale(1.18)" }}
    />
  );
}
