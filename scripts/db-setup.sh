#!/usr/bin/env bash
# Idempotent DB bootstrap for the FOXY preview environment.
# Creates the Postgres role + database, applies migrations, seeds the admin user.
set -uo pipefail
cd "$(dirname "$0")/.."

pg_ctlcluster 15 main start >/dev/null 2>&1 || true

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
