create type book_status as enum ('going', 'completed');

create table book_club_status (
    id uuid primary key default gen_random_uuid(),
    club_id uuid not null references clubs(id) on delete cascade,
    book_id uuid not null references books(id) on delete restrict,
    staus book_status not null default 'going',
    added_at timestamptz not null default now(), 
    unique(club_id, book_id) 
);

create index idx_book_club_status_club_id on book_club_status(club_id);