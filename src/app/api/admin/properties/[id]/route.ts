import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/auth/session";
import { updateProperty, deleteProperty } from "@/lib/propertiesDb";

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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser("properties:edit"))) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: p.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const updated = await updateProperty(id, p.data);
  if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, property: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser("properties:edit"))) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  await deleteProperty(id);
  return NextResponse.json({ ok: true });
}
