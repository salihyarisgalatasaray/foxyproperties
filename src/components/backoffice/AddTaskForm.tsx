"use client";
import { useEffect, useState } from "react";
import { taskPriorities } from "@/lib/backoffice/types";

type Opt = { id: string; label: string };
type Options = { users: { id: string; name: string }[]; clients: Opt[]; properties: Opt[]; me?: string };
const input = "rounded border border-black/15 px-3 py-2 text-sm";
const today = (plusDays = 0) => new Date(Date.now() + plusDays * 864e5).toLocaleDateString("en-CA", { timeZone: "Europe/London" });
export type TaskPrefill = { description: string; relatedLabel: string; dueInDays: number };

export function AddTaskForm({ onSaved, onCancel, prefill }: { onSaved: () => void; onCancel: () => void; prefill?: TaskPrefill }) {
  const [o, setO] = useState<Options>({ users: [], clients: [], properties: [] });
  const [related, setRelated] = useState("TEXT");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetch("/api/backoffice/tasks/options").then((r) => r.json()).then(setO); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const [related_type, related_id = ""] = related.split(":");
    setSaving(true); setError("");
    const res = await fetch("/api/backoffice/tasks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, related_type, related_id }) });
    setSaving(false);
    if (res.ok) onSaved(); else setError((await res.json().catch(() => ({}))).error || "Save failed");
  }

  return (
    <form onSubmit={save} data-testid="task-form" className="mt-5 grid gap-3 rounded-xl border border-[#d4af37]/40 bg-white p-5 md:grid-cols-2">
      <input name="description" required minLength={2} defaultValue={prefill?.description} placeholder="Task description *" data-testid="task-description" className={`${input} md:col-span-2`} />
      <select value={related} onChange={(e) => setRelated(e.target.value)} data-testid="task-related" className={input}>
        <option value="TEXT">No link / type your own</option>
        {o.clients.length > 0 && <optgroup label="Clients">{o.clients.map((c) => <option key={c.id} value={`CLIENT:${c.id}`}>{c.label}</option>)}</optgroup>}
        {o.properties.length > 0 && <optgroup label="Properties">{o.properties.map((p) => <option key={p.id} value={`PROPERTY:${p.id}`}>{p.label}</option>)}</optgroup>}
      </select>
      <input name="related_label" defaultValue={prefill?.relatedLabel} disabled={related !== "TEXT"} placeholder="Related client or property (free text)" data-testid="task-related-text" className={`${input} disabled:bg-neutral-50 disabled:text-neutral-300`} />
      <label className="text-xs text-neutral-500">Due date *<input name="due_date" type="date" required defaultValue={today(prefill?.dueInDays)} data-testid="task-due-date" className={`${input} mt-1 block w-full`} /></label>
      <label className="text-xs text-neutral-500">Assigned agent
        <select name="assigned_user_id" key={o.me} defaultValue={o.users.length === 1 ? o.users[0].id : o.me} data-testid="task-assignee" className={`${input} mt-1 block w-full`}>
          {o.users.length > 1 && <option value="">Unassigned</option>}
          {o.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </label>
      <label className="text-xs text-neutral-500">Priority
        <select name="priority" defaultValue="MEDIUM" data-testid="task-priority" className={`${input} mt-1 block w-full`}>{taskPriorities.map((p) => <option key={p} value={p}>{p[0] + p.slice(1).toLowerCase()}</option>)}</select>
      </label>
      {error && <p data-testid="task-form-error" className="text-sm text-red-600 md:col-span-2">{error}</p>}
      <div className="flex gap-3 md:col-span-2">
        <button disabled={saving} data-testid="task-save" className="rounded bg-[#11110f] px-5 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37] disabled:opacity-50">{saving ? "SAVING…" : "SAVE TASK"}</button>
        <button type="button" onClick={onCancel} data-testid="task-cancel" className="rounded border border-black/15 px-5 py-2 text-xs tracking-[.12em]">CANCEL</button>
      </div>
    </form>
  );
}
