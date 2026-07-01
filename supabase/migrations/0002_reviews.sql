-- Reviews table
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  booking_id  uuid references public.bookings(id) on delete set null,
  name        text not null,
  city        text,
  rating      int  not null check (rating between 1 and 5),
  comment     text not null,
  image_url   text,
  approved    boolean not null default false
);

alter table public.reviews enable row level security;

-- The public/anon client may read ONLY approved reviews. All inserts go through
-- the server (service_role), which bypasses RLS, so there is no insert policy.
create policy "Public can read approved reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (approved = true);
