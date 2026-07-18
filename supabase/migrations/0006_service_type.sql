-- Service type on bookings: 'moving' (default) or 'airport'.
-- Airport bookings also record the chosen route label and its flat rate.
alter table public.bookings
  add column if not exists service_type text not null default 'moving',
  add column if not exists route text,
  add column if not exists route_rate text;
