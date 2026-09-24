"use client";
import { useState } from "react";
import Link from "next/link";

export function ConvertLeadButton({ leadId, initialClientId }: { leadId: string; initialClientId: string | null }) {
  const [clientId, setClientId] = useState<string | null>(initialClientId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyMsg, setAlreadyMsg] = useState(false);

  async function convert() {
    if (loading) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/backoffice/leads/${leadId}/convert`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok || res.status === 409) {
      if (res.status === 409) setAlreadyMsg(true);
      setClientId(data.clientId || null);
    } else {
      setError(data.error || "Conversion failed");
    }
  }

  if (clientId) {
    return (
      <div data-testid="lead-convert-done" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <p className="font-medium text-emerald-800">
          {alreadyMsg ? "This lead has already been converted to a client." : "Client record created."}
        </p>
        <Link
          href="/backoffice/clients"
          data-testid="lead-convert-view-client"
          className="mt-2 inline-block rounded bg-[#11110f] px-4 py-2 text-xs font-semibold tracking-[.12em] text-[#d4af37]"
        >
          VIEW IN CLIENTS
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={convert}
        disabled={loading}
        data-testid="lead-convert-button"
        className="rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold tracking-[.12em] text-black disabled:opacity-60"
      >
        {loading ? "CONVERTING…" : "CONVERT TO CLIENT"}
      </button>
      {error && (
        <p data-testid="lead-convert-error" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
