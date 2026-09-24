import { NextResponse } from "next/server";
import { dbTransaction } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/session";
import type { LeadRow } from "@/lib/crm/types";

const RENT_TYPES = new Set(["TENANT", "LETTING", "RENT"]);

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser("leads:update");
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const result = await dbTransaction(async (client) => {
      const lead = (await client.query<LeadRow>(
        `SELECT id,type,source,status,name,email,phone,message FROM leads WHERE id=$1`,
        [id]
      )).rows[0];
      if (!lead) return { status: 404 as const };

      const existing = (await client.query<{ id: string }>(
        `SELECT id FROM clients WHERE source_lead_id=$1`,
        [id]
      )).rows[0];
      if (existing) return { status: 409 as const, clientId: existing.id };

      const interest = RENT_TYPES.has(lead.type) ? "rent" : "buy";
      const notes = [lead.message, `Converted from ${lead.type} lead (source: ${lead.source})`]
        .filter(Boolean)
        .join("\n\n");

      const inserted = (await client.query<{ id: string }>(
        `INSERT INTO clients(full_name,phone,email,interest,status,notes,source_lead_id)
         VALUES($1,$2,$3,$4,'WARM',$5,$6) RETURNING id`,
        [lead.name, lead.phone || null, lead.email || null, interest, notes, id]
      )).rows[0];

      await client.query(
        `INSERT INTO activities(entity_type,entity_id,action,actor_id,metadata) VALUES('LEAD',$1,'CONVERTED_TO_CLIENT',$2,$3::jsonb)`,
        [id, user.sub, JSON.stringify({ client_id: inserted.id })]
      );
      return { status: 201 as const, clientId: inserted.id };
    });

    if (result.status === 404) return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
    if (result.status === 409)
      return NextResponse.json({ ok: false, error: "Already converted", clientId: result.clientId }, { status: 409 });
    return NextResponse.json({ ok: true, clientId: result.clientId }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Conversion failed" }, { status: 503 });
  }
}
