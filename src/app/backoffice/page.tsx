import { dbQuery } from "@/lib/db";
export const dynamic="force-dynamic";
async function stats(){try{const r=await dbQuery<{status:string;count:string}>(`SELECT status,count(*)::text count FROM leads GROUP BY status`);return r.rows}catch{return []}}
export default async function Dashboard(){const rows=await stats();const total=rows.reduce((n,r)=>n+Number(r.count),0);return <><p className="text-xs tracking-[.2em] text-neutral-500">OVERVIEW</p><h1 className="mt-2 font-serif text-4xl">Dashboard</h1><div className="mt-8 grid gap-4 sm:grid-cols-3"><Card label="Total leads" value={total}/><Card label="New" value={Number(rows.find(r=>r.status==='NEW')?.count||0)}/><Card label="Qualified" value={Number(rows.find(r=>r.status==='QUALIFIED')?.count||0)}/></div></>}
function Card({label,value}:{label:string;value:number}){return <div className="rounded-xl border border-black/10 bg-white p-6"><p className="text-sm text-neutral-500">{label}</p><p className="mt-3 text-3xl">{value}</p></div>}
