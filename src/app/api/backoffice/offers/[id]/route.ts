import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { offerStatuses } from "@/lib/backoffice/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser("leads:update"))) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });
  const sets: string[] = [];
  const vals: unknown[] = [];
  const add = (col: string, v: unknown) => { vals.push(v); sets.push(`${col}=$${vals.length}`); };
  if (b.status !== undefined) { if (!offerStatuses.includes(b.status)) return NextResponse.json({ ok: false }, { status: 400 }); add("status", b.status); }
  if (b.counter_notes !== undefined) add("counter_notes", b.counter_notes || null);
  if (b.amount !== undefined) add("amount", b.amount ? Number(b.amount) : 0);
  if (!sets.length) return NextResponse.json({ ok: false, error: "No changes" }, { status: 400 });
  vals.push(id);
  try {
    await dbQuery(`UPDATE offers SET ${sets.join(",")}, updated_at=now() WHERE id=$${vals.length}`, vals);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false, error: "Update failed" }, { status: 503 }); }
}
