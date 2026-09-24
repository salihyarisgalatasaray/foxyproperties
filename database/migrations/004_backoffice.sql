-- Back office management: clients CRM, appointments, offers, commissions.
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  budget numeric,
  preferred_areas text,
  interest text NOT NULL DEFAULT 'buy' CHECK (interest IN ('buy','rent')),
  status text NOT NULL DEFAULT 'WARM' CHECK (status IN ('HOT','WARM','COLD')),
  notes text,
  last_contact_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients(status);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  phone text,
  email text,
  property_label text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  agent text,
  notes text,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','COMPLETED','CANCELLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS appointments_starts_idx ON appointments(starts_at);

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_label text NOT NULL DEFAULT '',
  client_name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACCEPTED','REJECTED','NEGOTIATING')),
  counter_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS offers_property_idx ON offers(property_label);

CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_label text NOT NULL DEFAULT '',
  client_name text NOT NULL,
  deal_type text NOT NULL DEFAULT 'sale' CHECK (deal_type IN ('sale','rental')),
  price numeric NOT NULL DEFAULT 0,
  commission_pct numeric NOT NULL DEFAULT 0,
  commission_amount numeric NOT NULL DEFAULT 0,
  agent text,
  completed_on date NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS commissions_completed_idx ON commissions(completed_on DESC);
