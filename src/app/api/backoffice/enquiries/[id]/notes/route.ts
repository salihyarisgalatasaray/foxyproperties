import { NextResponse } from "next/server";
import { z } from "zod";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { noteKinds, type NoteKind, type NoteRow } from "@/lib/backoffice/types";

type P = { params: Promise<{ id: string }> };
const schema = z.object({ kind: z.enum(Object.keys(noteKinds) as [NoteKind, ...NoteKind[]]).default("NOTE"), body: z.string().trim().min(1).max(3000) });

export async function GET(_: Request, { params }: P) {
  if (!(await requireApiUser("enquiries:read"))) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  try {
    const r = await dbQuery<NoteRow>(`SELECT id,kind,body,author_name,created_at::text FROM enquiry_notes WHERE enquiry_id=$1 ORDER BY created_at DESC`, [id]);
    return NextResponse.json({ ok: true, items: r.rows });
  } catch { return NextResponse.json({ ok: false, items: [] }, { status: 503 }); }
}

export async function POST(req: Request, { params }: P) {
  const me = await requireApiUser("enquiries:update");
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: "Please write a note." }, { status: 400 });
  try {
    if (!(await dbQuery(`SELECT 1 FROM enquiries WHERE id=$1`, [id])).rowCount) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    const r = await dbQuery<NoteRow>(
      `INSERT INTO enquiry_notes(enquiry_id,kind,body,author_id,author_name) VALUES($1,$2,$3,$4,$5) RETURNING id,kind,body,author_name,created_at::text`,
      [id, p.data.kind, p.data.body, me.sub, me.name]
    );
    return NextResponse.json({ ok: true, item: r.rows[0] }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 }); }
}
