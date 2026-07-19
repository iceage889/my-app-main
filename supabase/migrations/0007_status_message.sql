-- Optional message stored with a status change (accepted note / cancel reason).
alter table public.bookings
  add column if not exists status_message text;
