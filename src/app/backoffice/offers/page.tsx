import { requireUser } from "@/lib/auth/session";
import { getPropertyLabels } from "@/lib/backoffice/options";
import { OffersManager } from "@/components/backoffice/OffersManager";
export const dynamic = "force-dynamic";
export default async function OffersPage() {
  await requireUser("leads:read");
  const labels = await getPropertyLabels();
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">NEGOTIATIONS</p><h1 className="mt-2 font-serif text-4xl">Offers &amp; Negotiations</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">All offers grouped by property, with status and counter-offer notes.</p><div className="mt-8"><OffersManager propertyOptions={labels} /></div></>);
}
