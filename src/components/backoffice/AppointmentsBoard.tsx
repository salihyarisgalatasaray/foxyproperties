"use client";
import { useEffect, useMemo, useState } from "react";
import { appointmentStatuses, type AppointmentRow } from "@/lib/backoffice/types";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  COMPLETED: "bg-sky-100 text-sky-800 border-sky-300",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-300 line-through",
};
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const time = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function AppointmentsBoard({ propertyOptions }: { propertyOptions: string[] }) {
  const [items, setItems] = useState<AppointmentRow[]>([]);
  const [view, setView] = useState<"month" | "week">("month");
  const [anchor, setAnchor] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/backoffice/appointments").then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  const byDay = useMemo(() => {
    const m: Record<string, AppointmentRow[]> = {};
    for (const a of items) (m[a.starts_at.slice(0, 10)] ||= []).push(a);
    return m;
  }, [items]);

  const days = useMemo(() => {
    if (view === "week") {
      const start = new Date(anchor); start.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7));
      return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
    }
    const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [view, anchor]);

  const move = (dir: number) => { const d = new Date(anchor); view === "week" ? d.setDate(d.getDate() + dir * 7) : d.setMonth(d.getMonth() + dir); setAnchor(d); };

  async function setStatus(id: string, status: string) {
    setItems((xs) => xs.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch(`/api/backoffice/appointments/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
  }

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const date = f.get("date") as string, t = (f.get("time") as string) || "09:00";
    if (!f.get("client_name") || !date) return;
    setSaving(true);
    const res = await fetch("/api/backoffice/appointments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ client_name: f.get("client_name"), phone: f.get("phone"), email: f.get("email"), property_label: f.get("property_label"), starts_at: new Date(`${date}T${t}`).toISOString(), agent: f.get("agent"), notes: f.get("notes") }) });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
  }

  const monthLabel = anchor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div data-testid="appointments-board">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-lg border border-black/15">
          {(["month", "week"] as const).map((v) => <button key={v} onClick={() => setView(v)} data-testid={`appt-view-${v}`} className={`px-4 py-2 text-xs tracking-[.12em] ${view === v ? "bg-[#11110f] text-[#d4af37]" : "bg-white text-neutral-600"}`}>{v.toUpperCase()}</button>)}
        </div>
        <button onClick={() => move(-1)} data-testid="appt-prev" className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm">←</button>
        <span className="min-w-[160px] text-center font-medium" data-testid="appt-label">{monthLabel}</span>
        <button onClick={() => move(1)} data-testid="appt-next" className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm">→</button>
        <button onClick={() => setShowForm((s) => !s)} data-testid="appt-new" className="ml-auto rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold tracking-[.12em] text-black">+ NEW APPOINTMENT</button>
      </div>

      {showForm && (
        <form onSubmit={create} data-testid="appt-form" className="mb-6 grid gap-3 rounded-xl border border-black/10 bg-white p-5 md:grid-cols-3">
          <input name="client_name" required placeholder="Client name *" data-testid="appt-client" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="phone" placeholder="Phone" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="email" type="email" placeholder="Email" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="property_label" list="prop-opts" placeholder="Property" data-testid="appt-property" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <datalist id="prop-opts">{propertyOptions.map((p) => <option key={p} value={p} />)}</datalist>
          <input name="date" type="date" required data-testid="appt-date" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="time" type="time" defaultValue="10:00" data-testid="appt-time" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="agent" placeholder="Agent assigned" className="rounded border border-black/15 px-3 py-2 text-sm" />
          <input name="notes" placeholder="Notes" className="rounded border border-black/15 px-3 py-2 text-sm md:col-span-2" />
          <button disabled={saving} data-testid="appt-save" className="rounded bg-[#11110f] px-5 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37] md:col-span-3">{saving ? "SAVING…" : "SAVE APPOINTMENT"}</button>
        </form>
      )}

      <div className={`grid ${view === "week" ? "grid-cols-1 md:grid-cols-7" : "grid-cols-7"} gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10`}>
        {view === "month" && ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="bg-[#11110f] p-2 text-center text-[10px] tracking-[.12em] text-[#d4af37]">{d}</div>)}
        {days.map((d) => {
          const key = ymd(d);
          const list = byDay[key] || [];
          const inMonth = view === "week" || d.getMonth() === anchor.getMonth();
          const isToday = key === ymd(new Date());
          return (
            <div key={key} data-testid={`appt-day-${key}`} className={`min-h-[104px] bg-white p-2 ${inMonth ? "" : "opacity-40"}`}>
              <div className={`mb-1 text-xs ${isToday ? "font-bold text-[#8a6d1a]" : "text-neutral-500"}`}>{view === "week" ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" }) : d.getDate()}</div>
              <div className="space-y-1">
                {list.map((a) => (
                  <div key={a.id} data-testid={`appt-item-${a.id}`} className={`rounded border px-1.5 py-1 text-[10px] ${STATUS_COLOR[a.status] || ""}`}>
                    <div className="font-medium">{time(a.starts_at)} · {a.client_name}</div>
                    {a.property_label && <div className="truncate opacity-70">{a.property_label}</div>}
                    <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)} data-testid={`appt-status-${a.id}`} className="mt-1 w-full rounded bg-white/70 text-[9px]">
                      {appointmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
