import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { enquiryStatuses } from "@/lib/backoffice/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser("enquiries:update"))) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b || !(b.status in enquiryStatuses)) return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  try {
    const r = await dbQuery(`UPDATE enquiries SET status=$1, updated_at=now() WHERE id=$2`, [b.status, id]);
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false, error: "Update failed" }, { status: 503 }); }
}
