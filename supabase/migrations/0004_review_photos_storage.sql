-- Public storage bucket for optional review photos.
insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

-- Anyone may read review photos. Uploads happen server-side (service_role),
-- which bypasses RLS, so no insert policy is needed for the public.
create policy "Public read review photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'review-photos');
