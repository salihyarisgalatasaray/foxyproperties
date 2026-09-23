"use client";
import { useEffect, useState } from "react";

type Item = { label: string; href: string };
type Nav = { label: string; href: string; children?: Item[] };

const NAV: Nav[] = [
  { label: "Buy", href: "/properties?intent=buy", children: [
    { label: "For Sale", href: "/properties?intent=buy" },
    { label: "New Homes", href: "/properties" },
    { label: "Acquisitions", href: "/investment" },
    { label: "International Investors", href: "/investment" },
  ] },
  { label: "Rent", href: "/properties?intent=rent" },
  { label: "Invest", href: "/investment" },
  { label: "HMO", href: "/#lab" },
  { label: "Sell", href: "/sell" },
  { label: "Let", href: "/lettings" },
  { label: "Landlords", href: "/landlords" },
  { label: "Property Lab", href: "/#lab" },
  { label: "Mortgages", href: "/mortgages" },
  { label: "Areas", href: "/areas" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between px-5 transition-colors duration-500 md:px-8 ${
        scrolled ? "border-b border-white/10 bg-[#0B0B0A]/80 backdrop-blur-md" : "bg-gradient-to-b from-black/50 to-transparent"
      }`}
    >
      <a href="/" data-testid="nav-logo" className="leading-none">
        <span className="display block text-lg tracking-[.16em] text-[#D4AF37]">FOXY</span>
        <span className="block text-[9px] tracking-[.4em] text-white/60">PROPERTY</span>
      </a>

      <nav className="hidden items-center gap-5 text-[11px] tracking-[.1em] xl:flex">
        {NAV.map((n) => (
          <div key={n.label} className="group relative">
            <a
              href={n.href}
              data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="nav-underline flex items-center gap-1 py-6 text-white/85 transition-colors duration-300 hover:text-[#D4AF37]"
            >
              {n.label}
              {n.children && <span className="text-[7px] text-[#D4AF37]">▾</span>}
            </a>
            {n.children && (
              <div className="invisible absolute left-0 top-[64px] w-60 translate-y-2 border border-white/10 bg-[#0E0E0E] p-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {n.children.map((c) => (
                  <a key={c.label} href={c.href} className="block px-4 py-2.5 text-[11px] tracking-[.08em] text-white/70 transition-colors hover:bg-white/5 hover:text-[#D4AF37]">
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="hidden items-center gap-3 xl:flex">
        <span className="text-[10px] tracking-[.14em] text-white/45"><span className="text-[#D4AF37]">EN</span> · TR</span>
        <a href="/admin" data-testid="nav-login" className="border border-white/25 px-4 py-2.5 text-[10px] tracking-[.13em] text-white/85 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
          LOGIN
        </a>
        <a href="/contact" data-testid="nav-getstarted" className="bg-[#D4AF37] px-4 py-2.5 text-[10px] font-semibold tracking-[.13em] text-black transition-colors hover:bg-[#e6c84f]">
          GET STARTED
        </a>
      </div>

      <button data-testid="nav-mobile-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="text-2xl text-[#D4AF37] xl:hidden">
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div data-testid="nav-mobile-panel" className="fixed inset-x-0 top-[76px] z-50 max-h-[calc(100vh-76px)] overflow-y-auto border-b border-white/10 bg-[#0B0B0A] px-6 py-5 xl:hidden">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="block border-b border-white/5 py-3 text-sm tracking-[.12em] text-white/85">
              {n.label}
            </a>
          ))}
          <div className="mt-5 flex gap-3">
            <a href="/admin" onClick={() => setOpen(false)} className="flex-1 border border-white/25 px-4 py-3 text-center text-xs tracking-[.13em] text-white/85">LOGIN</a>
            <a href="/contact" onClick={() => setOpen(false)} className="flex-1 bg-[#D4AF37] px-4 py-3 text-center text-xs font-semibold tracking-[.13em] text-black">GET STARTED</a>
          </div>
        </div>
      )}
    </header>
  );
}
