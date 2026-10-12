-- User management roles + customer enquiries.
ALTER TABLE backoffice_users DROP CONSTRAINT IF EXISTS backoffice_users_role_check;
ALTER TABLE backoffice_users ADD CONSTRAINT backoffice_users_role_check
  CHECK (role IN ('ADMIN','AGENT','PROPERTY','FINANCE','MARKETING','CONTENT'));

-- Primary admin moves from admin@foxyproperty.co.uk to info@foxyproperties.co.uk.
UPDATE backoffice_users SET email='info@foxyproperties.co.uk', updated_at=now()
  WHERE lower(email)='admin@foxyproperty.co.uk'
    AND NOT EXISTS (SELECT 1 FROM backoffice_users WHERE lower(email)='info@foxyproperties.co.uk');
UPDATE backoffice_users SET active=false, updated_at=now() WHERE lower(email)='admin@foxyproperty.co.uk';

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  enquiry_type text NOT NULL CHECK (enquiry_type IN ('BUY','SELL','INVESTMENT','LETTINGS','PROPERTY_MANAGEMENT','GENERAL')),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','READ','IN_PROGRESS','RESOLVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries(status);
CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries(created_at DESC);
