import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { assignableRoles } from "@/lib/auth/permissions";

const schema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  password: z.string().min(8).max(200).optional().or(z.literal("")),
  role: z.enum(assignableRoles).optional(),
  active: z.boolean().optional(),
});
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireApiUser("users:manage");
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return bad("Invalid details (password min 8 characters).");
  const d = p.data;
  try {
    const t = (await dbQuery<{ role: string; active: boolean }>(`SELECT role,active FROM backoffice_users WHERE id=$1`, [id])).rows[0];
    if (!t) return bad("User not found", 404);
    const losesAdmin = t.role === "ADMIN" && t.active && ((d.role && d.role !== "ADMIN") || d.active === false);
    if (id === me.sub && losesAdmin) return bad("You cannot deactivate or demote your own account.");
    if (losesAdmin) {
      const n = Number((await dbQuery<{ n: string }>(`SELECT count(*)::text n FROM backoffice_users WHERE role='ADMIN' AND active AND id<>$1`, [id])).rows[0].n);
      if (n === 0) return bad("At least one active admin is required.");
    }
    const sets: string[] = [];
    const vals: unknown[] = [];
    const add = (col: string, v: unknown) => { vals.push(v); sets.push(`${col}=$${vals.length}`); };
    if (d.name) add("name", d.name);
    if (d.email) add("email", d.email);
    if (d.role) add("role", d.role);
    if (d.active !== undefined) add("active", d.active);
    if (d.password) add("password_hash", await bcrypt.hash(d.password, 12));
    if (!sets.length) return bad("No changes");
    vals.push(id);
    await dbQuery(`UPDATE backoffice_users SET ${sets.join(",")}, updated_at=now() WHERE id=$${vals.length}`, vals);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if ((e as { code?: string }).code === "23505") return bad("A user with this email already exists.", 409);
    return bad("Update failed", 503);
  }
}
