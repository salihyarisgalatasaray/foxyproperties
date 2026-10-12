import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";

export async function GET() {
  const me = await requireApiUser("tasks:own");
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  const all = can(me.role, "tasks:manage");
  try {
    const [users, clients, properties] = await Promise.all([
      all ? dbQuery<{ id: string; name: string }>(`SELECT id,name FROM backoffice_users WHERE active ORDER BY name`) : Promise.resolve({ rows: [{ id: me.sub, name: me.name }] }),
      dbQuery<{ id: string; label: string }>(`SELECT id,full_name label FROM clients ORDER BY full_name LIMIT 500`),
      dbQuery<{ id: string; label: string }>(`SELECT id,title||', '||area label FROM properties ORDER BY title LIMIT 500`),
    ]);
    return NextResponse.json({ ok: true, users: users.rows, clients: clients.rows, properties: properties.rows, me: me.sub });
  } catch { return NextResponse.json({ ok: false, users: [], clients: [], properties: [] }, { status: 503 }); }
}
