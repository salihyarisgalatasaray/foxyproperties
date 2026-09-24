import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import type { ClientRow } from "@/lib/backoffice/types";
import { clientStatuses } from "@/lib/backoffice/types";

export async function GET() {
  if (!(await requireApiUser("leads:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const r = await dbQuery<ClientRow>(`SELECT id,full_name,phone,email,budget::text,preferred_areas,interest,status,notes,last_contact_at::text,created_at::text FROM clients ORDER BY (status='HOT') DESC, updated_at DESC LIMIT 500`);
    return NextResponse.json({ ok: true, items: r.rows });
  } catch { return NextResponse.json({ ok: false, items: [] }, { status: 503 }); }
}

export async function POST(req: Request) {
  if (!(await requireApiUser("leads:update"))) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b?.full_name) return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });
  const interest = b.interest === "rent" ? "rent" : "buy";
  const status = clientStatuses.includes(b.status) ? b.status : "WARM";
  try {
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO clients(full_name,phone,email,budget,preferred_areas,interest,status,notes,last_contact_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [b.full_name, b.phone || null, b.email || null, b.budget ? Number(b.budget) : null, b.preferred_areas || null, interest, status, b.notes || null, b.last_contact_at || null]
    );
    return NextResponse.json({ ok: true, id: r.rows[0].id }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 }); }
}
