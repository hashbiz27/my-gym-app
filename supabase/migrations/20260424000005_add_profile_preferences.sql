-- Add user preference columns to profiles so the app can read
-- regime, age class, weight class and sex without a separate table.
alter table public.profiles
  add column if not exists regime       text,
  add column if not exists age_class    text,
  add column if not exists weight_class text,
  add column if not exists sex          text not null default 'male';
