"use client";
import { useEffect, useState } from "react";

export const ENQUIRIES_CHANGED = "foxy:enquiries-changed";
export const TASKS_CHANGED = "foxy:tasks-changed";

export function CountBadge({ url, field, event, testid, tone = "gold" }: { url: string; field: string; event: string; testid: string; tone?: "gold" | "red" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const load = () => fetch(url).then((r) => r.json()).then((d) => setN(d[field] || 0)).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    window.addEventListener(event, load);
    return () => { clearInterval(t); window.removeEventListener(event, load); };
  }, [url, field, event]);
  if (!n) return null;
  const c = tone === "red" ? "bg-red-600 text-white" : "bg-[#d4af37] text-black";
  return <span data-testid={testid} className={`ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${c}`}>{n}</span>;
}
