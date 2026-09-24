-- Lead -> Client conversion link (one client per source lead).
ALTER TABLE clients ADD COLUMN IF NOT EXISTS source_lead_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS clients_source_lead_uidx ON clients(source_lead_id) WHERE source_lead_id IS NOT NULL;
