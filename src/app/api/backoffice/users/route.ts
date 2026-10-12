import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { assignableRoles } from "@/lib/auth/permissions";
import type { UserRow } from "@/lib/backoffice/types";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(200),
  role: z.enum(assignableRoles),
});

export async function GET() {
  if (!(await requireApiUser("users:manage"))) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const r = await dbQuery<UserRow>(`SELECT id,name,email,role,active,created_at::text FROM backoffice_users ORDER BY active DESC, created_at ASC`);
    return NextResponse.json({ ok: true, items: r.rows });
  } catch { return NextResponse.json({ ok: false, items: [] }, { status: 503 }); }
}

export async function POST(req: Request) {
  if (!(await requireApiUser("users:manage"))) return NextResponse.json({ ok: false }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: "Please fill all fields (password min 8 characters)." }, { status: 400 });
  const d = p.data;
  try {
    const hash = await bcrypt.hash(d.password, 12);
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO backoffice_users(email,name,password_hash,role,active) VALUES($1,$2,$3,$4,true) RETURNING id`,
      [d.email, d.name, hash, d.role]
    );
    return NextResponse.json({ ok: true, id: r.rows[0].id }, { status: 201 });
  } catch (e) {
    if ((e as { code?: string }).code === "23505") return NextResponse.json({ ok: false, error: "A user with this email already exists." }, { status: 409 });
    return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 });
  }
}
