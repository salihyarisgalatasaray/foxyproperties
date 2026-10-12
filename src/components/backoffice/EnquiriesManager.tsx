"use client";
import { Fragment, useEffect, useState } from "react";
import { enquiryStatuses, enquiryTypes, type EnquiryRow } from "@/lib/backoffice/types";
import { ENQUIRIES_CHANGED } from "./CountBadge";
import { EnquiryNotes } from "./EnquiryNotes";

const PILL: Record<string, string> = { NEW: "bg-[#d4af37] text-black", READ: "bg-neutral-200 text-neutral-700", IN_PROGRESS: "bg-sky-100 text-sky-800", RESOLVED: "bg-emerald-100 text-emerald-800" };
const fmt = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function EnquiriesManager() {
  const [items, setItems] = useState<EnquiryRow[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState<string | null>(null);
  const [notesFor, setNotesFor] = useState<string | null>(null);
  useEffect(() => { fetch("/api/backoffice/enquiries").then((r) => r.json()).then((d) => setItems(d.items || [])); }, []);

  async function setStatus(id: string, status: string) {
    setItems((xs) => xs.map((e) => (e.id === id ? { ...e, status: status as EnquiryRow["status"] } : e)));
    await fetch(`/api/backoffice/enquiries/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    window.dispatchEvent(new Event(ENQUIRIES_CHANGED));
  }
  const rows = filter === "ALL" ? items : items.filter((e) => e.status === filter);
  const unread = items.filter((e) => e.status === "NEW").length;

  return (
    <div data-testid="enquiries-manager">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["ALL", ...Object.keys(enquiryStatuses)].map((s) => (
          <button key={s} onClick={() => setFilter(s)} data-testid={`enquiry-filter-${s.toLowerCase()}`} className={`rounded-full border px-4 py-1.5 text-xs tracking-[.1em] ${filter === s ? "border-[#d4af37] bg-[#d4af37] text-black" : "border-black/15 bg-white text-neutral-600"}`}>
            {s === "ALL" ? "ALL" : enquiryStatuses[s as keyof typeof enquiryStatuses].toUpperCase()}
          </button>
        ))}
        <span data-testid="enquiries-count" className="ml-auto text-xs text-neutral-500">{rows.length} enquiries · {unread} unread</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[.03] text-left text-[10px] tracking-[.12em] text-neutral-500"><tr><th className="p-3">DATE</th><th className="p-3">NAME</th><th className="p-3">EMAIL</th><th className="p-3">PHONE</th><th className="p-3">TYPE</th><th className="p-3">MESSAGE</th><th className="p-3">STATUS</th><th className="p-3">NOTES</th></tr></thead>
          <tbody>
            {rows.map((e) => (<Fragment key={e.id}>
              <tr data-testid={`enquiry-row-${e.id}`} className={`border-t border-black/5 align-top ${e.status === "NEW" ? "bg-[#d4af37]/[.06] font-medium" : ""}`}>
                <td className="whitespace-nowrap p-3 text-xs text-neutral-500">{fmt(e.created_at)}</td>
                <td className="p-3">{e.full_name}</td>
                <td className="p-3 text-xs"><a href={`mailto:${e.email}`} className="text-[#8a6d12] underline-offset-2 hover:underline">{e.email}</a></td>
                <td className="whitespace-nowrap p-3 text-xs"><a href={`tel:${e.phone}`}>{e.phone}</a></td>
                <td className="whitespace-nowrap p-3 text-xs">{enquiryTypes[e.enquiry_type] || e.enquiry_type}</td>
                <td className="max-w-sm p-3 text-xs font-normal text-neutral-600">
                  <button onClick={() => setOpen(open === e.id ? null : e.id)} data-testid={`enquiry-message-${e.id}`} className={`text-left ${open === e.id ? "whitespace-pre-wrap" : "line-clamp-2"}`}>{e.message}</button>
                </td>
                <td className="p-3">
                  <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${PILL[e.status]}`}>{enquiryStatuses[e.status]}</span>
                  <select value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value)} data-testid={`enquiry-status-${e.id}`} className="block rounded border border-black/10 px-1 py-0.5 text-xs">
                    {Object.entries(enquiryStatuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => setNotesFor(notesFor === e.id ? null : e.id)} data-testid={`enquiry-notes-btn-${e.id}`} className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] transition-colors ${notesFor === e.id ? "border-[#11110f] bg-[#11110f] text-[#d4af37]" : "border-black/15 hover:border-[#d4af37]"}`}>
                    Notes{e.notes_count > 0 && <span data-testid={`enquiry-notes-count-${e.id}`} className="ml-1 font-semibold">({e.notes_count})</span>}
                  </button>
                </td>
              </tr>
              {notesFor === e.id && <tr><td colSpan={8} className="border-t border-black/5 p-0"><EnquiryNotes enquiry={e} onAdded={() => setItems((xs) => xs.map((x) => (x.id === e.id ? { ...x, notes_count: x.notes_count + 1 } : x)))} /></td></tr>}
            </Fragment>))}
            {rows.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-neutral-400">No enquiries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
