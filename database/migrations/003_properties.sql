-- Admin-managed property listings (photos are object-storage paths).
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  area text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  property_type text NOT NULL DEFAULT 'apartment',
  listing_type text NOT NULL DEFAULT 'buy',
  bedrooms int NOT NULL DEFAULT 0,
  bathrooms int NOT NULL DEFAULT 0,
  size_sqft int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'COMING_SOON',
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
