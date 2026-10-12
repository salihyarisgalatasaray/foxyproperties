import { NextResponse } from "next/server";
import { z } from "zod";
import { dbQuery } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { taskPriorities, type TaskRow, type ViewingRow } from "@/lib/backoffice/types";

const TODAY = `(now() AT TIME ZONE 'Europe/London')::date`;
const COLS = `t.id,t.description,t.related_type,t.related_label,t.due_date::text,t.assigned_user_id,u.name assignee,t.priority,(${TODAY}-t.due_date)::int days_overdue`;
const PRIO = `CASE t.priority WHEN 'HIGH' THEN 0 WHEN 'MEDIUM' THEN 1 ELSE 2 END`;

export async function GET(req: Request) {
  const me = await requireApiUser("tasks:own");
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  const all = can(me.role, "tasks:manage");
  const mine = all ? "" : `AND t.assigned_user_id=$1`;
  const args = all ? [] : [me.sub];
  try {
    const overdue = await dbQuery<TaskRow>(`SELECT ${COLS} FROM tasks t LEFT JOIN backoffice_users u ON u.id=t.assigned_user_id WHERE t.completed_at IS NULL AND t.due_date<${TODAY} ${mine} ORDER BY t.due_date ASC, ${PRIO}`, args);
    if (new URL(req.url).searchParams.get("count")) return NextResponse.json({ ok: true, overdue: overdue.rows.length });
    const upcoming = await dbQuery<TaskRow>(`SELECT ${COLS} FROM tasks t LEFT JOIN backoffice_users u ON u.id=t.assigned_user_id WHERE t.completed_at IS NULL AND t.due_date BETWEEN ${TODAY} AND ${TODAY}+7 ${mine} ORDER BY t.due_date ASC, ${PRIO}`, args);
    const viewings = await dbQuery<ViewingRow>(
      `SELECT id,client_name,property_label,starts_at::text,agent FROM appointments WHERE (starts_at AT TIME ZONE 'Europe/London')::date=${TODAY} AND status<>'CANCELLED' ${all ? "" : "AND lower(agent)=lower($1)"} ORDER BY starts_at ASC`,
      all ? [] : [me.name]
    );
    return NextResponse.json({ ok: true, overdue: overdue.rows, upcoming: upcoming.rows, viewings: viewings.rows });
  } catch { return NextResponse.json({ ok: false, overdue: [], upcoming: [], viewings: [] }, { status: 503 }); }
}

const schema = z.object({
  description: z.string().trim().min(2).max(500),
  related_type: z.enum(["CLIENT", "PROPERTY", "TEXT"]).default("TEXT"),
  related_id: z.string().uuid().optional().or(z.literal("")),
  related_label: z.string().trim().max(200).optional().default(""),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assigned_user_id: z.string().uuid().optional().or(z.literal("")),
  priority: z.enum(taskPriorities).default("MEDIUM"),
});

async function relatedLabel(type: string, id: string | undefined, text: string) {
  if (type === "TEXT" || !id) return { type: "TEXT", id: null, label: text };
  const q = type === "CLIENT" ? `SELECT full_name l FROM clients WHERE id=$1` : `SELECT title||', '||area l FROM properties WHERE id=$1`;
  const row = (await dbQuery<{ l: string }>(q, [id])).rows[0];
  return row ? { type, id, label: row.l } : null;
}

export async function POST(req: Request) {
  const me = await requireApiUser("tasks:own");
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: "Please enter a description and due date." }, { status: 400 });
  const d = p.data;
  const assignee = can(me.role, "tasks:manage") ? d.assigned_user_id || null : me.sub;
  try {
    if (assignee && !(await dbQuery(`SELECT 1 FROM backoffice_users WHERE id=$1 AND active`, [assignee])).rowCount)
      return NextResponse.json({ ok: false, error: "Assigned user not found." }, { status: 400 });
    const rel = await relatedLabel(d.related_type, d.related_id || undefined, d.related_label);
    if (!rel) return NextResponse.json({ ok: false, error: "Related client or property not found." }, { status: 400 });
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO tasks(description,related_type,related_id,related_label,due_date,assigned_user_id,priority,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [d.description, rel.type, rel.id, rel.label, d.due_date, assignee, d.priority, me.sub]
    );
    return NextResponse.json({ ok: true, id: r.rows[0].id }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Save failed" }, { status: 503 }); }
}
