import { Pool, type PoolClient, type QueryResultRow } from "pg";

let pool: Pool | undefined;
function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  return pool;
}
export async function dbQuery<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}
export async function dbTransaction<T>(fn:(client:PoolClient)=>Promise<T>) {
  const client=await getPool().connect();
  try { await client.query("BEGIN"); const value=await fn(client); await client.query("COMMIT"); return value; }
  catch(error){ await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}
