// Prints which DB the app's pooled DATABASE_URL reaches and its FOXY schema state.
process.removeAllListeners("warning");
const fs = require("fs");
for (const l of fs.readFileSync(require("path").join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1");
}
const { Client } = require("pg");
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const q = async (s) => (await c.query(s)).rows;
  console.log("host:", new URL(process.env.DATABASE_URL).hostname);
  console.log("server:", (await q("select current_database() db, split_part(version(),' ',2) v"))[0]);
  console.log("public tables:", (await q("select count(*)::int n from information_schema.tables where table_schema='public'"))[0].n);
  console.log("migrations:", (await q("select name from schema_migrations order by name")).map((r) => r.name).join(", "));
  console.log("users:", (await q("select email, role, active from backoffice_users order by email")));
  await c.end();
})().catch((e) => { console.error("db-check failed:", e.message); process.exit(1); });
