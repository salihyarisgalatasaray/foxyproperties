"use client";
import Link from "next/link";
import { useState, type MouseEvent } from "react";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export type FlipItem = {
  id: string;
  slug: string;
  title: string;
  area: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  listingType: string;
  sizeSqft: number;
  status: string;
  image: string | null;
  prototype: boolean;
};

const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export function PropertyFlipCard({ p, hint }: { p: FlipItem; hint?: boolean }) {
  const [flipped, setFlipped] = useState(false);

  // On touch devices, the first tap flips the card instead of navigating.
  const onFront = (e: MouseEvent) => {
    if (isTouch() && !flipped) {
      e.preventDefault();
      setFlipped(true);
    }
  };
  // Tapping the back (outside the CTA) flips it back on touch.
  const onBack = () => {
    if (isTouch()) setFlipped(false);
  };

  return (
    <div data-testid={`property-card-${p.slug}`} className={`flip-card h-[440px] ${flipped ? "is-flipped" : ""}`}>
      <div className="flip-inner">
        {/* FRONT */}
        <Link href={`/properties/${p.slug}`} onClick={onFront} className="flip-face flip-front block border border-white/10 bg-[#141413]">
          {hint && !flipped && <span className="flip-hint" data-testid="flip-hint" aria-hidden />}
          <div className="relative h-[62%] overflow-hidden bg-[radial-gradient(circle_at_70%_30%,#4b3a22,#1d1d1b_48%,#111)]">
            {p.image ? (
              <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_20%,rgba(212,175,55,.12),transparent_70%)]" />
            )}
            <span className="absolute left-4 top-4 border border-[#D4AF37]/60 bg-black/60 px-3 py-2 text-[10px] tracking-[.18em] text-[#D4AF37]">{p.status.replaceAll("_", " ")}</span>
            {p.prototype && <span className="absolute bottom-4 left-4 text-[10px] tracking-[.18em] text-white/60">PROTOTYPE · NOT A LIVE PROPERTY</span>}
          </div>
          <div className="p-5">
            <p className="text-[11px] tracking-[.22em] text-[#D4AF37]">{p.area.toUpperCase()} · {p.listingType.toUpperCase()}</p>
            <h2 className="display mt-2 text-2xl leading-tight">{p.title}</h2>
            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <p className="text-lg">{gbp.format(p.price)}</p>
              <span className="text-[10px] tracking-[.16em] text-white/45">TAP · HOVER FOR DETAILS</span>
            </div>
          </div>
        </Link>

        {/* BACK */}
        <div onClick={onBack} className="flip-face flip-back flex flex-col justify-between border border-[#D4AF37]/40 bg-[#161512] p-6">
          <div>
            <p className="text-[11px] tracking-[.22em] text-[#D4AF37]">{p.area.toUpperCase()} · {p.listingType.toUpperCase()}</p>
            <h2 className="display mt-2 text-2xl leading-tight">{p.title}</h2>
            <p className="display mt-4 text-4xl text-[#D4AF37]">{gbp.format(p.price)}</p>
            <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
              <div><dt className="text-[10px] tracking-[.16em] text-white/45">BEDROOMS</dt><dd className="display mt-1 text-2xl">{p.bedrooms}</dd></div>
              <div><dt className="text-[10px] tracking-[.16em] text-white/45">BATHROOMS</dt><dd className="display mt-1 text-2xl">{p.bathrooms}</dd></div>
              <div><dt className="text-[10px] tracking-[.16em] text-white/45">SIZE</dt><dd className="display mt-1 text-2xl">{p.sizeSqft ? p.sizeSqft.toLocaleString() : "—"}<span className="text-xs text-white/50"> sqft</span></dd></div>
            </dl>
            <p className="mt-5 text-xs capitalize text-white/55">{p.type} · {p.status.replaceAll("_", " ").toLowerCase()}</p>
          </div>
          <Link href={`/properties/${p.slug}`} data-testid={`property-view-${p.slug}`} onClick={(e) => e.stopPropagation()} className="mt-6 block bg-[#D4AF37] px-6 py-4 text-center text-xs font-semibold tracking-[.16em] text-black">
            VIEW PROPERTY →
          </Link>
        </div>
      </div>
    </div>
  );
}
