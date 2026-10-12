-- Enquiry notes/reply log + dashboard tasks & follow-ups.
CREATE TABLE IF NOT EXISTS enquiry_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'NOTE' CHECK (kind IN ('NOTE','CALL','EMAIL','MEETING')),
  body text NOT NULL,
  author_id uuid REFERENCES backoffice_users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiry_notes_enquiry_idx ON enquiry_notes(enquiry_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  related_type text NOT NULL DEFAULT 'TEXT' CHECK (related_type IN ('CLIENT','PROPERTY','TEXT')),
  related_id uuid,
  related_label text NOT NULL DEFAULT '',
  due_date date NOT NULL,
  assigned_user_id uuid REFERENCES backoffice_users(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH','MEDIUM','LOW')),
  completed_at timestamptz,
  created_by uuid REFERENCES backoffice_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tasks_due_idx ON tasks(due_date) WHERE completed_at IS NULL;
CREATE INDEX IF NOT EXISTS tasks_assigned_idx ON tasks(assigned_user_id);
