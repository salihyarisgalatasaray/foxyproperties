import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role,Permission } from "./permissions";
import { can } from "./permissions";
const COOKIE="foxy_bo_session";
type Session={sub:string;email:string;name:string;role:Role;exp:number};
function secret(){const s=process.env.BACKOFFICE_SESSION_SECRET;if(!s||s.length<32)throw new Error("BACKOFFICE_SESSION_SECRET must be at least 32 characters");return s}
function b64(v:string){return Buffer.from(v).toString("base64url")}
function sign(body:string){return crypto.createHmac("sha256",secret()).update(body).digest("base64url")}
export function createSessionToken(user:Omit<Session,"exp">){const payload=b64(JSON.stringify({...user,exp:Date.now()+1000*60*60*8}));return `${payload}.${sign(payload)}`}
export function readSessionToken(token?:string):Session|null{if(!token)return null;const [payload,sig]=token.split(".");if(!payload||!sig)return null;const expected=sign(payload);if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;try{const s=JSON.parse(Buffer.from(payload,"base64url").toString()) as Session;return s.exp>Date.now()?s:null}catch{return null}}
export async function currentUser(){return readSessionToken((await cookies()).get(COOKIE)?.value)}
export async function requireUser(permission?:Permission){const user=await currentUser();if(!user)redirect("/admin-login");if(permission&&!can(user.role,permission))redirect("/backoffice?denied=1");return user}
export async function requireApiUser(permission?:Permission){const user=await currentUser();if(!user)return null;if(permission&&!can(user.role,permission))return null;return user}
export const sessionCookie={name:COOKIE,options:{httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*8}};
