-- Permanent per-user exercise overrides stored as a flat JSON map.
-- e.g. {"Barbell Bench Press": "Dumbbell Bench Press", "Overhead Press": "Arnold Press"}
alter table public.profiles
  add column if not exists overrides jsonb;
