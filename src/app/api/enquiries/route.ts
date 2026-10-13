import { NextResponse } from "next/server";
import { z } from "zod";
import { dbQuery } from "@/lib/db";
import { rateLimit } from "@/lib/security/rateLimit";
import { notifyNewEnquiry, sendEnquiryConfirmation } from "@/lib/email";
import { enquiryTypes, type EnquiryType } from "@/lib/backoffice/types";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(40),
  enquiry_type: z.enum(Object.keys(enquiryTypes).filter((k) => k !== "WHATSAPP") as [EnquiryType, ...EnquiryType[]]),
  message: z.string().trim().min(2).max(3000),
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    if (!(await rateLimit(`enquiry:${ip}`, 8, 15))) return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
    const p = schema.safeParse(await req.json().catch(() => null));
    if (!p.success) return NextResponse.json({ ok: false, error: "Invalid enquiry" }, { status: 400 });
    const d = p.data;
    const r = await dbQuery<{ id: string }>(
      `INSERT INTO enquiries(full_name,email,phone,enquiry_type,message) VALUES($1,$2,$3,$4,$5) RETURNING id`,
      [d.full_name, d.email, d.phone, d.enquiry_type, d.message]
    );
    const info = { id: r.rows[0].id, name: d.full_name, email: d.email, phone: d.phone, typeLabel: enquiryTypes[d.enquiry_type], message: d.message };
    const results = await Promise.allSettled([notifyNewEnquiry(info), sendEnquiryConfirmation(info)]);
    results.forEach((x) => x.status === "rejected" && console.error("[enquiries] email failed", x.reason));
    return NextResponse.json({ ok: true, id: info.id }, { status: 201 });
  } catch (e) {
    console.error("[enquiries] save failed", e);
    return NextResponse.json({ ok: false, error: "Enquiry service unavailable" }, { status: 503 });
  }
}
