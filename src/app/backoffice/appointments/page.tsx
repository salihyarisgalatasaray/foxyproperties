import { requireUser } from "@/lib/auth/session";
import { getPropertyLabels } from "@/lib/backoffice/options";
import { AppointmentsBoard } from "@/components/backoffice/AppointmentsBoard";
export const dynamic = "force-dynamic";
export default async function AppointmentsPage() {
  await requireUser("leads:read");
  const labels = await getPropertyLabels();
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">SCHEDULE</p><h1 className="mt-2 font-serif text-4xl">Appointments &amp; Viewings</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">Weekly and monthly calendar of property viewings. Add appointments and move them through Pending → Confirmed → Completed.</p><div className="mt-8"><AppointmentsBoard propertyOptions={labels} /></div></>);
}
