-- Review-invite token fields on bookings.
-- A token is generated when the admin marks a move completed; it expires after
-- 7 days and is single-use (reviewed_at is set once a review is submitted).
alter table public.bookings
  add column if not exists review_token text unique,
  add column if not exists review_token_expires_at timestamptz,
  add column if not exists reviewed_at timestamptz;
