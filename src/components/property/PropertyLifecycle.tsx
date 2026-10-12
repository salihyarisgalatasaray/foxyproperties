"use client";
import { useState } from "react";

const STAGES = [
  { key: "buy", label: "BUY", body: "Find and secure the right London property, with the numbers understood upfront.", href: "/properties" },
  { key: "let", label: "LET", body: "Prepare, market and let your property to the right tenant.", href: "/lettings" },
  { key: "manage", label: "MANAGE", body: "Rent collection, maintenance, inspections and clear reporting.", href: "/property-management" },
  { key: "review", label: "REVIEW", body: "Regular review of rent, strategy and finance across your holding.", href: "/landlords" },
  { key: "sell", label: "SELL", body: "When the time is right, a considered, well-managed sale.", href: "/sell" },
];

export function PropertyLifecycle() {
  const [active, setActive] = useState(0);

  return (
    <section
      data-testid="property-lifecycle"
      className="border-y border-white/10 bg-[#0E0E0E]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-32">
        <p className="text-xs tracking-[.3em] text-[#D4AF37]">THE PROPERTY LIFECYCLE</p>
        <h2 className="display mt-5 text-4xl leading-tight md:text-6xl">
          ONE PROPERTY. EVERY STAGE.
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A7A29A]">
          FOXY supports multiple stages of property ownership. Move through each stage — then step
          into the journey that fits where you are.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
          {STAGES.map((s, i) => (
            <a
              key={s.key}
              href={s.href}
              data-testid={`lifecycle-stage-${s.key}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`group relative flex flex-col justify-between bg-[#0B0B0A] p-6 transition-colors duration-300 ${
                active === i ? "bg-[#141413]" : "hover:bg-[#141413]"
              }`}
            >
              <span
                className={`display text-2xl transition-colors ${
                  active === i ? "text-[#D4AF37]" : "text-white/40 group-hover:text-[#D4AF37]"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-8 text-sm font-semibold tracking-[.14em] text-white">
                {s.label}
              </span>
              <span
                className={`mt-1 h-0.5 bg-[#D4AF37] transition-all duration-300 ${
                  active === i ? "w-10" : "w-0 group-hover:w-10"
                }`}
              />
            </a>
          ))}
        </div>

        <div
          data-testid="lifecycle-detail"
          className="mt-8 flex flex-col justify-between gap-6 border border-[#D4AF37]/25 bg-[#141413] p-8 md:flex-row md:items-center"
        >
          <div>
            <p className="text-xs tracking-[.24em] text-[#D4AF37]">
              {STAGES[active].label}
            </p>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#C9C4BB]">
              {STAGES[active].body}
            </p>
          </div>
          <a
            href={STAGES[active].href}
            data-testid="lifecycle-detail-cta"
            className="shrink-0 bg-[#D4AF37] px-7 py-4 text-xs font-semibold tracking-[.16em] text-black transition-transform hover:-translate-y-0.5"
          >
            ENTER THE {STAGES[active].label} JOURNEY →
          </a>
        </div>
      </div>
    </section>
  );
}
