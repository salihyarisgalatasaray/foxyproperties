"use client";
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  ["01", "LONDON", "#hero"],
  ["02", "WEST LONDON", "#west"],
  ["03", "THE PROPERTY", "#interior"],
  ["04", "PROPERTY LAB", "#lab"],
  ["05", "INVEST", "#invest"],
  ["06", "FINANCE", "#finance"],
  ["07", "LET", "#let"],
  ["08", "MANAGE", "#manage"],
];
const TABS = ["Buy", "Rent", "Invest"];
const PRICE: Record<string, [string, string]> = {
  "Any": ["", ""],
  "Up to £500k": ["", "500000"],
  "£500k – £1m": ["500000", "1000000"],
  "£1m – £2m": ["1000000", "2000000"],
  "£2m – £5m": ["2000000", "5000000"],
  "£5m+": ["5000000", ""],
};

export function HomeHero() {
  const router = useRouter();
  const [tab, setTab] = useState("Buy");
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = new URLSearchParams();
    p.set("intent", tab.toLowerCase());
    const loc = String(f.get("location") || "").trim();
    const type = String(f.get("type") || "");
    const beds = String(f.get("beds") || "");
    const [min, max] = PRICE[String(f.get("price") || "Any")] || ["", ""];
    if (loc) p.set("location", loc);
    if (type && type !== "Any") p.set("type", type);
    if (beds && beds !== "Any") p.set("beds", beds);
    if (min) p.set("min", min);
    if (max) p.set("max", max);
    router.push(`/properties?${p.toString()}`);
  };
  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (imgRef.current) gsap.set(imgRef.current, { scale: 1.06 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        const isDesktop = window.innerWidth >= 768;
        if (imgRef.current) {
          gsap.fromTo(
            imgRef.current,
            { scale: 1.06 },
            {
              scale: 1.26,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
            }
          );
        }
        let onMove: ((e: PointerEvent) => void) | null = null;
        // Multi-layer scroll parallax: headline and search drift up at different speeds for depth.
        const st = { trigger: section, start: "top top", end: "bottom top" };
        if (headlineRef.current) gsap.to(headlineRef.current, { y: -110, ease: "none", scrollTrigger: { ...st, scrub: 0.5 } });
        if (searchRef.current) gsap.to(searchRef.current, { y: -46, ease: "none", scrollTrigger: { ...st, scrub: 1 } });
        if (isDesktop && imgWrapRef.current) {
          const qx = gsap.quickTo(imgWrapRef.current, "x", { duration: 1, ease: "power3.out" });
          const qy = gsap.quickTo(imgWrapRef.current, "y", { duration: 1, ease: "power3.out" });
          onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            qx((e.clientX / window.innerWidth - 0.5) * 20);
            qy((e.clientY / window.innerHeight - 0.5) * 14);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
        }
        return () => {
          if (onMove) window.removeEventListener("pointermove", onMove);
          if (imgWrapRef.current) gsap.set(imgWrapRef.current, { x: 0, y: 0 });
        };
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} data-testid="home-hero" className="scene-vignette gold-seam-bottom relative h-screen min-h-screen overflow-hidden bg-[#0B0B0A]">
      <div ref={imgWrapRef} className="absolute inset-0">
        <img
          ref={imgRef}
          src="/home/hero.jpg"
          srcSet="/home/hero.jpg 3840w"
          sizes="100vw"
          alt="London skyline at golden hour"
          fetchPriority="high"
          className="h-full w-full object-cover will-change-transform"
          style={{ objectPosition: "50% 45%", transform: "scale(1.06)" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0B0A] via-[#0B0B0A]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0B0B0A] to-transparent" />

      <div className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {SCENES.map(([num, label, hash], i) => (
          <button key={num} onClick={() => scrollTo(hash)} data-testid={`scene-${num}`} className="group flex items-center justify-end gap-3 text-right">
            <span className={`text-[10px] tracking-[.24em] transition-colors ${i === 0 ? "text-white" : "text-white/35 group-hover:text-white/70"}`} style={{ textShadow: "0 1px 10px rgba(0,0,0,.6)" }}>
              {num} <span className="mx-1">—</span> {label}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${i === 0 ? "bg-[#D4AF37]" : "bg-white/25 group-hover:bg-[#D4AF37]"}`} />
          </button>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col justify-center px-5 pt-24 md:px-10">
        <div ref={headlineRef} className="will-change-transform">
        <p className="foxy-fade-up text-[11px] tracking-[.4em] text-[#D4AF37]">LONDON PROPERTY · GLOBAL OPPORTUNITY.</p>
        <h1 className="foxy-fade-up display mt-6 max-w-4xl text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
          YOUR NEXT<br />PROPERTY DECISION<br /><span className="text-[#D4AF37]">STARTS HERE.</span>
        </h1>
        <p className="foxy-fade-up mt-7 text-base leading-8 text-[#C9C4BB] md:text-lg">
          London property.<br />Strategic investment.<br />Long-term thinking.
        </p>
        <div className="foxy-fade-up mt-9 flex flex-wrap gap-4">
          <a href="/properties" data-testid="hero-explore" className="group inline-flex items-center gap-2 bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-colors hover:bg-[#e6c84f]">
            EXPLORE PROPERTIES <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <button onClick={() => scrollTo("#lab")} data-testid="hero-journey" className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs tracking-[.16em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
            START YOUR JOURNEY
          </button>
        </div>
        </div>

        <div ref={searchRef} className="will-change-transform">
        <form onSubmit={submit} data-testid="hero-search" className="foxy-fade-up mt-12 w-full max-w-5xl border border-white/12 bg-black/55 p-3 backdrop-blur-md">
          <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
            {TABS.map((t) => (
              <button type="button" key={t} onClick={() => setTab(t)} data-testid={`search-tab-${t.toLowerCase()}`} className={`px-4 py-2 text-[11px] tracking-[.14em] transition-colors ${tab === t ? "text-[#D4AF37]" : "text-white/55 hover:text-white"}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
            <input name="location" data-testid="search-location" placeholder="Enter location (e.g. Chelsea, W8)" className="bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-[#D4AF37]" />
            <select name="type" data-testid="search-type" defaultValue="Any" className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#D4AF37]">
              {["Any", "Apartment", "House", "Penthouse", "Commercial"].map((o) => <option key={o} className="bg-[#141413]">{o}</option>)}
            </select>
            <select name="beds" data-testid="search-beds" defaultValue="Any" className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#D4AF37]">
              {["Any", "1+", "2+", "3+", "4+", "5+"].map((o) => <option key={o} className="bg-[#141413]">{o}</option>)}
            </select>
            <select name="price" data-testid="search-price" defaultValue="Any" className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#D4AF37]">
              {Object.keys(PRICE).map((o) => <option key={o} className="bg-[#141413]">{o}</option>)}
            </select>
            <button type="submit" data-testid="search-submit" className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.14em] text-black transition-colors hover:bg-[#e6c84f]">
              SEARCH PROPERTIES
            </button>
          </div>
        </form>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <span className="text-[9px] tracking-[.3em] text-white/70">SCROLL TO EXPLORE</span>
        <span className="foxy-bounce text-lg leading-none text-[#D4AF37]">↓</span>
      </div>
    </section>
  );
}
