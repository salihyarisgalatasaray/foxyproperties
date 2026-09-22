import { NextResponse } from "next/server";
import { listProperties, mediaUrl } from "@/lib/propertiesDb";
import { prototypeProperties } from "@/lib/properties";

export const dynamic = "force-dynamic";

// Public catalogue = live admin properties + clearly-labelled prototypes.
export async function GET() {
  const live = await listProperties(true).catch(() => []);
  const dbItems = live.map((p) => ({
    id: p.id, slug: p.slug, title: p.title, area: p.area, price: p.price,
    bedrooms: p.bedrooms, bathrooms: p.bathrooms, type: p.propertyType,
    listingType: p.listingType, sizeSqft: p.sizeSqft, status: p.status,
    image: p.photos[0] ? mediaUrl(p.photos[0]) : null, prototype: false,
  }));
  const protoItems = prototypeProperties.map((p) => ({
    id: p.id, slug: p.slug, title: p.title, area: p.area, price: p.price,
    bedrooms: p.bedrooms, bathrooms: p.bathrooms, type: p.type.toLowerCase(),
    listingType: "buy", sizeSqft: 0, status: p.status === "COMING_SOON" ? "COMING_SOON" : "LIVE",
    image: null, prototype: true,
  }));
  return NextResponse.json({ items: [...dbItems, ...protoItems] });
}
