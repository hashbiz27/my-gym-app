create table if not exists public.regimes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

alter table public.regimes enable row level security;

create policy "Users can view their own regimes"
  on public.regimes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own regimes"
  on public.regimes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own regimes"
  on public.regimes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own regimes"
  on public.regimes for delete
  using (auth.uid() = user_id);
