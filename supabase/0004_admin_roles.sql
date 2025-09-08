
-- v0004: admin roles & policies
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text,
  created_at timestamp with time zone default now()
);
alter table admin_users enable row level security;

create policy if not exists "admin reads own admin row" on admin_users
  for select using (user_id = auth.uid());

create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (select 1 from admin_users where user_id = uid);
$$;

-- admin policies across tables
create policy if not exists "admin manage offers" on subscription_offers
  for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy if not exists "admin read all requests" on requests
  for select using (is_admin(auth.uid()));
create policy if not exists "admin update all requests" on requests
  for update using (is_admin(auth.uid())) with check (true);

create policy if not exists "admin read all request events" on request_events
  for select using (is_admin(auth.uid()));
create policy if not exists "admin insert admin events" on request_events
  for insert with check (by_admin = true and is_admin(auth.uid()));

create policy if not exists "admin read all tickets" on tickets
  for select using (is_admin(auth.uid()));
create policy if not exists "admin update all tickets" on tickets
  for update using (is_admin(auth.uid())) with check (true);

create policy if not exists "admin read all messages" on ticket_messages
  for select using (is_admin(auth.uid()));
create policy if not exists "admin insert admin messages" on ticket_messages
  for insert with check (sender = 'admin' and is_admin(auth.uid()));
