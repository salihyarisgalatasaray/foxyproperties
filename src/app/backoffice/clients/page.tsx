import { requireUser } from "@/lib/auth/session";
import { ClientsManager } from "@/components/backoffice/ClientsManager";
export const dynamic = "force-dynamic";
export default async function ClientsPage() {
  await requireUser("leads:read");
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">CRM</p><h1 className="mt-2 font-serif text-4xl">Client Management</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">Track potential buyers and tenants — budget, preferred areas, interest and Hot/Warm/Cold status.</p><div className="mt-8"><ClientsManager /></div></>);
}
