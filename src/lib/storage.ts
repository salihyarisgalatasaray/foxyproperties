import "server-only";

const BASE = (process.env.INTEGRATION_PROXY_URL || "").trim() || "https://integrations.emergentagent.com";
const STORAGE_URL = BASE.replace(/\/$/, "") + "/objstore/api/v1/storage";
const KEY = process.env.EMERGENT_LLM_KEY;
export const APP_PREFIX = "foxy-property";

let storageKey: string | undefined;

async function init(force = false): Promise<string> {
  if (storageKey && !force) return storageKey;
  const r = await fetch(`${STORAGE_URL}/init`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ emergent_key: KEY }),
  });
  if (!r.ok) throw new Error(`storage init failed: ${r.status}`);
  storageKey = (await r.json()).storage_key as string;
  return storageKey;
}

export async function putObject(path: string, data: Buffer, contentType: string) {
  let key = await init();
  let r = await fetch(`${STORAGE_URL}/objects/${path}`, {
    method: "PUT",
    headers: { "X-Storage-Key": key, "Content-Type": contentType },
    body: new Uint8Array(data),
  });
  if (r.status === 404) {
    key = await init(true);
    r = await fetch(`${STORAGE_URL}/objects/${path}`, { method: "PUT", headers: { "X-Storage-Key": key, "Content-Type": contentType }, body: new Uint8Array(data) });
  }
  if (!r.ok) throw new Error(`storage put failed: ${r.status}`);
  return (await r.json()) as { path: string; size: number; etag: string };
}

export async function getObject(path: string): Promise<{ buf: Buffer; contentType: string }> {
  let key = await init();
  let r = await fetch(`${STORAGE_URL}/objects/${path}`, { headers: { "X-Storage-Key": key } });
  if (r.status === 404) {
    key = await init(true);
    r = await fetch(`${STORAGE_URL}/objects/${path}`, { headers: { "X-Storage-Key": key } });
  }
  if (!r.ok) throw new Error(`storage get failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  return { buf, contentType: r.headers.get("content-type") || "application/octet-stream" };
}
