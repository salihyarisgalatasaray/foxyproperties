const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { Client } = require("pg");

function loadEnv() {
  const p = path.join(__dirname, "..", ".env.local");
  if (!process.env.DATABASE_URL && fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

loadEnv();

const email = process.env.ADMIN_EMAIL || "info@foxyproperties.co.uk";
const password = process.env.ADMIN_PASSWORD;

// Extra back-office admins, seeded only when their password env var is set.
const extraAdmins = [
  { email: "yaris@credys.co.uk", name: "Yaris", password: process.env.EXTRA_ADMIN_PASSWORD },
];

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const seed = async (em, nm, pw) => {
    const hash = await bcrypt.hash(pw, 12);
    await c.query(
      `INSERT INTO backoffice_users(email,name,password_hash,role,active)
       VALUES($1,$2,$3,'ADMIN',true)
       ON CONFLICT(email) DO NOTHING`,
      [em, nm, hash]
    );
    console.log("admin seeded:", em);
  };
  if (password) await seed(email, "FOXY Admin", password);
  else console.warn("seed-admin: ADMIN_PASSWORD not set, skipping primary admin");
  for (const a of extraAdmins) if (a.password) await seed(a.email, a.name, a.password);
  await c.end();
})().catch((e) => {
  console.error("seed-admin failed:", e.message);
  process.exit(1);
});
