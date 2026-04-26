-- Add weekly schedule to profiles.
-- Stored as a JSON object mapping day-of-week index (0=Sun … 6=Sat)
-- to a session ID from the regime's sessionOrder, or "rest".
-- Example: { "1": "upper-a", "3": "lower-a", "5": "upper-b" }
alter table public.profiles
  add column if not exists schedule jsonb;
