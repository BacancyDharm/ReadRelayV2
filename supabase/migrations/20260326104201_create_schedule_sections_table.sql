create table schedule_sections (
    id uuid primary key not null default gen_random_uuid(),
    club_book_id uuid not null references book_club_status(id) on delete cascade,
    section_number integer not null,
    title text, 
    start_page integer not null,
    end_page integer not null,
    deadline date not null,
    created_at timestamptz not null default now(),
    unique(club_book_id, section_number),
    constraint valid_page_range check (end_page > start_page)
);

create index idx_schedule_sections_club_book_id on schedule_sections(club_book_id);