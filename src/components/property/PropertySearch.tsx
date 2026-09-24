"use client";
import { useEffect, useMemo, useState } from "react";
import { useT } from "@/components/i18n/language";
import { PropertyFlipCard } from "./PropertyFlipCard";
import { PropertyMap, type MapPoint } from "../map/PropertyMap";

type Item = { id: string; slug: string; title: string; area: string; price: number; bedrooms: number; bathrooms: number; type: string; listingType: string; sizeSqft: number; status: string; image: string | null; prototype: boolean };
const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const PRICE_MAX = 5_000_000;

const AREA_CENTERS: Record<string, { lat: number; lng: number }> = {
  chelsea: { lat: 51.4875, lng: -0.1687 },
  kensington: { lat: 51.5009, lng: -0.1938 },
  fulham: { lat: 51.4749, lng: -0.209 },
  "notting hill": { lat: 51.5095, lng: -0.2018 },
  mayfair: { lat: 51.5107, lng: -0.1471 },
};
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function pointFor(it: Item): MapPoint | null {
  const c = AREA_CENTERS[it.area.trim().toLowerCase()];
  if (!c) return null;
  const h = hash(it.slug);
  return { slug: it.slug, title: it.title, area: it.area, price: it.price, lat: c.lat + ((h % 7) - 3) * 0.0009, lng: c.lng + (((h >> 3) % 7) - 3) * 0.0012 };
}

export function PropertySearch() {
  const t = useT();
  const [all, setAll] = useState<Item[]>([]);
  const [listing, setListing] = useState<"all" | "buy" | "rent">("all");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState(0);
  const [type, setType] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(PRICE_MAX);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("location")) setArea(q.get("location") as string);
    const intent = q.get("intent");
    if (intent === "rent") setListing("rent");
    else if (intent === "buy" || intent === "invest") setListing("buy");
    if (q.get("beds")) setBeds(parseInt(q.get("beds") as string, 10) || 0);
    const t = (q.get("type") || "").toLowerCase();
    if (["apartment", "house", "commercial"].includes(t)) setType(t);
    if (q.get("min")) setMin(Number(q.get("min")) || 0);
    if (q.get("max")) setMax(Number(q.get("max")) || PRICE_MAX);
    fetch("/api/properties").then((r) => r.json()).then((d) => setAll(d.items || [])).catch(() => setAll([]));
  }, []);

  const items = useMemo(() => all.filter((p) =>
    (listing === "all" || p.listingType === listing) &&
    (!area || p.area.toLowerCase().includes(area.toLowerCase())) &&
    (!beds || p.bedrooms >= beds) &&
    (!type || p.type === type) &&
    p.price >= min && p.price <= max
  ), [all, listing, area, beds, type, min, max]);

  const reset = () => { setListing("all"); setArea(""); setBeds(0); setType(""); setMin(0); setMax(PRICE_MAX); };
  const fld = "bg-[#141413] px-4 py-3 text-xs tracking-[.12em] text-white outline-none focus:ring-1 focus:ring-[#D4AF37]";

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const mapPoints = useMemo(() => items.map(pointFor).filter((p): p is MapPoint => p !== null), [items]);

  return (
    <>
      <div className="mt-10 border-y border-white/10 py-6" data-testid="property-filters">
        <div className="mb-4 inline-flex overflow-hidden border border-white/15" data-testid="filter-listing-toggle">
          {(["all", "buy", "rent"] as const).map((v) => (
            <button key={v} onClick={() => setListing(v)} data-testid={`listing-${v}`} className={`px-5 py-2 text-xs tracking-[.16em] transition-colors ${listing === v ? "bg-[#D4AF37] text-black" : "text-white/70 hover:text-white"}`}>{t(v.toUpperCase())}</button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <input value={area} onChange={(e) => setArea(e.target.value)} aria-label="Location" placeholder={t("LOCATION")} data-testid="filter-location" className={fld} />
          <select value={beds} onChange={(e) => setBeds(Number(e.target.value))} aria-label="Bedrooms" data-testid="filter-bedrooms" className={fld}><option value="0">{t("BEDROOMS (ANY)")}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select>
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type" data-testid="filter-type" className={fld}><option value="">{t("PROPERTY TYPE (ANY)")}</option><option value="apartment">{t("Apartment")}</option><option value="house">{t("House")}</option><option value="commercial">{t("Commercial")}</option></select>
          <button onClick={reset} data-testid="filter-clear" className="border border-[#D4AF37]/60 px-4 py-3 text-xs tracking-[.15em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black">{t("CLEAR FILTERS")}</button>
        </div>
        <div className="mt-6" data-testid="filter-price">
          <div className="flex justify-between text-[11px] tracking-[.14em] text-white/60"><span>{t("PRICE RANGE")}</span><span data-testid="price-label">{gbp.format(min)} — {max >= PRICE_MAX ? "£5m+" : gbp.format(max)}</span></div>
          <div className="mt-3 grid gap-2">
            <input type="range" min={0} max={PRICE_MAX} step={50000} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), max))} aria-label="Minimum price" data-testid="price-min" className="accent-[#D4AF37]" />
            <input type="range" min={0} max={PRICE_MAX} step={50000} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), min))} aria-label="Maximum price" data-testid="price-max" className="accent-[#D4AF37]" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs tracking-[.15em] text-white/45" data-testid="results-count">{items.length} {items.length === 1 ? t("RESULT") : t("RESULTS")}</p>

      {items.length && mapPoints.length > 0 ? (
        <div className="mt-4 inline-flex overflow-hidden border border-white/15 xl:hidden" data-testid="view-tabs">
          {(["list", "map"] as const).map((v) => (
            <button key={v} onClick={() => setMobileView(v)} data-testid={`view-tab-${v}`} className={`px-6 py-2.5 text-xs tracking-[.16em] transition-colors ${mobileView === v ? "bg-[#D4AF37] text-black" : "text-white/70 hover:text-white"}`}>{t(v.toUpperCase())}</button>
          ))}
        </div>
      ) : null}

      {items.length ? (
        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_400px]">
          <div className={`${mobileView === "list" ? "grid" : "hidden"} gap-6 sm:grid-cols-2 xl:grid`} onMouseLeave={() => setActiveSlug(null)}>
            {items.map((p, i) => (
              <PropertyFlipCard key={p.id} p={p} hint={i === 0} onActivate={setActiveSlug} />
            ))}
          </div>
          {mapPoints.length > 0 && (
            <div className={`${mobileView === "map" ? "block" : "hidden"} xl:block`}>
              <div className="xl:sticky xl:top-24">
                <PropertyMap points={mapPoints} activeSlug={activeSlug} resizeKey={mobileView} zoom={12} className="h-[68vh] xl:h-[640px]" />
                <p className="mt-3 text-xs tracking-[.14em] text-white/45" data-testid="map-hint">{t("HOVER OR TAP A PIN TO EXPLORE · DRAG TO TILT & ROTATE")}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 border border-white/10 p-10"><h2 className="display text-3xl">{t("No matching properties.")}</h2><p className="mt-3 text-[#A7A29A]">{t("Try adjusting the filters or price range.")}</p></div>
      )}
    </>
  );
}
