"use client";
import { useEffect, useMemo, useState } from "react";
import { offerStatuses, type OfferRow } from "@/lib/backoffice/types";

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const BADGE: Record<string, string> = { PENDING: "bg-amber-100 text-amber-800", ACCEPTED: "bg-emerald-100 text-emerald-800", REJECTED: "bg-rose-100 text-rose-700", NEGOTIATING: "bg-sky-100 text-sky-800" };

export function OffersManager({ propertyOptions }: { propertyOptions: string[] }) {
  const [items, setItems] = useState<OfferRow[]>([]);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/backoffice/offers").then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  const groups = useMemo(() => {
    const m: Record<string, OfferRow[]> = {};
    for (const o of items) (m[o.property_label || "—"] ||= []).push(o);
    return Object.entries(m);
  }, [items]);

  async function patch(id: string, body: Record<string, unknown>) {
    setItems((xs) => xs.map((o) => (o.id === id ? { ...o, ...body } as OfferRow : o)));
    await fetch(`/api/backoffice/offers/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get("property_label") || !f.get("client_name")) return;
    setSaving(true);
    const res = await fetch("/api/backoffice/offers", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
    setSaving(false);
    if (res.ok) { setShow(false); load(); }
  }

  return (
    <div data-testid="offers-manager">
      <div className="mb-5 flex items-center gap-3">
        <span data-testid="offers-count" className="text-xs text-neutral-500">{items.length} offers across {groups.length} properties</span>
        <button onClick={() => setShow((v) => !v)} data-testid="offer-new" className="ml-auto rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold tracking-[.12em] text-black">+ NEW OFFER</button>
      </div>

      {show && (
        <form onSubmit={create} data-testid="offer-form" className="mb-6 grid gap-3 rounded-xl border border-black/10 bg-white p-5 md:grid-cols-4">
          <input name="property_label" list="offer-props" required placeholder="Property *" data-testid="offer-property" className="rounded border border-black/15 px-3 py-2 text-sm md:col-span-2" />
          <datalist id="offer-props">{propertyOptions.map((p) => <option key={p} value={p} />)}</datalist>
          <input name="client_name" required placeholder="Client *" data-testid="offer-client" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="amount" type="number" required placeholder="Offer amount (£)" data-testid="offer-amount" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="counter_notes" placeholder="Counter-offer notes" className="rounded border border-black/15 px-3 py-2 text-sm md:col-span-4" />
          <button disabled={saving} data-testid="offer-save" className="rounded bg-[#11110f] px-5 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37] md:col-span-4">{saving ? "SAVING…" : "ADD OFFER"}</button>
        </form>
      )}

      <div className="space-y-5">
        {groups.map(([prop, offers]) => (
          <div key={prop} data-testid={`offer-group-${prop}`} className="rounded-xl border border-black/10 bg-white p-5">
            <h3 className="font-serif text-xl">{prop}</h3>
            <div className="mt-3 space-y-2">
              {offers.map((o) => (
                <div key={o.id} data-testid={`offer-row-${o.id}`} className="grid items-center gap-3 border-t border-black/5 py-3 md:grid-cols-[1fr_auto_auto_auto]">
                  <div><span className="font-medium">{o.client_name}</span> · <span className="text-[#8a6d1a]">{gbp(Number(o.amount))}</span><div className="text-xs text-neutral-400">{new Date(o.submitted_at).toLocaleDateString("en-GB")}</div></div>
                  <span className={`rounded-full px-3 py-1 text-[10px] tracking-[.1em] ${BADGE[o.status]}`}>{o.status}</span>
                  <select value={o.status} onChange={(e) => patch(o.id, { status: e.target.value })} data-testid={`offer-status-${o.id}`} className="rounded border border-black/15 px-2 py-1 text-xs">{offerStatuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                  <input defaultValue={o.counter_notes || ""} onBlur={(e) => e.target.value !== (o.counter_notes || "") && patch(o.id, { counter_notes: e.target.value })} placeholder="Counter notes…" data-testid={`offer-counter-${o.id}`} className="rounded border border-black/15 px-2 py-1 text-xs" />
                </div>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && <p className="rounded-xl border border-black/10 bg-white p-8 text-center text-neutral-400">No offers recorded yet.</p>}
      </div>
    </div>
  );
}
