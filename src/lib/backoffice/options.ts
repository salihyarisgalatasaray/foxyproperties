import "server-only";
import { dbQuery } from "@/lib/db";
import { prototypeProperties } from "@/lib/properties";

export async function getPropertyLabels(): Promise<string[]> {
  const proto = prototypeProperties.map((p) => `${p.title} (${p.area})`);
  try {
    const r = await dbQuery<{ title: string; area: string }>(`SELECT title,area FROM properties ORDER BY created_at DESC LIMIT 300`);
    const db = r.rows.map((p) => `${p.title} (${p.area})`);
    return Array.from(new Set([...db, ...proto]));
  } catch {
    return proto;
  }
}
