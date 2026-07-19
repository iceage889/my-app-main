-- Full pickup/dropoff addresses (from PDOK autocomplete) for moving bookings.
alter table public.bookings
  add column if not exists from_address text,
  add column if not exists to_address text;
