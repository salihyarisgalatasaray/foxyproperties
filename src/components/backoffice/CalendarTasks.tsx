"use client";
import { useCallback, useEffect, useState } from "react";
import { pgDate, type TaskRow, type ViewingRow } from "@/lib/backoffice/types";
import { TASKS_CHANGED } from "./CountBadge";
import { AddTaskForm } from "./AddTaskForm";

const time = (s: string) => pgDate(s).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
const day = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
const PRIO: Record<string, string> = { HIGH: "bg-red-100 text-red-700", MEDIUM: "bg-amber-100 text-amber-800", LOW: "bg-neutral-100 text-neutral-600" };
type Data = { viewings: ViewingRow[]; upcoming: TaskRow[]; overdue: TaskRow[] };

export function CalendarTasks() {
  const [data, setData] = useState<Data>({ viewings: [], upcoming: [], overdue: [] });
  const [adding, setAdding] = useState(false);
  const load = useCallback(() => fetch("/api/backoffice/tasks").then((r) => r.json()).then((d) => setData({ viewings: d.viewings || [], upcoming: d.upcoming || [], overdue: d.overdue || [] })), []);
  useEffect(() => { load(); }, [load]);
  const changed = () => { load(); window.dispatchEvent(new Event(TASKS_CHANGED)); };
  async function complete(id: string) {
    setData((d) => ({ ...d, upcoming: d.upcoming.filter((t) => t.id !== id), overdue: d.overdue.filter((t) => t.id !== id) }));
    await fetch(`/api/backoffice/tasks/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ completed: true }) });
    changed();
  }

  return (
    <section data-testid="calendar-tasks" className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs tracking-[.2em] text-neutral-500">CALENDAR &amp; TASKS</p><h2 className="mt-2 font-serif text-2xl">Today and the week ahead</h2></div>
        <button onClick={() => setAdding((v) => !v)} data-testid="task-add-btn" className="rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold tracking-[.12em] text-black transition-transform hover:-translate-y-0.5">{adding ? "CLOSE" : "+ ADD TASK"}</button>
      </div>
      {adding && <AddTaskForm onSaved={() => { setAdding(false); changed(); }} onCancel={() => setAdding(false)} />}
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Widget title="Today's Viewings" count={data.viewings.length} testid="widget-viewings">
          {data.viewings.length === 0 ? <Empty testid="viewings-empty">No viewings scheduled today</Empty> : data.viewings.map((v) => (
            <li key={v.id} data-testid={`viewing-${v.id}`} className="flex gap-4 border-t border-black/5 py-3 first:border-0">
              <span className="w-12 shrink-0 font-serif text-lg text-[#8a6d12]">{time(v.starts_at)}</span>
              <div className="min-w-0 text-sm"><p className="font-medium">{v.client_name}</p><p className="truncate text-xs text-neutral-500">{v.property_label || "—"}</p><p className="mt-1 text-[11px] text-neutral-400">Agent: {v.agent || "Unassigned"}</p></div>
            </li>
          ))}
        </Widget>
        <Widget title="Upcoming Tasks & Follow-ups" count={data.upcoming.length} testid="widget-upcoming">
          {data.upcoming.length === 0 ? <Empty testid="upcoming-empty">Nothing due in the next 7 days</Empty> : data.upcoming.map((t) => <Task key={t.id} t={t} onDone={complete} meta={day(t.due_date)} />)}
        </Widget>
        <Widget title="Overdue Tasks" count={data.overdue.length} testid="widget-overdue" danger={data.overdue.length > 0}>
          {data.overdue.length === 0 ? <Empty testid="overdue-empty">No overdue tasks</Empty> : data.overdue.map((t) => <Task key={t.id} t={t} onDone={complete} overdue meta={`${t.days_overdue} day${t.days_overdue === 1 ? "" : "s"} overdue`} />)}
        </Widget>
      </div>
    </section>
  );
}

function Widget({ title, count, testid, danger, children }: { title: string; count: number; testid: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <div data-testid={testid} className={`rounded-xl border bg-white p-5 ${danger ? "border-red-300" : "border-black/10"}`}>
      <div className="mb-2 flex items-center justify-between"><p className={`text-sm font-semibold ${danger ? "text-red-700" : ""}`}>{title}</p><span data-testid={`${testid}-count`} className={`rounded-full px-2 text-xs ${danger ? "bg-red-600 text-white" : "bg-black/5 text-neutral-600"}`}>{count}</span></div>
      <ul>{children}</ul>
    </div>
  );
}

function Empty({ testid, children }: { testid: string; children: React.ReactNode }) {
  return <li data-testid={testid} className="py-6 text-center text-sm text-neutral-400">{children}</li>;
}

function Task({ t, meta, overdue, onDone }: { t: TaskRow; meta: string; overdue?: boolean; onDone: (id: string) => void }) {
  return (
    <li data-testid={`task-${t.id}`} className={`flex items-start gap-3 border-t py-3 first:border-0 ${overdue ? "-mx-2 rounded border-red-100 bg-red-50 px-2" : "border-black/5"}`}>
      <button onClick={() => onDone(t.id)} data-testid={`task-complete-${t.id}`} title="Mark complete" className={`mt-0.5 h-4 w-4 shrink-0 rounded border transition-colors hover:bg-emerald-500 ${overdue ? "border-red-400" : "border-black/30"}`} />
      <div className="min-w-0 flex-1 text-sm">
        <p className={`font-medium ${overdue ? "text-red-800" : ""}`}>{t.description}</p>
        {t.related_label && <p className="truncate text-xs text-neutral-500">{t.related_label}</p>}
        <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
          <span data-testid={`task-due-${t.id}`} className={overdue ? "font-semibold text-red-600" : ""}>{meta}</span>·<span>{t.assignee || "Unassigned"}</span>
          <span className={`rounded px-1.5 py-px text-[10px] font-semibold ${PRIO[t.priority]}`}>{t.priority}</span>
        </p>
      </div>
    </li>
  );
}
