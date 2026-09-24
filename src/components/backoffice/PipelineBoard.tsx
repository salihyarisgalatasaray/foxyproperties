"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { leadStatuses, type LeadRow, type LeadStatus } from "@/lib/crm/types";

const LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  VIEWING: "Valuation booked",
  OFFER: "Proposal sent",
  COMPLETED: "Won",
};

export function PipelineBoard({ initial, canUpdate }: { initial: LeadRow[]; canUpdate: boolean }) {
  const [leads, setLeads] = useState<LeadRow[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

  const types = useMemo(() => Array.from(new Set(initial.map((l) => l.type))).sort(), [initial]);
  const sources = useMemo(() => Array.from(new Set(initial.map((l) => l.source))).sort(), [initial]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (typeFilter !== "ALL" && l.type !== typeFilter) return false;
      if (sourceFilter !== "ALL" && l.source !== sourceFilter) return false;
      if (term && !`${l.name} ${l.email} ${l.phone ?? ""}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [leads, q, typeFilter, sourceFilter]);

  const byStatus = useMemo(() => {
    const map: Record<string, LeadRow[]> = {};
    for (const s of leadStatuses) map[s] = [];
    for (const l of filtered) (map[l.status] ||= []).push(l);
    return map;
  }, [filtered]);

  const activeFilters = q.trim() !== "" || typeFilter !== "ALL" || sourceFilter !== "ALL";

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);

  async function moveTo(lead: LeadRow, next: LeadStatus) {
    if (next === lead.status || busy) return;
    setBusy(lead.id);
    setError(null);
    const prev = lead.status;
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
    const res = await fetch(`/api/backoffice/leads/${lead.id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(null);
    if (!res.ok) {
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: prev } : l)));
      setError("Could not update this lead. Please try again.");
    }
  }

  return (
    <div data-testid="pipeline-board">
      {error && (
        <p data-testid="pipeline-error" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email or phone…"
          data-testid="pipeline-search"
          className="min-w-[220px] flex-1 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#d4af37]"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          data-testid="pipeline-filter-type"
          className="rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d4af37]"
        >
          <option value="ALL">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          data-testid="pipeline-filter-source"
          className="rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d4af37]"
        >
          <option value="ALL">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span data-testid="pipeline-filtered-count" className="text-xs text-neutral-500">
          {filtered.length} shown
        </span>
        {activeFilters && (
          <button
            onClick={() => { setQ(""); setTypeFilter("ALL"); setSourceFilter("ALL"); }}
            data-testid="pipeline-clear-filters"
            className="rounded-lg border border-black/15 bg-white px-3 py-2.5 text-xs text-neutral-600 hover:border-[#d4af37]"
          >
            Clear
          </button>
        )}
      </div>

      {canUpdate && (
        <p className="mb-3 text-xs text-neutral-400" data-testid="pipeline-dnd-hint">
          Drag a card into another column to change its stage.
        </p>
      )}

      <div className="grid gap-4 overflow-x-auto pb-4 md:grid-flow-col md:auto-cols-[minmax(220px,1fr)]">
        {leadStatuses.map((s) => (
          <div
            key={s}
            data-testid={`pipeline-col-${s.toLowerCase()}`}
            onDragOver={(e) => { if (canUpdate && draggingId) { e.preventDefault(); setOverCol(s); } }}
            onDragLeave={() => setOverCol((c) => (c === s ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              setOverCol(null);
              const id = draggingId || e.dataTransfer.getData("text/plain");
              const lead = leads.find((l) => l.id === id);
              if (lead) moveTo(lead, s);
            }}
            className={`rounded-xl border p-3 transition-colors ${
              overCol === s ? "border-[#d4af37] bg-[#d4af37]/10" : "border-black/10 bg-black/[.02]"
            }`}
          >
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-xs font-medium tracking-[.14em] text-neutral-600">{LABELS[s].toUpperCase()}</span>
              <span className="rounded-full bg-[#11110f] px-2 py-0.5 text-[10px] text-[#d4af37]">{byStatus[s].length}</span>
            </div>
            <div className="min-h-[60px] space-y-3">
              {byStatus[s].map((l) => (
                <div
                  key={l.id}
                  data-testid={`pipeline-card-${l.id}`}
                  draggable={canUpdate}
                  onDragStart={(e) => { setDraggingId(l.id); e.dataTransfer.setData("text/plain", l.id); e.dataTransfer.effectAllowed = "move"; }}
                  onDragEnd={() => { setDraggingId(null); setOverCol(null); }}
                  className={`rounded-lg border border-black/10 bg-white p-3 shadow-sm ${canUpdate ? "cursor-grab active:cursor-grabbing" : ""} ${
                    draggingId === l.id ? "opacity-40" : ""
                  } ${busy === l.id ? "ring-1 ring-[#d4af37]" : ""}`}
                >
                  <Link href={`/backoffice/leads/${l.id}`} className="block font-medium underline decoration-black/20 underline-offset-2 hover:decoration-[#d4af37]">
                    {l.name}
                  </Link>
                  <div className="mt-1 truncate text-xs text-neutral-500">{l.email}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded bg-[#d4af37]/15 px-1.5 py-0.5 text-[10px] tracking-[.08em] text-[#8a6d1a]">{l.type}</span>
                    <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] tracking-[.08em] text-neutral-600">{l.source}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">{new Date(l.created_at).toLocaleDateString("en-GB")}</span>
                    {busy === l.id && <span className="text-[10px] text-[#8a6d1a]">saving…</span>}
                  </div>
                  {canUpdate && (
                    <label className="mt-3 block border-t border-black/5 pt-2 text-[10px] text-neutral-400">
                      Move to
                      <select
                        value={l.status}
                        onChange={(e) => moveTo(l, e.target.value as LeadStatus)}
                        disabled={busy === l.id}
                        data-testid={`pipeline-select-${l.id}`}
                        className="mt-1 w-full rounded border border-black/10 bg-white px-2 py-1 text-xs text-neutral-700 outline-none focus:border-[#d4af37]"
                      >
                        {leadStatuses.map((st) => (
                          <option key={st} value={st}>{LABELS[st]}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              ))}
              {byStatus[s].length === 0 && (
                <p className="px-1 py-6 text-center text-xs text-neutral-300">{overCol === s ? "Drop here" : "—"}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
