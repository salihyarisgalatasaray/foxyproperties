"use client";
import { useMemo, useState } from "react";

const money = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const SERVICES = [
  { key: "let-only", label: "Let only", fee: 6 },
  { key: "rent-collection", label: "Rent collection", fee: 9 },
  { key: "fully-managed", label: "Fully managed", fee: 12 },
] as const;

type Result = {
  grossAnnual: number;
  managementFee: number;
  voidCost: number;
  maintenance: number;
  totalCosts: number;
  netAnnual: number;
  netMonthly: number;
  retained: number;
};

export function LandlordRevenueSimulator() {
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [rent, setRent] = useState(3000);
  const [service, setService] = useState<(typeof SERVICES)[number]["key"]>("fully-managed");
  const [voidWeeks, setVoidWeeks] = useState(2);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [fixedCosts, setFixedCosts] = useState(1200);

  const compute = useMemo(() => {
    return (feePct: number): Result => {
      const grossAnnual = rent * 12;
      const managementFee = grossAnnual * (feePct / 100);
      const voidCost = (rent / 4.333) * voidWeeks;
      const maintenance = grossAnnual * (maintenancePct / 100);
      const totalCosts = managementFee + voidCost + maintenance + fixedCosts;
      const netAnnual = grossAnnual - totalCosts;
      const netMonthly = netAnnual / 12;
      const retained = grossAnnual ? (netAnnual / grossAnnual) * 100 : 0;
      return { grossAnnual, managementFee, voidCost, maintenance, totalCosts, netAnnual, netMonthly, retained };
    };
  }, [rent, voidWeeks, maintenancePct, fixedCosts]);

  const fee = SERVICES.find((s) => s.key === service)!.fee;
  const r = compute(fee);

  const letOnly = compute(6);
  const managed = compute(12);
  const netDiff = letOnly.netAnnual - managed.netAnnual; // extra kept with let-only (before service value)

  return (
    <div data-testid="revenue-simulator" className="overflow-hidden border border-white/10 bg-[#141413]">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4 md:px-9">
        <span className="mr-2 text-[10px] tracking-[.2em] text-white/40">VIEW</span>
        {(["single", "compare"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            data-testid={`sim-mode-${m}`}
            className={`border px-4 py-2 text-[11px] tracking-[.12em] transition-colors ${
              mode === m ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            }`}
          >
            {m === "single" ? "SINGLE" : "COMPARE SERVICES"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Inputs */}
        <div className="p-6 md:p-9">
          <p className="text-xs tracking-[.2em] text-[#D4AF37]">YOUR PROPERTY</p>

          <div className="mt-7 grid gap-7">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-white/70">Expected monthly rent</label>
                <span className="display text-xl text-white">{money(rent)}</span>
              </div>
              <input type="range" min={800} max={15000} step={50} value={rent} onChange={(e) => setRent(Number(e.target.value))} data-testid="sim-rent" className="mt-3 w-full accent-[#D4AF37]" />
            </div>

            {mode === "single" && (
              <div>
                <label className="text-sm text-white/70">FOXY service</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setService(s.key)}
                      data-testid={`sim-service-${s.key}`}
                      className={`border px-4 py-2.5 text-[11px] tracking-[.1em] transition-colors ${
                        service === s.key ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      }`}
                    >
                      {s.label} · {s.fee}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-white/70">Void allowance</label>
                <span className="text-white">{voidWeeks} wk / yr</span>
              </div>
              <input type="range" min={0} max={8} step={1} value={voidWeeks} onChange={(e) => setVoidWeeks(Number(e.target.value))} data-testid="sim-void" className="mt-3 w-full accent-[#D4AF37]" />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-white/70">Maintenance reserve</label>
                <span className="text-white">{maintenancePct}% of rent</span>
              </div>
              <input type="range" min={0} max={20} step={1} value={maintenancePct} onChange={(e) => setMaintenancePct(Number(e.target.value))} data-testid="sim-maintenance" className="mt-3 w-full accent-[#D4AF37]" />
            </div>

            <label className="text-sm text-white/70">
              Annual fixed costs (insurance, compliance, certificates)
              <input type="number" min={0} step={100} value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} data-testid="sim-fixed" className="mt-2 w-full border border-white/15 bg-[#0B0B0A] px-4 py-3 text-white outline-none focus:border-[#D4AF37]" />
            </label>
          </div>
        </div>

        {/* Results */}
        {mode === "single" ? (
          <div className="bg-[#F4F0E8] p-6 text-[#0B0B0A] md:p-9">
            <p className="text-xs tracking-[.2em]">ILLUSTRATIVE NET INCOME</p>
            <div className="mt-6 border-b border-black/10 pb-6">
              <p className="text-xs uppercase tracking-[.14em] opacity-55">Estimated net income / month</p>
              <p className="display mt-1 text-5xl" data-testid="sim-net-monthly">{money(r.netMonthly)}</p>
              <p className="mt-2 text-sm opacity-60">{money(r.netAnnual)} per year · you keep ~{r.retained.toFixed(0)}% of gross rent</p>
            </div>
            <div className="mt-6 grid gap-4">
              <Row label="Gross annual rent" value={money(r.grossAnnual)} />
              <Row label={`Management fee (${fee}%)`} value={`− ${money(r.managementFee)}`} />
              <Row label={`Void allowance (${voidWeeks} wk)`} value={`− ${money(r.voidCost)}`} />
              <Row label={`Maintenance reserve (${maintenancePct}%)`} value={`− ${money(r.maintenance)}`} />
              <Row label="Fixed costs" value={`− ${money(fixedCosts)}`} />
              <div className="flex items-center justify-between border-t border-black/15 pt-4">
                <span className="text-sm font-semibold uppercase tracking-[.12em]">Estimated net / year</span>
                <span className="display text-2xl" data-testid="sim-net-annual">{money(r.netAnnual)}</span>
              </div>
            </div>
            <a href="/landlords/rental-valuation" data-testid="sim-cta" className="mt-8 block bg-[#0B0B0A] px-6 py-4 text-center text-xs font-semibold tracking-[.14em] text-[#D4AF37] transition-colors hover:bg-black">
              GET A PERSONALISED VALUATION →
            </a>
            <p className="mt-5 text-xs leading-5 opacity-60">
              Illustrative simulation only. Fee percentages are examples, not a quotation. Actual rent, fees, voids,
              maintenance, tax treatment and costs vary and are confirmed on assessment. This is not financial advice
              or a guarantee of income.
            </p>
          </div>
        ) : (
          <div className="bg-[#F4F0E8] p-6 text-[#0B0B0A] md:p-9" data-testid="sim-compare">
            <p className="text-xs tracking-[.2em]">LET ONLY vs FULLY MANAGED</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <CompareCard title="Let only" fee={6} r={letOnly} testid="sim-compare-letonly" />
              <CompareCard title="Fully managed" fee={12} r={managed} highlight testid="sim-compare-managed" />
            </div>

            <div className="mt-6 grid gap-3 border-t border-black/15 pt-6 text-sm">
              <Row label="Extra management fee (managed)" value={`− ${money(managed.managementFee - letOnly.managementFee)}`} />
              <Row label="Difference in net income / year" value={money(Math.abs(netDiff))} />
              <div className="mt-1 rounded bg-black/[.04] p-4 text-xs leading-5 opacity-70" data-testid="sim-compare-diff">
                Choosing <strong>fully managed</strong> keeps about {money(Math.abs(netDiff))} less per year in your
                pocket versus let only, in exchange for FOXY handling rent collection, maintenance, inspections,
                compliance and tenant management on your behalf. Let only leaves day-to-day management to you.
              </div>
            </div>

            <a href="/landlords/rental-valuation" data-testid="sim-cta" className="mt-8 block bg-[#0B0B0A] px-6 py-4 text-center text-xs font-semibold tracking-[.14em] text-[#D4AF37] transition-colors hover:bg-black">
              DISCUSS THE RIGHT SERVICE →
            </a>
            <p className="mt-5 text-xs leading-5 opacity-60">
              Illustrative comparison only. Fee percentages are examples, not a quotation. Service scope, actual fees,
              voids, maintenance and costs vary and are confirmed on assessment. Not financial advice or a guarantee of income.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CompareCard({ title, fee, r, highlight, testid }: { title: string; fee: number; r: Result; highlight?: boolean; testid: string }) {
  return (
    <div data-testid={testid} className={`rounded-lg p-5 ${highlight ? "bg-[#0B0B0A] text-[#F4F0E8]" : "border border-black/10 bg-white"}`}>
      <p className={`text-[10px] uppercase tracking-[.16em] ${highlight ? "text-[#D4AF37]" : "opacity-55"}`}>{title}</p>
      <p className={`text-[10px] ${highlight ? "text-white/50" : "opacity-45"}`}>{fee}% fee</p>
      <p className="display mt-3 text-3xl">{money(r.netMonthly)}</p>
      <p className={`text-xs ${highlight ? "text-white/60" : "opacity-55"}`}>net / month</p>
      <div className={`mt-4 space-y-2 border-t pt-3 text-xs ${highlight ? "border-white/15" : "border-black/10"}`}>
        <div className="flex justify-between"><span className={highlight ? "text-white/55" : "opacity-55"}>Net / year</span><span>{money(r.netAnnual)}</span></div>
        <div className="flex justify-between"><span className={highlight ? "text-white/55" : "opacity-55"}>Mgmt fee</span><span>− {money(r.managementFee)}</span></div>
        <div className="flex justify-between"><span className={highlight ? "text-white/55" : "opacity-55"}>You keep</span><span>~{r.retained.toFixed(0)}%</span></div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="opacity-60">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
