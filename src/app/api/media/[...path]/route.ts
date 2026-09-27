import { NextResponse } from "next/server";
import { getObject } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Public read-through for property photos & home clips (path is app-prefixed;
// img/video tags can't send auth headers). Supports HTTP Range so <video> can seek.
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.map(decodeURIComponent).join("/");
  try {
    const { buf, contentType } = await getObject(key);
    const total = buf.length;
    const range = req.headers.get("range");
    const cache = "public, max-age=31536000, immutable";

    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
      if (isNaN(start) || start < 0) start = 0;
      if (isNaN(end) || end >= total) end = total - 1;
      if (start > end) { start = 0; end = total - 1; }
      const chunk = buf.subarray(start, end + 1);
      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunk.length),
          "Cache-Control": cache,
        },
      });
    }

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Length": String(total),
        "Cache-Control": cache,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
}
