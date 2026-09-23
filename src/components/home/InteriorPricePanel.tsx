"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function InteriorPricePanel() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { autoAlpha: 1, x: 0, scale: 1 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%", once: true } });
        tl.from(el, { autoAlpha: 0, x: 70, scale: 0.96, duration: 0.9, ease: "power3.out" })
          .from(lines, { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.12, ease: "power2.out" }, "-=0.45");
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      data-testid="interior-price-panel"
      className="absolute bottom-16 right-5 z-10 w-[min(88vw,20rem)] border border-white/12 bg-black/70 p-6 backdrop-blur-md md:right-10"
    >
      <p data-line className="display text-3xl text-white">£1,250,000</p>
      <p data-line className="mt-1 text-sm text-[#A7A29A]">Kensington, London W8</p>
      <div data-line className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-4 text-sm text-white/75">
        <span>3 Bedrooms</span><span>2 Bathrooms</span><span>1,450 sq ft</span>
      </div>
      <p data-line className="mt-4 text-[10px] tracking-[.18em] text-[#D4AF37]/80">PROTOTYPE · NOT A LIVE PROPERTY</p>
    </div>
  );
}
