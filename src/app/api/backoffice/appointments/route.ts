import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import type { AppointmentRow } from "@/lib/backoffice/types";

export async function GET() {
  if (!(await requireApiUser("leads:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const r = await dbQuery<AppointmentRow>(`SELECT id,client_name,phone,email,property_label,starts_at::text,agent,notes,status FROM appointments ORDER BY starts_at ASC LIMIT 1000`);
    return NextResponse.json({ ok: true, items: r.rows });
  } catch { return NextResponse.json({ ok: false, items: [] }, { status: 503 }); }
}

export async function POST(req: Request) {
  if (!(await requireApiUser("leads:update"))) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b?.client_name || !b?.starts_at) return NextResponse.json({ ok: false, error: "Client and date/time required" }, { status: 400 });
  try {
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO appointments(client_name,phone,email,property_label,starts_at,agent,notes,status) VALUES($1,$2,$3,$4,$5,$6,$7,'PENDING') RETURNING id`,
      [b.client_name, b.phone || null, b.email || null, b.property_label || "", b.starts_at, b.agent || null, b.notes || null]
    );
    return NextResponse.json({ ok: true, id: r.rows[0].id }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 }); }
}
