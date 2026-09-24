"use client";
import { useEffect, useState } from "react";
import { clientStatuses, type ClientRow } from "@/lib/backoffice/types";

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const DOT: Record<string, string> = { HOT: "bg-rose-500", WARM: "bg-amber-500", COLD: "bg-sky-500" };

export function ClientsManager() {
  const [items, setItems] = useState<ClientRow[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/backoffice/clients").then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    setItems((xs) => xs.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch(`/api/backoffice/clients/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get("full_name")) return;
    setSaving(true);
    const res = await fetch("/api/backoffice/clients", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
    setSaving(false);
    if (res.ok) { setShow(false); load(); }
  }
  const rows = filter === "ALL" ? items : items.filter((c) => c.status === filter);

  return (
    <div data-testid="clients-manager">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["ALL", ...clientStatuses].map((s) => <button key={s} onClick={() => setFilter(s)} data-testid={`client-filter-${s.toLowerCase()}`} className={`rounded-full border px-4 py-1.5 text-xs tracking-[.1em] ${filter === s ? "border-[#d4af37] bg-[#d4af37] text-black" : "border-black/15 bg-white text-neutral-600"}`}>{s}</button>)}
        <span data-testid="clients-count" className="text-xs text-neutral-500">{rows.length} clients</span>
        <button onClick={() => setShow((v) => !v)} data-testid="client-new" className="ml-auto rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold tracking-[.12em] text-black">+ NEW CLIENT</button>
      </div>

      {show && (
        <form onSubmit={create} data-testid="client-form" className="mb-6 grid gap-3 rounded-xl border border-black/10 bg-white p-5 md:grid-cols-3">
          <input name="full_name" required placeholder="Full name *" data-testid="client-name" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="phone" placeholder="Phone" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="email" type="email" placeholder="Email" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="budget" type="number" placeholder="Budget (£)" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="preferred_areas" placeholder="Preferred areas" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <select name="interest" className="rounded border border-black/15 px-3 py-2 text-sm"><option value="buy">Buy</option><option value="rent">Rent</option></select>
          <select name="status" data-testid="client-status-select" className="rounded border border-black/15 px-3 py-2 text-sm">{clientStatuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <input name="last_contact_at" type="date" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="notes" placeholder="Notes" className="rounded border border-black/15 px-3 py-2 text-sm md:col-span-3" />
          <button disabled={saving} data-testid="client-save" className="rounded bg-[#11110f] px-5 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37] md:col-span-3">{saving ? "SAVING…" : "SAVE CLIENT"}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[.03] text-left text-[10px] tracking-[.12em] text-neutral-500"><tr><th className="p-3">NAME</th><th className="p-3">CONTACT</th><th className="p-3">BUDGET</th><th className="p-3">AREAS</th><th className="p-3">INTEREST</th><th className="p-3">STATUS</th><th className="p-3">LAST CONTACT</th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} data-testid={`client-row-${c.id}`} className="border-t border-black/5">
                <td className="p-3 font-medium">{c.full_name}{c.notes && <div className="text-xs font-normal text-neutral-400">{c.notes}</div>}</td>
                <td className="p-3 text-xs text-neutral-600">{c.phone || "—"}<br />{c.email || ""}</td>
                <td className="p-3">{c.budget ? gbp(Number(c.budget)) : "—"}</td>
                <td className="p-3 text-xs">{c.preferred_areas || "—"}</td>
                <td className="p-3 capitalize">{c.interest}</td>
                <td className="p-3"><span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${DOT[c.status]}`} /><select value={c.status} onChange={(e) => setStatus(c.id, e.target.value)} data-testid={`client-status-${c.id}`} className="rounded border border-black/10 px-1 py-0.5 text-xs">{clientStatuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></span></td>
                <td className="p-3 text-xs text-neutral-500">{c.last_contact_at ? new Date(c.last_contact_at).toLocaleDateString("en-GB") : "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-neutral-400">No clients yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
