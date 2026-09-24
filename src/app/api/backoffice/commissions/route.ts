import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import type { CommissionRow } from "@/lib/backoffice/types";

function csvCell(v: string) { return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }

export async function GET(req: Request) {
  if (!(await requireApiUser("finance:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const conds: string[] = [];
  const vals: unknown[] = [];
  if (from) { vals.push(from); conds.push(`completed_on >= $${vals.length}`); }
  if (to) { vals.push(to); conds.push(`completed_on <= $${vals.length}`); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  try {
    const r = await dbQuery<CommissionRow>(`SELECT id,property_label,client_name,deal_type,price::text,commission_pct::text,commission_amount::text,agent,completed_on::text FROM commissions ${where} ORDER BY completed_on DESC LIMIT 2000`, vals);
    if (url.searchParams.get("format") === "csv") {
      const header = ["Property", "Client", "Type", "Price", "Commission %", "Commission Amount", "Agent", "Completed"];
      const lines = [header.join(",")];
      for (const c of r.rows) lines.push([c.property_label, c.client_name, c.deal_type, c.price, c.commission_pct, c.commission_amount, c.agent || "", c.completed_on].map((x) => csvCell(String(x))).join(","));
      return new NextResponse(lines.join("\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="commissions.csv"` } });
    }
    const total = r.rows.reduce((n, c) => n + Number(c.commission_amount), 0);
    return NextResponse.json({ ok: true, items: r.rows, total });
  } catch { return NextResponse.json({ ok: false, items: [], total: 0 }, { status: 503 }); }
}

export async function POST(req: Request) {
  if (!(await requireApiUser("finance:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b?.property_label || !b?.client_name) return NextResponse.json({ ok: false, error: "Property and client required" }, { status: 400 });
  const price = Number(b.price) || 0;
  const pct = Number(b.commission_pct) || 0;
  const amount = b.commission_amount ? Number(b.commission_amount) : Math.round(price * (pct / 100));
  const dealType = b.deal_type === "rental" ? "rental" : "sale";
  try {
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO commissions(property_label,client_name,deal_type,price,commission_pct,commission_amount,agent,completed_on) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [b.property_label, b.client_name, dealType, price, pct, amount, b.agent || null, b.completed_on || new Date().toISOString().slice(0, 10)]
    );
    return NextResponse.json({ ok: true, id: r.rows[0].id }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 }); }
}
