"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { type CommissionRow } from "@/lib/backoffice/types";

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export function CommissionsManager({ propertyOptions }: { propertyOptions: string[] }) {
  const [items, setItems] = useState<CommissionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const seq = useRef(0);

  const load = useCallback(() => {
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    const id = ++seq.current;
    fetch(`/api/backoffice/commissions?${q}`).then((r) => r.json()).then((d) => { if (id === seq.current) { setItems(d.items || []); setTotal(d.total || 0); } });
  }, [from, to]);
  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get("property_label") || !f.get("client_name")) return;
    setSaving(true);
    const res = await fetch("/api/backoffice/commissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
    setSaving(false);
    if (res.ok) { setShow(false); load(); }
  }
  const csvUrl = () => { const q = new URLSearchParams({ format: "csv" }); if (from) q.set("from", from); if (to) q.set("to", to); return `/api/backoffice/commissions?${q}`; };

  return (
    <div data-testid="commissions-manager">
      <div className="mb-5 grid gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))_auto]">
        <div className="rounded-xl border border-[#d4af37]/40 bg-[#11110f] p-5 text-[#f4f0e8] sm:col-span-2">
          <p className="text-xs tracking-[.2em] text-[#d4af37]">TOTAL COMMISSION {from || to ? "(FILTERED)" : ""}</p>
          <p className="mt-2 font-serif text-4xl" data-testid="commission-total">{gbp(total)}</p>
          <p className="mt-1 text-xs opacity-60">{items.length} completed deals</p>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <a href={csvUrl()} data-testid="commission-export" className="rounded-lg bg-[#d4af37] px-5 py-2.5 text-center text-xs font-semibold tracking-[.12em] text-black">EXPORT CSV</a>
          <button onClick={() => setShow((v) => !v)} data-testid="commission-new" className="rounded-lg border border-black/20 bg-white px-5 py-2.5 text-xs font-semibold tracking-[.12em]">+ NEW RECORD</button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
        <label className="text-xs text-neutral-500">From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="commission-from" className="ml-2 rounded border border-black/15 px-2 py-1.5" /></label>
        <label className="text-xs text-neutral-500">To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} data-testid="commission-to" className="ml-2 rounded border border-black/15 px-2 py-1.5" /></label>
        {(from || to) && <button onClick={() => { setFrom(""); setTo(""); }} data-testid="commission-clear" className="rounded border border-black/15 bg-white px-3 py-1.5 text-xs">Clear</button>}
      </div>

      {show && (
        <form onSubmit={create} data-testid="commission-form" className="mb-6 grid gap-3 rounded-xl border border-black/10 bg-white p-5 md:grid-cols-4">
          <input name="property_label" list="comm-props" required placeholder="Property *" data-testid="commission-property" className="rounded border border-black/15 px-3 py-2 text-sm md:col-span-2" />
          <datalist id="comm-props">{propertyOptions.map((p) => <option key={p} value={p} />)}</datalist>
          <input name="client_name" required placeholder="Client *" data-testid="commission-client" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <select name="deal_type" className="rounded border border-black/15 px-3 py-2 text-sm"><option value="sale">Sale</option><option value="rental">Rental</option></select>
          <input name="price" type="number" required placeholder="Price (£)" data-testid="commission-price" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="commission_pct" type="number" step="0.1" required placeholder="Commission %" data-testid="commission-pct" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="agent" placeholder="Agent" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="completed_on" type="date" required data-testid="commission-date" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <button disabled={saving} data-testid="commission-save" className="rounded bg-[#11110f] px-5 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37] md:col-span-4">{saving ? "SAVING…" : "SAVE RECORD"}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[.03] text-left text-[10px] tracking-[.12em] text-neutral-500"><tr><th className="p-3">PROPERTY</th><th className="p-3">CLIENT</th><th className="p-3">TYPE</th><th className="p-3">PRICE</th><th className="p-3">%</th><th className="p-3">COMMISSION</th><th className="p-3">AGENT</th><th className="p-3">COMPLETED</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} data-testid={`commission-row-${c.id}`} className="border-t border-black/5">
                <td className="p-3 font-medium">{c.property_label}</td><td className="p-3">{c.client_name}</td><td className="p-3 capitalize">{c.deal_type}</td>
                <td className="p-3">{gbp(Number(c.price))}</td><td className="p-3">{c.commission_pct}%</td><td className="p-3 font-medium text-[#8a6d1a]">{gbp(Number(c.commission_amount))}</td>
                <td className="p-3 text-xs">{c.agent || "—"}</td><td className="p-3 text-xs text-neutral-500">{new Date(c.completed_on).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-neutral-400">No commission records in this range.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
