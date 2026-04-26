-- Bodyweight log entries per user
create table if not exists public.bodyweight_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  date       date not null,
  weight_kg  numeric(5,2) not null,
  created_at timestamptz default now(),
  unique (user_id, date)
);

alter table public.bodyweight_logs enable row level security;

create policy "Users manage own bodyweight logs"
  on public.bodyweight_logs
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
