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

  const byStatus = useMemo(() => {
    const map: Record<string, LeadRow[]> = {};
    for (const s of leadStatuses) map[s] = [];
    for (const l of leads) (map[l.status] ||= []).push(l);
    return map;
  }, [leads]);

  async function move(lead: LeadRow, dir: -1 | 1) {
    const idx = leadStatuses.indexOf(lead.status);
    const next = leadStatuses[idx + dir];
    if (!next || busy) return;
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
      <div className="grid gap-4 overflow-x-auto pb-4 md:grid-flow-col md:auto-cols-[minmax(220px,1fr)]">
        {leadStatuses.map((s) => (
          <div key={s} data-testid={`pipeline-col-${s.toLowerCase()}`} className="rounded-xl border border-black/10 bg-black/[.02] p-3">
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-xs font-medium tracking-[.14em] text-neutral-600">{LABELS[s].toUpperCase()}</span>
              <span className="rounded-full bg-[#11110f] px-2 py-0.5 text-[10px] text-[#d4af37]">{byStatus[s].length}</span>
            </div>
            <div className="space-y-3">
              {byStatus[s].map((l) => {
                const idx = leadStatuses.indexOf(l.status);
                return (
                  <div key={l.id} data-testid={`pipeline-card-${l.id}`} className="rounded-lg border border-black/10 bg-white p-3 shadow-sm">
                    <Link href={`/backoffice/leads/${l.id}`} className="block font-medium underline decoration-black/20 underline-offset-2 hover:decoration-[#d4af37]">
                      {l.name}
                    </Link>
                    <div className="mt-1 truncate text-xs text-neutral-500">{l.email}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded bg-[#d4af37]/15 px-1.5 py-0.5 text-[10px] tracking-[.08em] text-[#8a6d1a]">{l.type}</span>
                      <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] tracking-[.08em] text-neutral-600">{l.source}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-neutral-400">{new Date(l.created_at).toLocaleDateString("en-GB")}</div>
                    {canUpdate && (
                      <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-2">
                        <button
                          onClick={() => move(l, -1)}
                          disabled={idx === 0 || busy === l.id}
                          data-testid={`pipeline-back-${l.id}`}
                          className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-black/5 disabled:opacity-30"
                          aria-label="Move back a stage"
                        >
                          ←
                        </button>
                        <span className="text-[10px] text-neutral-400">{busy === l.id ? "saving…" : "move stage"}</span>
                        <button
                          onClick={() => move(l, 1)}
                          disabled={idx === leadStatuses.length - 1 || busy === l.id}
                          data-testid={`pipeline-fwd-${l.id}`}
                          className="rounded px-2 py-1 text-xs text-[#8a6d1a] hover:bg-[#d4af37]/10 disabled:opacity-30"
                          aria-label="Advance a stage"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {byStatus[s].length === 0 && <p className="px-1 py-6 text-center text-xs text-neutral-300">—</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
