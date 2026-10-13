// E2E proof: drive the live app over HTTP, then confirm each write landed in Neon directly.
process.removeAllListeners("warning");
const fs = require("fs");
for (const l of fs.readFileSync(require("path").join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1");
}
const { Client } = require("pg");
const BASE = process.argv[2] || "http://localhost:3000";
const tag = `neon-e2e-${Date.now()}`;
const jar = {};
const call = async (path, method = "GET", body) => {
  const r = await fetch(BASE + path, { method, redirect: "manual", headers: { "content-type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: body && JSON.stringify(body) });
  for (const c of r.headers.getSetCookie()) { const [k, v] = c.split(";")[0].split("="); jar[k] = v; }
  return { status: r.status, json: await r.json().catch(() => ({})) };
};
const ok = (label, cond, extra = "") => { console.log(`${cond ? "PASS" : "FAIL"}  ${label} ${extra}`); if (!cond) process.exitCode = 1; };

(async () => {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const one = async (sql, args) => (await db.query(sql, args)).rows[0];

  const login = await call("/api/auth/login", "POST", { email: process.env.ADMIN_EMAIL || "info@foxyproperties.co.uk", password: process.env.ADMIN_PASSWORD });
  ok("admin login (bcrypt hash read from Neon)", login.status === 200, `HTTP ${login.status}`);

  const enq = await call("/api/enquiries", "POST", { full_name: tag, email: "neon.e2e@example.com", phone: "02080929196", enquiry_type: "GENERAL", message: "Neon end-to-end check" });
  const enqRow = await one("select id, status from enquiries where full_name=$1", [tag]);
  ok("public enquiry -> row in Neon", enq.status === 201 && enqRow?.id === enq.json.id, `HTTP ${enq.status} status=${enqRow?.status}`);

  const st = await call(`/api/backoffice/enquiries/${enqRow.id}`, "PATCH", { status: "IN_PROGRESS" });
  ok("status update persisted", st.status === 200 && (await one("select status from enquiries where id=$1", [enqRow.id])).status === "IN_PROGRESS");

  const note = await call(`/api/backoffice/enquiries/${enqRow.id}/notes`, "POST", { kind: "CALL", body: tag });
  ok("enquiry note -> enquiry_notes", note.status === 201 && !!(await one("select 1 x from enquiry_notes where body=$1", [tag])));

  const due = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
  const task = await call("/api/backoffice/tasks", "POST", { description: tag, due_date: due, priority: "HIGH" });
  const dash = await call("/api/backoffice/tasks");
  ok("task -> tasks table + shown overdue", task.status === 201 && dash.json.overdue.some((t) => t.description === tag && t.days_overdue >= 2));
  await call(`/api/backoffice/tasks/${task.json.id}`, "PATCH", { completed: true });
  ok("task completion persisted", !!(await one("select completed_at from tasks where id=$1", [task.json.id])).completed_at);

  const user = await call("/api/backoffice/users", "POST", { name: tag, email: `${tag}@example.com`, password: `T${Date.now()}x!`, role: "AGENT" });
  ok("user created -> backoffice_users", user.status === 201 && (await one("select role from backoffice_users where id=$1", [user.json.id]))?.role === "AGENT");

  // cleanup test rows
  await db.query("delete from enquiries where full_name=$1", [tag]);
  await db.query("delete from tasks where description=$1", [tag]);
  await db.query("delete from backoffice_users where name=$1", [tag]);
  ok("cleanup", true);
  await db.end();
})().catch((e) => { console.error("FAIL  e2e crashed:", e.message); process.exit(1); });
