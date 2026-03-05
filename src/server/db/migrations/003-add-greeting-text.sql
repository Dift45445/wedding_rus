ALTER TABLE invitations ADD COLUMN IF NOT EXISTS greeting_prefix VARCHAR(255) DEFAULT 'Уважаемые';
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS invitation_text TEXT DEFAULT 'Мы счастливы пригласить вас на нашу свадьбу!';
