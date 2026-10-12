import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import type { EnquiryRow } from "@/lib/backoffice/types";

export async function GET(req: Request) {
  if (!(await requireApiUser("enquiries:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const unread = Number((await dbQuery<{ n: string }>(`SELECT count(*)::text n FROM enquiries WHERE status='NEW'`)).rows[0].n);
    if (new URL(req.url).searchParams.get("count")) return NextResponse.json({ ok: true, unread });
    const r = await dbQuery<EnquiryRow>(`SELECT id,full_name,email,phone,enquiry_type,message,status,created_at::text FROM enquiries ORDER BY created_at DESC LIMIT 1000`);
    return NextResponse.json({ ok: true, unread, items: r.rows });
  } catch { return NextResponse.json({ ok: false, unread: 0, items: [] }, { status: 503 }); }
}
