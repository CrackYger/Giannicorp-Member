
-- v0003: ticket_reads to track user read state
create table if not exists ticket_reads (
  user_id uuid not null references auth.users(id) on delete cascade,
  ticket_id uuid not null references tickets(id) on delete cascade,
  last_read_at timestamp with time zone default now(),
  primary key (user_id, ticket_id)
);

alter table ticket_reads enable row level security;

create policy if not exists "user read own readstate" on ticket_reads
  for select using (user_id = auth.uid());

create policy if not exists "user upsert own readstate" on ticket_reads
  for insert with check (user_id = auth.uid());

create policy if not exists "user update own readstate" on ticket_reads
  for update using (user_id = auth.uid());
