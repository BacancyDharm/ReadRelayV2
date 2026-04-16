create table club_members (
    id uuid primary key default gen_random_uuid(),
    club_id uuid not null references clubs(id) on delete cascade,
    user_id uuid not null references users(id) on delete restrict,
    current_page integer not null default 0,
    joined_at timestamptz not null default now(),
    unique(club_id, user_id)
);

create index idx_club_members_club_id on club_members(club_id);
create index idx_club_members_user_id on club_members(user_id);

create table club_invitations (
    id uuid primary key default gen_random_uuid(),
    club_id uuid not null references clubs(id) on delete cascade,
    email text not null,
    token uuid not null default gen_random_uuid(),
    expires_at timestamptz not null default (now() + interval '7 days'),
    accepted_at timestamptz,
    created_at timestamptz not null default now(),
    unique(token)
);

create index idx_invitations_token on club_invitations(token);
create index idx_invitations_club on club_invitations(club_id);