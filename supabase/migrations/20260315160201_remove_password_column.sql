-- supabase/migrations/[timestamp]_remove_password_column.sql
ALTER TABLE users DROP COLUMN IF EXISTS password;