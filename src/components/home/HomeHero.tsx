"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/i18n/language";

const TABS = ["Buy", "Rent", "Invest"];
const PRICE: Record<string, [string, string]> = {
  "Any": ["", ""],
  "Up to £500k": ["", "500000"],
  "£500k – £1m": ["500000", "1000000"],
  "£1m – £2m": ["1000000", "2000000"],
  "£2m – £5m": ["2000000", "5000000"],
  "£5m+": ["5000000", ""],
};

type Chapter = {
  img: string;
  alt: string;
  eyebrow: string;
  title: React.ReactNode;
  ctas: React.ReactNode;
};

export function HomeHero() {
  const router = useRouter();
  const t = useT();
  const [tab, setTab] = useState("Buy");
  const [reduced, setReduced] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // 0..1 across the sticky sequence

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const q = new URLSearchParams();
    q.set("intent", tab.toLowerCase());
    const loc = String(f.get("location") || "").trim();
    const type = String(f.get("type") || "");
    const beds = String(f.get("beds") || "");
    const [min, max] = PRICE[String(f.get("price") || "Any")] || ["", ""];
    if (loc) q.set("location", loc);
    if (type && type !== "Any") q.set("type", type);
    if (beds && beds !== "Any") q.set("beds", beds);
    if (min) q.set("min", min);
    if (max) q.set("max", max);
    router.push(`/properties?${q.toString()}`);
  };
  const scrollToId = (hash: string) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const progressed = Math.min(Math.max(-rect.top, 0), scrollable);
      setP(scrollable > 0 ? progressed / scrollable : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const CHAPTERS: Chapter[] = [
    {
      img: "/home/hero.jpg",
      alt: "London skyline and the Thames at late-afternoon light",
      eyebrow: t("LONDON PROPERTY · GLOBAL OPPORTUNITY."),
      title: (
        <>
          {t("YOUR NEXT")}
          <br />
          {t("PROPERTY DECISION")}
          <br />
          <span className="text-[#D4AF37]">{t("STARTS HERE.")}</span>
        </>
      ),
      ctas: (
        <>
          <a href="/properties" data-testid="hero-explore" className="group inline-flex items-center gap-2 bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold tracking-[.16em] text-black transition-colors hover:bg-[#e6c84f]">
            {t("EXPLORE PROPERTIES")} <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <button onClick={() => scrollToId("#lab")} data-testid="hero-journey" className="inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 text-xs tracking-[.16em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
            {t("START YOUR JOURNEY")}
          </button>
          <button onClick={() => scrollToId("#search")} data-testid="hero-search-shortcut" className="inline-flex items-center gap-2 px-2 py-3.5 text-xs tracking-[.16em] text-white/80 underline underline-offset-4 transition-colors hover:text-[#D4AF37]">
            {t("SEARCH PROPERTIES")}
          </button>
        </>
      ),
    },
    {
      img: "/home/west.jpg",
      alt: "Elegant West London period residential street",
      eyebrow: t("WEST LONDON"),
      title: (
        <>
          {t("CHARACTER.")} {t("CONNECTIVITY.")}
          <br />
          <span className="text-[#D4AF37]">{t("ESTABLISHED DEMAND.")}</span>
        </>
      ),
      ctas: (
        <a href="/areas" data-testid="hero-areas" className="group inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 text-xs tracking-[.16em] text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
          {t("DISCOVER THE AREAS")} <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      ),
    },
    {
      img: "/home/interior.jpg",
      alt: "Refined London residence interior in natural daylight",
      eyebrow: t("INSIDE THE PROPERTY"),
      title: (
        <>
          {t("BEAUTIFUL SPACES.")}
          <br />
          <span className="text-[#D4AF37]">{t("BETTER DECISIONS.")}</span>
        </>
      ),
      ctas: (
        <a href="/properties" data-testid="hero-inside-browse" className="group inline-flex items-center gap-2 bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold tracking-[.16em] text-black transition-colors hover:bg-[#e6c84f]">
          {t("VIEW PROPERTY")} <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      ),
    },
  ];

  const s = reduced ? 0 : p * (CHAPTERS.length - 1); // 0..2
  const active = Math.round(s);

  const stage = (
    <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0B0B0A]">
      {CHAPTERS.map((c, i) => {
        const layer = reduced ? (i === 0 ? 1 : 0) : Math.max(0, 1 - Math.abs(s - i));
        const local = reduced ? 0 : Math.min(Math.max(s - i + 0.5, 0), 1); // 0..1 within neighbourhood
        return (
          <div key={c.img} className="absolute inset-0 will-change-[opacity]" style={{ opacity: layer }}>
            <img
              src={c.img}
              alt={c.alt}
              fetchPriority={i === 0 ? "high" : "auto"}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
              style={{
                objectPosition: i === 2 ? "50% 55%" : "50% 45%",
                transform: reduced ? "scale(1.03)" : `scale(${1.04 + local * 0.05})`,
              }}
            />
          </div>
        );
      })}

      {/* Localized gradients only — keep most of the image luminous */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/55 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#0B0B0A]/70 to-transparent" />

      {/* Discreet 3-chapter indicator */}
      <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            aria-label={`Chapter ${i + 1}`}
            data-testid={`chapter-dot-${i}`}
            onClick={() => {
              const el = outerRef.current;
              if (!el) return;
              const scrollable = el.offsetHeight - window.innerHeight;
              window.scrollTo({ top: el.offsetTop + (i / (CHAPTERS.length - 1)) * scrollable, behavior: "smooth" });
            }}
            className="grid place-items-center"
          >
            <span className={`h-2 w-2 rounded-full transition-all ${active === i ? "scale-125 bg-[#D4AF37]" : "bg-white/40 hover:bg-white/70"}`} />
          </button>
        ))}
      </div>

      {/* Headlines — only one group visible at a time */}
      <div className="relative z-10 mx-auto flex h-screen max-w-7xl items-center px-5 md:px-10">
        <div className="relative w-full max-w-3xl">
          {CHAPTERS.map((c, i) => {
            const op = reduced ? (i === 0 ? 1 : 0) : Math.min(Math.max(1 - Math.abs(s - i) * 2, 0), 1);
            return (
              <div
                key={i}
                aria-hidden={op < 0.5}
                className={i === 0 && reduced ? "" : "absolute inset-x-0 top-1/2 -translate-y-1/2"}
                style={{ opacity: op, pointerEvents: op > 0.5 ? "auto" : "none" }}
              >
                <p className="text-[11px] tracking-[.36em] text-[#D4AF37]" style={{ textShadow: "0 1px 12px rgba(0,0,0,.5)" }}>
                  {c.eyebrow}
                </p>
                <h1 className="display mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl" style={{ textShadow: "0 2px 26px rgba(0,0,0,.45)" }}>
                  {c.title}
                </h1>
                <div className="mt-8 flex flex-wrap items-center gap-4">{c.ctas}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <span className="text-[9px] tracking-[.3em] text-white/70">{t("SCROLL TO EXPLORE")}</span>
        <span className="foxy-bounce text-lg leading-none text-[#D4AF37]">↓</span>
      </div>
    </div>
  );

  return (
    <>
      <section id="hero" data-testid="home-hero" aria-label="London to home">
        {reduced ? (
          stage
        ) : (
          <div ref={outerRef} className="relative h-[340vh]">
            {stage}
          </div>
        )}
      </section>

      {/* Full search panel — spacious, directly after the cinematic opening */}
      <section id="search" data-testid="home-search-section" className="scene-vignette relative border-y border-white/10 bg-[#0E0E0E] px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] tracking-[.36em] text-[#D4AF37]">{t("SEARCH PROPERTIES")}</p>
          <h2 className="display mt-4 text-2xl md:text-3xl">{t("BEAUTIFUL SPACES.")}</h2>
          <form onSubmit={submit} data-testid="hero-search" className="mt-8 w-full border border-white/12 bg-black/40 p-3 backdrop-blur-md">
            <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
              {TABS.map((tb) => (
                <button type="button" key={tb} onClick={() => setTab(tb)} data-testid={`search-tab-${tb.toLowerCase()}`} className={`px-4 py-2 text-[11px] tracking-[.14em] transition-colors ${tab === tb ? "text-[#D4AF37]" : "text-white/55 hover:text-white"}`}>
                  {t(tb.toUpperCase())}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
              <input name="location" data-testid="search-location" placeholder={t("Enter location (e.g. Chelsea, W8)")} className="bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-[#D4AF37]" />
              <select name="type" data-testid="search-type" defaultValue="Any" className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#D4AF37]">
                {["Any", "Apartment", "House", "Penthouse", "Commercial"].map((o) => <option key={o} value={o} className="bg-[#141413]">{t(o)}</option>)}
              </select>
              <select name="beds" data-testid="search-beds" defaultValue="Any" className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#D4AF37]">
                {["Any", "1+", "2+", "3+", "4+", "5+"].map((o) => <option key={o} value={o} className="bg-[#141413]">{t(o)}</option>)}
              </select>
              <select name="price" data-testid="search-price" defaultValue="Any" className="cursor-pointer bg-white/5 px-3 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#D4AF37]">
                {Object.keys(PRICE).map((o) => <option key={o} value={o} className="bg-[#141413]">{t(o)}</option>)}
              </select>
              <button type="submit" data-testid="search-submit" className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold tracking-[.14em] text-black transition-colors hover:bg-[#e6c84f]">
                {t("SEARCH PROPERTIES")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
