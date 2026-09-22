import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireApiUser } from "@/lib/auth/session";
import { putObject, APP_PREFIX } from "@/lib/storage";

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function POST(req: Request) {
  if (!(await requireApiUser("properties:edit"))) return NextResponse.json({ ok: false }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ ok: false, error: "Max 8MB" }, { status: 400 });
  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ ok: false, error: "Only JPG, PNG, WEBP, GIF" }, { status: 400 });
  const path = `${APP_PREFIX}/properties/${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const res = await putObject(path, buf, file.type);
  return NextResponse.json({ ok: true, path: res.path, url: `/api/media/${res.path.split("/").map(encodeURIComponent).join("/")}` });
}
