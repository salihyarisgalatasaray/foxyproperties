import { requireUser } from "@/lib/auth/session";
import { EnquiriesManager } from "@/components/backoffice/EnquiriesManager";
export const dynamic = "force-dynamic";
export default async function EnquiriesPage() {
  await requireUser("enquiries:read");
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">INBOX</p><h1 className="mt-2 font-serif text-4xl">Enquiries</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">Customer enquiries submitted from the Contact page. Mark each one as Read, In Progress or Resolved.</p><div className="mt-8"><EnquiriesManager /></div></>);
}
