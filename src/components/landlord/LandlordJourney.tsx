"use client";
import { useState } from "react";
import { useT } from "@/components/i18n/language";
import { LeadForm } from "../lead/LeadForm";

const NEEDS = [
  { id: "FIND_TENANT", label: "FIND ME A TENANT", source: "LANDLORD_FIND_TENANT" },
  { id: "COLLECT_RENT", label: "COLLECT MY RENT", source: "LANDLORD_RENT_COLLECTION" },
  { id: "MANAGE", label: "MANAGE MY PROPERTY", source: "LANDLORD_FULLY_MANAGED" },
  { id: "HAVE_TENANT", label: "I ALREADY HAVE A TENANT", source: "LANDLORD_EXISTING_TENANT" },
  { id: "MULTIPLE", label: "I HAVE MULTIPLE PROPERTIES", source: "LANDLORD_PORTFOLIO" },
  { id: "SWITCH", label: "I WANT TO SWITCH AGENT", source: "LANDLORD_SWITCH" },
  { id: "CERTAINTY", label: "EXPLORE RENT-PROTECTION / INCOME-CERTAINTY OPTIONS", source: "LANDLORD_CERTAINTY" },
];

export function LandlordJourney() {
  const t = useT();
  const [need, setNeed] = useState<(typeof NEEDS)[number] | null>(null);

  return (
    <section
      id="valuation"
      data-testid="landlord-journey"
      className="mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-32"
    >
      <p className="text-xs tracking-[.3em] text-[#D4AF37]">{t("INTERACTIVE LANDLORD JOURNEY")}</p>
      <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">
        {t("WHAT WOULD YOU LIKE US TO HELP WITH?")}
      </h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A7A29A]">
        {t("Choose where you are in your journey. We will tailor the information we request. We do not automatically claim one service is “best”, and we do not quote fees before understanding your property.")}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {NEEDS.map((n) => (
          <button
            key={n.id}
            onClick={() => setNeed(n)}
            data-testid={`landlord-need-${n.id.toLowerCase()}`}
            className={`border px-5 py-3 text-[11px] tracking-[.12em] transition-colors ${
              need?.id === n.id
                ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                : "border-white/15 text-white/75 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            }`}
          >
            {t(n.label)}
          </button>
        ))}
      </div>

      {need && (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs tracking-[.2em] text-[#D4AF37]">{t("SELECTED")}</p>
            <p className="display mt-3 text-2xl">{t(need.label)}</p>
            <ol className="mt-8 space-y-4 text-sm text-[#A7A29A]">
              {["Property", "Location", "Current status", "Rent", "Management needs", "Enquiry"].map(
                (s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="display text-[#D4AF37]/60">{String(i + 1).padStart(2, "0")}</span>
                    {t(s)}
                  </li>
                )
              )}
            </ol>
            <p className="mt-8 max-w-md text-xs leading-6 text-white/40">
              {t("We collect these details for human review. We do not generate an automated valuation or fee, and existing contracts or tenancies may need review before any switch.")}
            </p>
          </div>
          <LeadForm
            type="LANDLORD"
            source={need.source}
            title="TELL US ABOUT YOUR PROPERTY"
            submitLabel="REQUEST A MANAGEMENT REVIEW"
            testid="landlord-lead-form"
            extraFields={[
              { name: "postcode", label: "Postcode", required: true },
              { name: "ptype", label: "Property type" },
              { name: "beds", label: "Bedrooms" },
              { name: "status", label: "Current status (empty / tenanted)" },
              { name: "rent", label: "Current or expected monthly rent (£)" },
            ]}
          />
        </div>
      )}
    </section>
  );
}
