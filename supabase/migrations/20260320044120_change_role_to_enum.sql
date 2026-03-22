CREATE TYPE role AS ENUM ('LEADER', 'ADMIN', 'GUEST', 'MEMBER');

ALTER TABLE users
ALTER COLUMN role DROP DEFAULT;

ALTER TABLE users
-- Step 3: Add default back (must match enum exactly)
ALTER COLUMN role TYPE role USING role::text::role;

ALTER TABLE users
ALTER COLUMN role SET DEFAULT 'MEMBER';