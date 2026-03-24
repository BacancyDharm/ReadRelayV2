create table books (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    google_volume_id text unique,
    author text not null,
    description text,
    page_count integer,
    cover_url text,
    isbn_13 text unique,
    isbn_10 text,
    created_at timestamptz not null default now()
);