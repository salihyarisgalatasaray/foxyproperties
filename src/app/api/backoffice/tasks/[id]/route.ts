import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireApiUser("tasks:own");
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (typeof b?.completed !== "boolean") return NextResponse.json({ ok: false, error: "Invalid" }, { status: 400 });
  const own = can(me.role, "tasks:manage") ? "" : "AND assigned_user_id=$3";
  try {
    const r = await dbQuery(
      `UPDATE tasks SET completed_at=CASE WHEN $1 THEN now() ELSE NULL END, updated_at=now() WHERE id=$2 ${own}`,
      own ? [b.completed, id, me.sub] : [b.completed, id]
    );
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false, error: "Update failed" }, { status: 503 }); }
}
