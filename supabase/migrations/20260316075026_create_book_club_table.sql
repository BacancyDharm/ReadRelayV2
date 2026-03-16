CREATE TYPE privacy_type AS ENUM ('public', 'private');

CREATE TABLE book_clubs (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    privacy privacy_type NOT NULL,
    max_members INT,
    genre TEXT[],
    "club_leader_id" uuid,
    CONSTRAINT "book_club_club_leader_id_fkey"
        FOREIGN KEY ("club_leader_id") REFERENCES "users"("id")
);