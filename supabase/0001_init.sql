
-- v0001: base schema
-- enable extension for UUIDs if necessary
create extension if not exists "pgcrypto";

-- Offers
create table if not exists subscription_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  price_from numeric,
  terms text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);
alter table subscription_offers enable row level security;
-- public read
drop policy if exists "public read offers" on subscription_offers;
create policy "public read offers" on subscription_offers for select using (true);

-- Requests
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('offer','custom')),
  offer_id uuid references subscription_offers(id) on delete set null,
  title text not null,
  details text,
  status text not null default 'Submitted',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table requests enable row level security;
-- user policies
drop policy if exists "user select own requests" on requests;
create policy "user select own requests" on requests for select using (user_id = auth.uid());
drop policy if exists "user insert own requests" on requests;
create policy "user insert own requests" on requests for insert with check (user_id = auth.uid());
drop policy if exists "user update own requests" on requests;
create policy "user update own requests" on requests for update using (user_id = auth.uid());

-- Request events
create table if not exists request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  type text not null,
  message text,
  by_admin boolean default false,
  created_at timestamp with time zone default now()
);
alter table request_events enable row level security;
-- user read their request events
drop policy if exists "user read own request events" on request_events;
create policy "user read own request events" on request_events
  for select using (exists (select 1 from requests r where r.id = request_id and r.user_id = auth.uid()));

-- Tickets
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  status text not null default 'Open',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table tickets enable row level security;
drop policy if exists "user select own tickets" on tickets;
create policy "user select own tickets" on tickets for select using (user_id = auth.uid());
drop policy if exists "user insert own tickets" on tickets;
create policy "user insert own tickets" on tickets for insert with check (user_id = auth.uid());
drop policy if exists "user update own tickets" on tickets;
create policy "user update own tickets" on tickets for update using (user_id = auth.uid());

-- Ticket messages
create table if not exists ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  sender text not null check (sender in ('user','admin')),
  body text not null,
  created_at timestamp with time zone default now()
);
alter table ticket_messages enable row level security;
-- user sees messages of own tickets
drop policy if exists "user read own ticket messages" on ticket_messages;
create policy "user read own ticket messages" on ticket_messages
  for select using (exists (select 1 from tickets t where t.id = ticket_id and t.user_id = auth.uid()));
-- user can insert messages as 'user' for own tickets
drop policy if exists "user insert own messages" on ticket_messages;
create policy "user insert own messages" on ticket_messages
  for insert with check (
    sender = 'user' and exists (select 1 from tickets t where t.id = ticket_id and t.user_id = auth.uid())
  );
