import "server-only";
import { dbQuery } from "@/lib/db";

export type DbProperty = {
  id: string;
  slug: string;
  title: string;
  description: string;
  area: string;
  price: number;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  status: "LIVE" | "COMING_SOON";
  photos: string[];
};

type Row = {
  id: string; slug: string; title: string; description: string; area: string;
  price: string; property_type: string; listing_type: string; bedrooms: number;
  bathrooms: number; size_sqft: number; status: string; photos: string[];
};

const map = (r: Row): DbProperty => ({
  id: r.id, slug: r.slug, title: r.title, description: r.description, area: r.area,
  price: Number(r.price), propertyType: r.property_type, listingType: r.listing_type,
  bedrooms: r.bedrooms, bathrooms: r.bathrooms, sizeSqft: r.size_sqft,
  status: r.status === "LIVE" ? "LIVE" : "COMING_SOON",
  photos: Array.isArray(r.photos) ? r.photos : [],
});

export function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "property";
}

export function mediaUrl(path: string) {
  return `/api/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export async function listProperties(onlyLive = false): Promise<DbProperty[]> {
  const r = await dbQuery<Row>(`SELECT * FROM properties ${onlyLive ? "WHERE status='LIVE'" : ""} ORDER BY created_at DESC`);
  return r.rows.map(map);
}

export async function getPropertyBySlug(slug: string): Promise<DbProperty | null> {
  const r = await dbQuery<Row>(`SELECT * FROM properties WHERE slug=$1 LIMIT 1`, [slug]);
  return r.rows[0] ? map(r.rows[0]) : null;
}

export type PropertyInput = Omit<DbProperty, "id" | "slug"> & { slug?: string };

export async function createProperty(d: PropertyInput): Promise<DbProperty> {
  let base = d.slug || slugify(d.title);
  let slug = base;
  for (let i = 2; (await dbQuery(`SELECT 1 FROM properties WHERE slug=$1`, [slug])).rowCount; i++) slug = `${base}-${i}`;
  const r = await dbQuery<Row>(
    `INSERT INTO properties(slug,title,description,area,price,property_type,listing_type,bedrooms,bathrooms,size_sqft,status,photos)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb) RETURNING *`,
    [slug, d.title, d.description, d.area, d.price, d.propertyType, d.listingType, d.bedrooms, d.bathrooms, d.sizeSqft, d.status, JSON.stringify(d.photos)]
  );
  return map(r.rows[0]);
}

export async function updateProperty(id: string, d: PropertyInput): Promise<DbProperty | null> {
  const r = await dbQuery<Row>(
    `UPDATE properties SET title=$2,description=$3,area=$4,price=$5,property_type=$6,listing_type=$7,bedrooms=$8,bathrooms=$9,size_sqft=$10,status=$11,photos=$12::jsonb,updated_at=now() WHERE id=$1 RETURNING *`,
    [id, d.title, d.description, d.area, d.price, d.propertyType, d.listingType, d.bedrooms, d.bathrooms, d.sizeSqft, d.status, JSON.stringify(d.photos)]
  );
  return r.rows[0] ? map(r.rows[0]) : null;
}

export async function deleteProperty(id: string) {
  await dbQuery(`DELETE FROM properties WHERE id=$1`, [id]);
}
