"use client";
import { useMemo, useState } from "react";
import { PropertyMap, type MapPoint } from "./PropertyMap";

type Mode = "off" | "density" | "price";

export function AreasMapPanel({ points, className }: { points: MapPoint[]; className?: string }) {
  const [mode, setMode] = useState<Mode>("off");

  const heatPoints = useMemo(() => {
    if (points.length === 0) return [];
    const prices = points.map((p) => p.price).filter((v) => v > 0);
    const max = prices.length ? Math.max(...prices) : 1;
    return points.map((p) => ({
      lng: p.lng,
      lat: p.lat,
      weight: mode === "price" ? (max ? (p.price / max) * 3 : 1) : 1.5, // density: uniform; price: relative to max listing
    }));
  }, [points, mode]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2" data-testid="heat-controls">
        <span className="mr-1 text-[10px] tracking-[.24em] text-white/40">HEAT LAYER</span>
        {(["off", "density", "price"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            data-testid={`heat-${m}`}
            className={`border px-4 py-2 text-[11px] tracking-[.12em] transition-colors ${
              mode === m ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            }`}
          >
            {m === "off" ? "OFF" : m === "density" ? "DENSITY" : "LISTING VALUE"}
          </button>
        ))}
      </div>

      <PropertyMap points={points} heatPoints={heatPoints} heatVisible={mode !== "off"} zoom={12} className={className} />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {mode !== "off" && (
          <div className="flex items-center gap-3 text-[10px] tracking-[.16em] text-white/50" data-testid="heat-legend">
            <span>LOW</span>
            <span className="h-2 w-40 rounded-full" style={{ background: "linear-gradient(90deg, rgba(107,85,39,.6), #B8953E, #D4AF37, #F5E7B0)" }} />
            <span>HIGH</span>
          </div>
        )}
        <p className="text-[10px] tracking-[.14em] text-white/40" data-testid="heat-source-note">
          ILLUSTRATIVE · BASED ON CURRENT PROTOTYPE LISTINGS. VERIFIED MARKET-PRICE HEAT ACTIVATES WHEN A DATED SOURCE IS CONNECTED.
        </p>
      </div>
    </div>
  );
}
