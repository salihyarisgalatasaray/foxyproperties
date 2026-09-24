import { requireUser } from "@/lib/auth/session";
import { getPropertyLabels } from "@/lib/backoffice/options";
import { CommissionsManager } from "@/components/backoffice/CommissionsManager";
export const dynamic = "force-dynamic";
export default async function CommissionsPage() {
  await requireUser("finance:read");
  const labels = await getPropertyLabels();
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">FINANCE</p><h1 className="mt-2 font-serif text-4xl">Commission Tracker</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">Completed sales and rentals, commission earned, date-range filtering and CSV export.</p><div className="mt-8"><CommissionsManager propertyOptions={labels} /></div></>);
}
