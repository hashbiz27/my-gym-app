-- Add explicit start/finish timestamps to sessions so the app can
-- distinguish in-progress sessions from completed ones on resume.
alter table public.sessions
  add column if not exists started_at  timestamptz,
  add column if not exists finished_at timestamptz;
