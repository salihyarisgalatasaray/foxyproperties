import { NextResponse } from "next/server";
import { getObject } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Public read-through for property photos (path is app-prefixed; img tags can't send headers).
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.map(decodeURIComponent).join("/");
  try {
    const { buf, contentType } = await getObject(key);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
}
