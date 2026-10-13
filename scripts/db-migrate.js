// Applies database/migrations/*.sql once each (tracked in schema_migrations).
// Safe on every start; never blocks app start (exits 0 on failure).
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = path.join(__dirname, "..", ".env.local");
if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1");
  }
}

const dir = path.join(__dirname, "..", "database", "migrations");

(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const c = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL });
  await c.connect();
  const fresh = !(await c.query(`SELECT to_regclass('public.schema_migrations') t`)).rows[0].t;
  await c.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  // DB created by the old untracked bootstrap: record existing files without re-running them.
  if (fresh && (await c.query(`SELECT to_regclass('public.backoffice_users') t`)).rows[0].t) {
    for (const f of files) await c.query(`INSERT INTO schema_migrations(name) VALUES($1) ON CONFLICT DO NOTHING`, [f]);
    console.log("db-migrate: baselined existing schema");
  }
  const done = new Set((await c.query(`SELECT name FROM schema_migrations`)).rows.map((r) => r.name));
  for (const f of files.filter((x) => !done.has(x))) {
    await c.query("BEGIN");
    try {
      await c.query(fs.readFileSync(path.join(dir, f), "utf8"));
      await c.query(`INSERT INTO schema_migrations(name) VALUES($1)`, [f]);
      await c.query("COMMIT");
      console.log("db-migrate: applied", f);
    } catch (e) {
      await c.query("ROLLBACK");
      throw new Error(`${f}: ${e.message}`);
    }
  }
  await c.end();
  console.log("db-migrate: up to date");
})().catch((e) => {
  console.error("db-migrate failed:", e.message);
});
