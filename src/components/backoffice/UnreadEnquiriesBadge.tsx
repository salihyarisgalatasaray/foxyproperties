"use client";
import { useEffect, useState } from "react";

export const ENQUIRIES_CHANGED = "foxy:enquiries-changed";

export function UnreadEnquiriesBadge() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const load = () => fetch("/api/backoffice/enquiries?count=1").then((r) => r.json()).then((d) => setN(d.unread || 0)).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    window.addEventListener(ENQUIRIES_CHANGED, load);
    return () => { clearInterval(t); window.removeEventListener(ENQUIRIES_CHANGED, load); };
  }, []);
  if (!n) return null;
  return <span data-testid="enquiries-unread-badge" className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1.5 text-[10px] font-bold text-black">{n}</span>;
}
