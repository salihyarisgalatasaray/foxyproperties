"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked "camera" parallax for full-bleed section backgrounds:
 * the image drifts vertically and slowly pushes in as the section passes
 * through the viewport. Overscaled so edges never reveal. Reduced-motion safe.
 */
export function ParallaxImage({
  src,
  alt,
  objectPosition = "50% 50%",
  from = -5,
  to = 5,
  scaleFrom = 1.14,
  scaleTo = 1.24,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  from?: number;
  to?: number;
  scaleFrom?: number;
  scaleTo?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(img, { yPercent: 0, scale: scaleFrom });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          img,
          { yPercent: from, scale: scaleFrom },
          {
            yPercent: to,
            scale: scaleTo,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });
    }, wrap);
    return () => ctx.revert();
  }, [from, to, scaleFrom, scaleTo]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover will-change-transform"
        style={{ objectPosition, transform: `scale(${scaleFrom})` }}
      />
    </div>
  );
}
