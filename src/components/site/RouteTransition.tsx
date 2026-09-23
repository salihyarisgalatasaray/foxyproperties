"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Subtle fade transition between pages. */
export function RouteTransition({ children }: { children: ReactNode }) {
  const path = usePathname();
  // Do not remount stateful admin/back-office trees; only fade public pages.
  if (path.startsWith("/admin") || path.startsWith("/backoffice")) return <>{children}</>;
  return (
    <div key={path} className="page-fade">
      {children}
    </div>
  );
}
