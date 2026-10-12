import { requireUser } from "@/lib/auth/session";
import { CalendarTasks } from "@/components/backoffice/CalendarTasks";
export const dynamic = "force-dynamic";
export default async function MyTasksPage() {
  await requireUser("tasks:own");
  return (<><p className="text-xs tracking-[.2em] text-neutral-500">MY WORK</p><h1 className="mt-2 font-serif text-4xl">My Tasks</h1><p className="mt-3 max-w-2xl text-sm text-neutral-500">Your viewings today and the tasks assigned to you.</p><CalendarTasks /></>);
}
