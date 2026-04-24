create table if not exists public.sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  regime_id  uuid references public.regimes (id) on delete set null,
  date       date not null,
  notes      text
);

alter table public.sessions enable row level security;

create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own sessions"
  on public.sessions for delete
  using (auth.uid() = user_id);
