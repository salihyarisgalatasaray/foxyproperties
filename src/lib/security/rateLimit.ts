import "server-only";
import crypto from "node:crypto";
import { dbQuery } from "@/lib/db";
export async function rateLimit(rawKey:string,limit=8,windowMinutes=15){
 const pepper=process.env.RATE_LIMIT_SECRET||process.env.BACKOFFICE_SESSION_SECRET;if(!pepper)throw new Error("RATE_LIMIT_SECRET is not configured");
 const key=crypto.createHmac("sha256",pepper).update(rawKey).digest("hex");
 const r=await dbQuery<{hits:number}>(`INSERT INTO request_limits(key_hash,hits) VALUES($1,1) ON CONFLICT(key_hash) DO UPDATE SET hits=CASE WHEN request_limits.window_started_at < now()-($2::text||' minutes')::interval THEN 1 ELSE request_limits.hits+1 END, window_started_at=CASE WHEN request_limits.window_started_at < now()-($2::text||' minutes')::interval THEN now() ELSE request_limits.window_started_at END RETURNING hits`,[key,String(windowMinutes)]);
 return r.rows[0].hits<=limit;
}
