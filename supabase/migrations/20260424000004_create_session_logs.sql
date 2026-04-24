create table if not exists public.session_logs (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.sessions (id) on delete cascade,
  exercise_name text not null,
  set_number    integer not null,
  reps          integer,
  weight        numeric
);

alter table public.session_logs enable row level security;

-- session_logs has no direct user_id column, so policies join through sessions
create policy "Users can view their own session logs"
  on public.session_logs for select
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = session_logs.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert their own session logs"
  on public.session_logs for insert
  with check (
    exists (
      select 1 from public.sessions
      where sessions.id = session_logs.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "Users can update their own session logs"
  on public.session_logs for update
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = session_logs.session_id
        and sessions.user_id = auth.uid()
    )
  );

create policy "Users can delete their own session logs"
  on public.session_logs for delete
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = session_logs.session_id
        and sessions.user_id = auth.uid()
    )
  );
