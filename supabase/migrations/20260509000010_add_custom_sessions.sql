-- Per-user custom training sessions stored as a JSON array.
-- e.g. [{"id":"custom-1234","label":"Push Day"},{"id":"custom-5678","label":"Pull Day"}]
alter table public.profiles
  add column if not exists custom_sessions jsonb;
