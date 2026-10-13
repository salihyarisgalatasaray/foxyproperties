#!/usr/bin/env bash
# Idempotent DB bootstrap for the FOXY preview environment.
# Creates the Postgres role + database, applies migrations, seeds the admin user.
set -uo pipefail
cd "$(dirname "$0")/.."

# External database (e.g. Neon): only run tracked migrations + seed.
if ! grep -qE '^DATABASE_URL="?postgres(ql)?://[^@]+@localhost' .env.local; then
  node scripts/db-migrate.js && node scripts/seed-admin.js || true
  echo "db-setup complete (external database)"
  exit 0
fi

pg_ctlcluster 15 main start >/dev/null 2>&1 || sudo -u postgres pg_ctlcluster 15 main start >/dev/null 2>&1 || true

# Wait until Postgres actually accepts connections (avoids a boot race where
# the runner proceeds before the cluster is ready and seeding silently fails).
for i in $(seq 1 30); do
  pg_isready -h localhost -p 5432 -q && break
  sleep 1
done

DB_PASS=$(grep -E '^DATABASE_URL=' .env.local | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')

sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='foxy'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE foxy LOGIN PASSWORD '${DB_PASS}'"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='foxy'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE foxy OWNER foxy"

for f in database/migrations/*.sql; do
  PGPASSWORD="$DB_PASS" psql -U foxy -h localhost -d foxy -f "$f" >/dev/null 2>&1 || true
done

node scripts/seed-admin.js || true
echo "db-setup complete"
