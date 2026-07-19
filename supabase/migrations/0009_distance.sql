-- Estimated driving distance (km, one way) for moving bookings, from OSRM.
alter table public.bookings
  add column if not exists distance_km numeric;
