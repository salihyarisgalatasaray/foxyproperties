import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/auth/session";
import { listProperties, createProperty } from "@/lib/propertiesDb";

const schema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().max(4000).default(""),
  area: z.string().trim().min(1).max(120),
  price: z.coerce.number().min(0).max(1_000_000_000),
  propertyType: z.enum(["apartment", "house", "commercial"]),
  listingType: z.enum(["buy", "rent"]),
  bedrooms: z.coerce.number().int().min(0).max(50),
  bathrooms: z.coerce.number().int().min(0).max(50),
  sizeSqft: z.coerce.number().int().min(0).max(1_000_000),
  status: z.enum(["LIVE", "COMING_SOON"]).default("COMING_SOON"),
  photos: z.array(z.string()).max(20).default([]),
});

export async function GET() {
  if (!(await requireApiUser("properties:edit"))) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ items: await listProperties(false) });
}

export async function POST(req: Request) {
  if (!(await requireApiUser("properties:edit"))) return NextResponse.json({ ok: false }, { status: 401 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: p.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const created = await createProperty(p.data);
  return NextResponse.json({ ok: true, property: created }, { status: 201 });
}
