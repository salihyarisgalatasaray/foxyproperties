"use client";
import { useState } from "react";

type Item = { label: string; href: string };
type Nav = { label: string; href: string; children?: Item[] };

const NAV: Nav[] = [
  {
    label: "PROPERTIES",
    href: "/properties",
    children: [
      { label: "For Sale", href: "/properties?intent=buy" },
      { label: "To Rent", href: "/properties?intent=rent" },
      { label: "All Properties", href: "/properties" },
    ],
  },
  { label: "SELL", href: "/sell" },
  {
    label: "LETTINGS",
    href: "/lettings",
    children: [
      { label: "Properties to Rent", href: "/properties?intent=rent" },
      { label: "Find a Home", href: "/lettings#find" },
      { label: "Register as a Tenant", href: "/lettings#register" },
      { label: "Tenant Guide", href: "/lettings#guide" },
      { label: "Report Maintenance", href: "/lettings#maintenance" },
    ],
  },
  {
    label: "LANDLORDS",
    href: "/landlords",
    children: [
      { label: "Let Your Property", href: "/landlords" },
      { label: "Rental Valuation", href: "/landlords#valuation" },
      { label: "Let Only", href: "/property-management#options" },
      { label: "Rent Collection", href: "/property-management#options" },
      { label: "Fully Managed", href: "/property-management#options" },
      { label: "Management Options", href: "/property-management" },
      { label: "Portfolio Landlords", href: "/landlords#portfolio" },
      { label: "Switch to FOXY", href: "/landlords#switch" },
    ],
  },
  { label: "INVESTMENT", href: "/investment" },
  {
    label: "MORTGAGES",
    href: "/mortgages",
    children: [
      { label: "Residential", href: "/mortgages#residential" },
      { label: "Buy-to-Let", href: "/mortgages#btl" },
      { label: "Remortgage", href: "/mortgages#remortgage" },
      { label: "Portfolio", href: "/mortgages#portfolio" },
      { label: "Finance Enquiry", href: "/mortgages#enquiry" },
    ],
  },
  { label: "AREAS", href: "/areas" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "ABOUT", href: "/about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header
      data-testid="site-header"
      className="fixed inset-x-0 top-0 z-50 flex h-[82px] items-center justify-between border-b border-white/10 bg-[#0B0B0A]/70 px-5 backdrop-blur-md md:px-10"
    >
      <a href="/" data-testid="nav-logo" className="display text-xl tracking-[.14em] text-[#D4AF37]">
        FOXY
      </a>

      <nav className="hidden items-center gap-6 text-[11px] tracking-[.14em] lg:flex">
        {NAV.map((n) => (
          <div key={n.href} className="group relative">
            <a
              href={n.href}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className="nav-underline flex items-center gap-1 py-6 text-white/85 transition-colors duration-300 hover:text-[#D4AF37]"
            >
              {n.label}
              {n.children && <span className="text-[8px] text-[#D4AF37]">▾</span>}
            </a>
            {n.children && (
              <div className="invisible absolute left-0 top-[70px] w-64 translate-y-2 border border-white/10 bg-[#0E0E0E] p-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {n.children.map((c) => (
                  <a
                    key={c.label + c.href}
                    href={c.href}
                    data-testid={`nav-sub-${c.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="block px-4 py-3 text-[11px] tracking-[.1em] text-white/70 transition-colors hover:bg-white/5 hover:text-[#D4AF37]"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="hidden items-center gap-5 lg:flex">
        <span className="text-[11px] tracking-[.14em] text-white/50">
          <span className="text-[#D4AF37]">EN</span> | TR
        </span>
        <a
          href="/contact"
          data-testid="nav-consultation"
          className="border border-[#D4AF37] px-5 py-3 text-[11px] tracking-[.13em] text-[#D4AF37] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-black"
        >
          BOOK A CONSULTATION
        </a>
      </div>

      <button
        data-testid="nav-mobile-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="text-2xl text-[#D4AF37] lg:hidden"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div
          data-testid="nav-mobile-panel"
          className="fixed inset-x-0 top-[82px] z-50 max-h-[calc(100vh-82px)] overflow-y-auto border-b border-white/10 bg-[#0B0B0A] px-6 py-6 lg:hidden"
        >
          {NAV.map((n) => (
            <div key={n.href} className="border-b border-white/5 py-2">
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                data-testid={`nav-m-${n.label.toLowerCase()}`}
                className="block py-2 text-sm tracking-[.14em] text-[#D4AF37]"
              >
                {n.label}
              </a>
              {n.children && (
                <div className="pl-3">
                  {n.children.map((c) => (
                    <a
                      key={c.label + c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-xs tracking-[.1em] text-white/60"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-5 block border border-[#D4AF37] px-5 py-4 text-center text-xs tracking-[.14em] text-[#D4AF37]"
          >
            BOOK A CONSULTATION
          </a>
        </div>
      )}
    </header>
  );
}
