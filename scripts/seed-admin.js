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

const email = process.env.ADMIN_EMAIL || "admin@foxyproperty.co.uk";
const password = process.env.ADMIN_PASSWORD || "Sa281616@";

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const hash = await bcrypt.hash(password, 12);
  await c.query(
    `INSERT INTO backoffice_users(email,name,password_hash,role,active)
     VALUES($1,$2,$3,'ADMIN',true)
     ON CONFLICT(email) DO UPDATE
       SET password_hash=EXCLUDED.password_hash, role='ADMIN', active=true`,
    [email, "FOXY Admin", hash]
  );
  console.log("admin seeded:", email);
  await c.end();
})().catch((e) => {
  console.error("seed-admin failed:", e.message);
  process.exit(1);
});
