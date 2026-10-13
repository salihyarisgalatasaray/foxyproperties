import { NextResponse } from "next/server";
import { z } from "zod";
import { dbQuery } from "@/lib/db";
import { rateLimit } from "@/lib/security/rateLimit";
import { notifyWhatsAppLead } from "@/lib/email";

const schema = z.object({
  first_name: z.string().trim().min(1).max(60),
  last_name: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(254),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    if (!(await rateLimit(`whatsapp:${ip}`, 8, 15))) return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    const p = schema.safeParse(await req.json().catch(() => null));
    if (!p.success) return NextResponse.json({ ok: false, error: "Invalid details" }, { status: 400 });
    const d = p.data;
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO enquiries(full_name,email,phone,enquiry_type,message) VALUES($1,$2,$3,'WHATSAPP',$4) RETURNING id`,
      [`${d.first_name} ${d.last_name}`, d.email, d.phone, "Contacted via the WhatsApp button."]
    );
    const id = r.rows[0].id;
    await notifyWhatsAppLead({ id, firstName: d.first_name, lastName: d.last_name, phone: d.phone, email: d.email }).catch((e) => console.error("[whatsapp-lead] email failed", e));
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    console.error("[whatsapp-lead] save failed", e);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
