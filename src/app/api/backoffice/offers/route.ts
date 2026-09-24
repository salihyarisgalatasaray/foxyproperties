import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import type { OfferRow } from "@/lib/backoffice/types";

export async function GET() {
  if (!(await requireApiUser("leads:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const r = await dbQuery<OfferRow>(`SELECT id,property_label,client_name,amount::text,submitted_at::text,status,counter_notes FROM offers ORDER BY property_label ASC, submitted_at DESC LIMIT 1000`);
    return NextResponse.json({ ok: true, items: r.rows });
  } catch { return NextResponse.json({ ok: false, items: [] }, { status: 503 }); }
}

export async function POST(req: Request) {
  if (!(await requireApiUser("leads:update"))) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b?.client_name || !b?.property_label) return NextResponse.json({ ok: false, error: "Property and client required" }, { status: 400 });
  try {
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO offers(property_label,client_name,amount,submitted_at,status,counter_notes) VALUES($1,$2,$3,$4,'PENDING',$5) RETURNING id`,
      [b.property_label, b.client_name, b.amount ? Number(b.amount) : 0, b.submitted_at || new Date().toISOString(), b.counter_notes || null]
    );
    return NextResponse.json({ ok: true, id: r.rows[0].id }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 }); }
}
