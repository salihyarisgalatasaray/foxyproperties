"use client";
import { useEffect, useState } from "react";
import { enquiryTypes, noteKinds, pgDate, type EnquiryRow, type NoteKind, type NoteRow } from "@/lib/backoffice/types";
import { AddTaskForm } from "./AddTaskForm";
import { TASKS_CHANGED } from "./CountBadge";

const DOT: Record<NoteKind, string> = { NOTE: "bg-neutral-400", CALL: "bg-sky-500", EMAIL: "bg-[#d4af37]", MEETING: "bg-emerald-500" };
const when = (s: string) => pgDate(s).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export function EnquiryNotes({ enquiry, onAdded }: { enquiry: EnquiryRow; onAdded: () => void }) {
  const enquiryId = enquiry.id;
  const [followUp, setFollowUp] = useState(false);
  const [created, setCreated] = useState(false);
  const [items, setItems] = useState<NoteRow[] | null>(null);
  const [kind, setKind] = useState<NoteKind>("NOTE");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetch(`/api/backoffice/enquiries/${enquiryId}/notes`).then((r) => r.json()).then((d) => setItems(d.items || [])); }, [enquiryId]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/backoffice/enquiries/${enquiryId}/notes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, body }) });
    setSaving(false);
    if (!res.ok) return;
    const d = await res.json();
    setItems((xs) => [d.item, ...(xs || [])]);
    setBody("");
    onAdded();
  }

  return (
    <div data-testid={`enquiry-notes-${enquiryId}`} className="grid gap-6 bg-[#faf9f6] p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form onSubmit={add} className="space-y-3">
        <p className="text-[10px] font-semibold tracking-[.15em] text-neutral-500">ADD NOTE OR REPLY LOG</p>
        <select value={kind} onChange={(e) => setKind(e.target.value as NoteKind)} data-testid="note-kind" className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm">
          {Object.entries(noteKinds).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="e.g. Called Jane, booked a viewing for Thursday 2pm" data-testid="note-body" className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm" />
        <button disabled={saving || !body.trim()} data-testid="note-save" className="rounded bg-[#11110f] px-4 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37] disabled:opacity-40">{saving ? "SAVING…" : "SAVE TO HISTORY"}</button>
        <p className="text-[11px] text-neutral-400">Internal only — the customer is not emailed.</p>
      </form>
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => { setFollowUp((v) => !v); setCreated(false); }} data-testid="enquiry-followup-btn" className="rounded-full border border-[#d4af37] px-4 py-1.5 text-[11px] font-semibold tracking-[.1em] text-[#8a6d12] transition-colors hover:bg-[#d4af37] hover:text-black">{followUp ? "CLOSE" : "+ CREATE FOLLOW-UP TASK"}</button>
          {created && <span data-testid="enquiry-followup-created" className="text-xs text-emerald-700">Follow-up task created — it's on the dashboard.</span>}
        </div>
        {followUp && (
          <div className="mb-5 [&>form]:mt-0">
            <AddTaskForm
              prefill={{ description: `Follow up ${enquiry.full_name} — ${enquiryTypes[enquiry.enquiry_type] || enquiry.enquiry_type} enquiry`, relatedLabel: `${enquiry.full_name} · ${enquiry.phone} · ${enquiry.email}`, dueInDays: 1 }}
              onSaved={() => { setFollowUp(false); setCreated(true); window.dispatchEvent(new Event(TASKS_CHANGED)); }}
              onCancel={() => setFollowUp(false)}
            />
          </div>
        )}
        <p className="mb-3 text-[10px] font-semibold tracking-[.15em] text-neutral-500">HISTORY</p>
        {items === null ? <p className="text-xs text-neutral-400">Loading…</p> : items.length === 0 ? <p data-testid="notes-empty" className="text-xs text-neutral-400">No notes yet.</p> : (
          <ol className="relative space-y-4 border-l border-black/10 pl-5">
            {items.map((n) => (
              <li key={n.id} data-testid={`note-${n.id}`} className="relative">
                <span className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#faf9f6] ${DOT[n.kind]}`} />
                <p className="text-[11px] text-neutral-500"><span className="font-semibold text-neutral-700">{noteKinds[n.kind]}</span> · {n.author_name} · {when(n.created_at)}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-800">{n.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
