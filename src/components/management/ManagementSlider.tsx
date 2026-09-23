"use client";
import { useState } from "react";

const LEVELS = [
  {
    name: "LET ONLY",
    blurb: "You retain day-to-day management. FOXY finds and sets up the tenancy.",
    covered: ["Property marketing", "Enquiry handling", "Viewing coordination", "Referencing", "Tenancy setup"],
  },
  {
    name: "RENT COLLECTION",
    blurb: "FOXY handles tenant find plus ongoing rent collection and arrears monitoring.",
    covered: [
      "Property marketing",
      "Enquiry handling",
      "Viewing coordination",
      "Referencing",
      "Tenancy setup",
      "Rent collection",
      "Arrears monitoring",
      "Landlord reporting",
    ],
  },
  {
    name: "FULLY MANAGED",
    blurb: "FOXY manages the tenancy end-to-end, coordinating maintenance and inspections.",
    covered: [
      "Property marketing",
      "Enquiry handling",
      "Viewing coordination",
      "Referencing",
      "Tenancy setup",
      "Rent collection",
      "Arrears monitoring",
      "Maintenance coordination",
      "Inspection coordination",
      "Ongoing management",
      "Landlord reporting",
    ],
  },
];

const ALL = [
  "Property marketing",
  "Enquiry handling",
  "Viewing coordination",
  "Referencing",
  "Tenancy setup",
  "Rent collection",
  "Arrears monitoring",
  "Maintenance coordination",
  "Inspection coordination",
  "Ongoing management",
  "Landlord reporting",
];

export function ManagementSlider() {
  const [lvl, setLvl] = useState(2);
  const level = LEVELS[lvl];

  return (
    <section
      id="options"
      data-testid="management-slider"
      className="border-y border-white/10 bg-[#0E0E0E]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-32">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">MANAGEMENT COMPARISON</p>
        <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
          HOW MUCH WOULD YOU LIKE TO MANAGE?
        </h2>

        <div className="mt-12 flex items-center justify-between text-[11px] tracking-[.14em] text-white/50">
          <span>YOU MANAGE</span>
          <span>FOXY MANAGES</span>
        </div>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={lvl}
          onChange={(e) => setLvl(Number(e.target.value))}
          data-testid="management-range"
          className="mt-3 w-full accent-[#D4AF37]"
        />
        <div className="mt-4 grid grid-cols-3 text-center text-[11px] tracking-[.12em]">
          {LEVELS.map((l, i) => (
            <button
              key={l.name}
              onClick={() => setLvl(i)}
              data-testid={`management-level-${i}`}
              className={i === lvl ? "text-[#D4AF37]" : "text-white/40"}
            >
              {l.name}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="border border-[#D4AF37]/30 bg-[#141413] p-8">
            <p className="display text-2xl text-[#D4AF37]" data-testid="management-level-name">
              {level.name}
            </p>
            <p className="mt-4 text-sm leading-7 text-[#A7A29A]">{level.blurb}</p>
            <a
              href="/landlords#valuation"
              className="mt-8 inline-block bg-[#D4AF37] px-6 py-4 text-xs font-semibold tracking-[.14em] text-black"
            >
              BUILD MY MANAGEMENT PLAN →
            </a>
          </div>
          <ul className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
            {ALL.map((item) => {
              const on = level.covered.includes(item);
              return (
                <li
                  key={item}
                  className={`flex items-center gap-3 bg-[#0E0E0E] px-5 py-4 text-sm ${
                    on ? "text-white" : "text-white/30"
                  }`}
                >
                  <span className={on ? "text-[#D4AF37]" : "text-white/20"}>{on ? "✓" : "—"}</span>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-6 text-white/40">
          Service scope is illustrative and configurable. Specific responsibilities, legal
          obligations and fees are confirmed in your management agreement and are not implied here.
        </p>
      </div>
    </section>
  );
}
