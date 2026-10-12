import { requireUser } from "@/lib/auth/session";
import { UsersManager } from "@/components/backoffice/UsersManager";
export const dynamic = "force-dynamic";
export default async function UsersPage() {
  const me = await requireUser("users:manage");
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">SETTINGS</p><h1 className="mt-2 font-serif text-4xl">User Management</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">Add back-office users, change their role or password, and deactivate access. Agents can only see Enquiries.</p><div className="mt-8"><UsersManager meId={me.sub} /></div></>);
}
