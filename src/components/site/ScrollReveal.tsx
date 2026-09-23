"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal for every non-home page: each <section> in <main>
 * fades + slides up as it enters the viewport (IntersectionObserver).
 * The homepage keeps its bespoke cinematic animation, so it is skipped.
 */
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    if (path === "/") return;
    const run = () => {
      const els = Array.from(document.querySelectorAll("main section")) as HTMLElement[];
      if (!els.length) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        els.forEach((e) => e.classList.add("reveal", "is-in"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      els.forEach((e) => {
        e.classList.add("reveal");
        const r = e.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) e.classList.add("is-in");
        else io.observe(e);
      });
      return () => io.disconnect();
    };
    const t = window.setTimeout(run, 60);
    return () => window.clearTimeout(t);
  }, [path]);
  return null;
}
