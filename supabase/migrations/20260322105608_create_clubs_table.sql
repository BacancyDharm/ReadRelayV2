create table clubs (
id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  leader_id   uuid not null references users(id) on delete restrict,
  name        text not null,
  description text,
  is_public   boolean not null default true,
  max_members integer not null default 20,
  genre_tags  text[] default '{}',
  created_at  timestamptz not null default now()
);

create index idx_clubs_leader_id on clubs (leader_id)