ALTER TABLE users
ADD COLUMN IF NOT EXISTS notification_preferences JSONB 
  NOT NULL 
  DEFAULT '{"new_member_joined": true, "member_fell_behind": true, "discussion_post": false}'::jsonb;