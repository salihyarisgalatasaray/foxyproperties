import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { clientStatuses } from "@/lib/backoffice/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser("leads:update"))) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });
  const sets: string[] = [];
  const vals: unknown[] = [];
  const add = (col: string, v: unknown) => { vals.push(v); sets.push(`${col}=$${vals.length}`); };
  if (b.status !== undefined) { if (!clientStatuses.includes(b.status)) return NextResponse.json({ ok: false }, { status: 400 }); add("status", b.status); }
  if (b.notes !== undefined) add("notes", b.notes || null);
  if (b.last_contact_at !== undefined) add("last_contact_at", b.last_contact_at || null);
  if (b.budget !== undefined) add("budget", b.budget ? Number(b.budget) : null);
  if (b.preferred_areas !== undefined) add("preferred_areas", b.preferred_areas || null);
  if (!sets.length) return NextResponse.json({ ok: false, error: "No changes" }, { status: 400 });
  vals.push(id);
  try {
    await dbQuery(`UPDATE clients SET ${sets.join(",")}, updated_at=now() WHERE id=$${vals.length}`, vals);
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false, error: "Update failed" }, { status: 503 }); }
}
