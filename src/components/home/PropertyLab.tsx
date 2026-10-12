"use client";
import { useState } from "react";
import { useT } from "@/components/i18n/language";

type Strat = { title: string; cta: string; ctaHref: string; rows: [string, string, boolean?][] };

const STRATS: Record<string, Strat> = {
  SELL: { title: "SELLING SCENARIO", cta: "ANALYSE THIS PROPERTY", ctaHref: "/sell",
    rows: [["Estimated Value", "£1,850,000"], ["Marketing Window", "6–8 weeks"], ["Est. Selling Costs", "£28,000"], ["Est. Net Proceeds", "£1,822,000"]] },
  LET: { title: "LETTING SCENARIO", cta: "ANALYSE THIS PROPERTY", ctaHref: "/lettings",
    rows: [["Est. Monthly Rent", "£4,750"], ["Est. Annual Rent", "£57,000"], ["Service", "Fully Managed"], ["Est. Net Income", "£48,400"]] },
  BTL: { title: "BUY-TO-LET SCENARIO", cta: "ANALYSE THIS PROPERTY", ctaHref: "/calculators/buy-to-let",
    rows: [["Purchase Price", "£1,850,000"], ["Deposit (25%)", "£462,500"], ["Est. Monthly Rent", "£4,750"], ["Est. Gross Yield", "3.1%", true]] },
  MANAGE: { title: "MANAGEMENT SCENARIO", cta: "ANALYSE THIS PROPERTY", ctaHref: "/property-management",
    rows: [["Monthly Rent", "£4,750"], ["Maintenance Reserve", "£300 pcm"], ["Inspections", "Quarterly"], ["Reporting", "Monthly"]] },
};

const KEYS = ["SELL", "LET", "BTL", "MANAGE"];

export function PropertyLab() {
  const t = useT();
  const [key, setKey] = useState("SELL");
  const s = STRATS[key];

  return (
    <section id="lab" data-testid="home-lab" className="diag-top relative -mt-[4vw] overflow-hidden border-t border-white/5 bg-[#121210]">
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-36">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr_0.9fr] lg:items-center">
          {/* Left: intro + strategy tabs */}
          <div>
            <p className="display text-2xl text-[#D4AF37]/70">06</p>
            <p className="mt-3 text-[11px] tracking-[.4em] text-[#D4AF37]">{t("FOXY PROPERTIES LAB")}</p>
            <h2 className="display mt-5 text-4xl leading-[1.05] md:text-5xl">{t("ONE PROPERTY.")}<br />{t("MULTIPLE POSSIBILITIES.")}</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[#A7A29A]">
              {t("Compare strategies, explore potential and make informed decisions.")}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {KEYS.map((k) => (
                <button key={k} onClick={() => setKey(k)} data-testid={`lab-tab-${k.toLowerCase()}`}
                  className={`border px-4 py-2.5 text-[11px] tracking-[.12em] transition-colors ${key === k ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/15 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37]"}`}>
                  {t(k)}
                </button>
              ))}
            </div>
            <a href="/investment#simulator" data-testid="lab-open" className="group mt-8 inline-flex items-center gap-2 text-xs tracking-[.16em] text-[#D4AF37] transition-colors hover:text-white">
              {t("OPEN PROPERTY LAB")} <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Centre: architectural cutaway */}
          <div className="relative">
            <img src="/home/lab_house.jpg" alt="Architectural cutaway of a London townhouse — concept" className="mx-auto w-full max-w-xl object-contain" />
            <span className="absolute left-3 top-3 border border-white/20 bg-black/50 px-2 py-1 text-[8px] tracking-[.2em] text-white/60">{t("CONCEPT · ILLUSTRATIVE")}</span>
          </div>

          {/* Right: analysis panel */}
          <div data-testid="lab-panel" className="border border-white/12 bg-[#0B0B0A]/80 p-7">
            <div className="flex items-baseline justify-between">
              <p className="text-xs tracking-[.2em] text-white">{t(s.title)}</p>
              <span className="text-[9px] tracking-[.16em] text-[#D4AF37]">{t("ILLUSTRATIVE")}</span>
            </div>
            <div className="mt-5 divide-y divide-white/10">
              {s.rows.map(([label, val, gold]) => (
                <div key={label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-white/55">{t(label)}</span>
                  <span className={gold ? "font-semibold text-[#D4AF37]" : "text-white"}>{val}</span>
                </div>
              ))}
            </div>
            <a href={s.ctaHref} data-testid="lab-cta" className="mt-6 block bg-[#D4AF37] px-6 py-4 text-center text-xs font-semibold tracking-[.14em] text-black transition-colors hover:bg-[#e6c84f]">
              {t(s.cta)} →
            </a>
            <p className="mt-4 text-[10px] leading-5 text-white/40">
              {t("Licensing and planning checks required. Figures are illustrative only and are not a forecast, valuation or offer.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
