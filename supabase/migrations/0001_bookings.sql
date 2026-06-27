-- Bookings table
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  phone         text not null,
  email         text not null,
  from_city     text not null,
  to_city       text not null,
  move_date     date not null,
  move_time     text not null,
  out_of_region boolean not null default false,
  status        text not null default 'new'
);

-- Lock the table down. With RLS enabled and no policies, the anon/public client
-- has no access at all; only the service_role key (used server-side) can read or
-- write. Admin read access will be added with an authenticated policy in the
-- admin-panel slice.
alter table public.bookings enable row level security;
