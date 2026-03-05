ALTER TABLE invitations ADD COLUMN IF NOT EXISTS program JSONB DEFAULT '[]'::jsonb;
