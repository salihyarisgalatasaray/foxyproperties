import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";

export default async function AdminPropertiesLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user || !can(user.role, "properties:edit")) redirect("/admin");
  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#f4f0e8]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
        <div className="flex items-baseline gap-3">
          <span className="display text-xl text-[#D4AF37]">FOXY</span>
          <span className="text-[10px] tracking-[.28em] text-white/50">ADMIN · PROPERTIES</span>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <span className="text-white/60">{user.name} · {user.role}</span>
          <form action="/api/auth/logout" method="post"><button className="text-[#D4AF37]" data-testid="admin-logout">Sign out</button></form>
        </div>
      </header>
      <main className="px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
