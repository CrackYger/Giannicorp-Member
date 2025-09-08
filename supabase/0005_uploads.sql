
-- v0005: uploads (bucket + link tables + policies)

-- 1) Storage bucket (private)
select storage.create_bucket('gc_uploads', public => false, file_size_limit => 5242880);

-- 2) Link tables
create table if not exists request_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  path text not null,
  mime text,
  size integer,
  created_at timestamp with time zone default now()
);
alter table request_files enable row level security;

create table if not exists ticket_files (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  path text not null,
  mime text,
  size integer,
  created_at timestamp with time zone default now()
);
alter table ticket_files enable row level security;

-- 3) Policies for link tables
-- Request files: user can read own; insert for own requests; admin read all
drop policy if exists "user read own request files" on request_files;
drop policy if exists "user insert own request files" on request_files;
drop policy if exists "admin read request files" on request_files;

create policy "user read own request files" on request_files
  for select using (exists (select 1 from requests r where r.id = request_id and r.user_id = auth.uid()));
create policy "user insert own request files" on request_files
  for insert with check (exists (select 1 from requests r where r.id = request_id and r.user_id = auth.uid()));
create policy "admin read request files" on request_files
  for select using (public.is_admin(auth.uid()));

-- Ticket files
drop policy if exists "user read own ticket files" on ticket_files;
drop policy if exists "user insert own ticket files" on ticket_files;
drop policy if exists "admin read ticket files" on ticket_files;

create policy "user read own ticket files" on ticket_files
  for select using (exists (select 1 from tickets t where t.id = ticket_id and t.user_id = auth.uid()));
create policy "user insert own ticket files" on ticket_files
  for insert with check (exists (select 1 from tickets t where t.id = ticket_id and t.user_id = auth.uid()));
create policy "admin read ticket files" on ticket_files
  for select using (public.is_admin(auth.uid()));

-- 4) Storage policies on storage.objects for our bucket
-- WARNING: must be on the storage.objects table in the 'storage' schema
drop policy if exists "uploads user read own" on storage.objects;
drop policy if exists "uploads user insert own folder" on storage.objects;
drop policy if exists "uploads admin read" on storage.objects;
drop policy if exists "uploads admin delete" on storage.objects;

create policy "uploads user read own"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'gc_uploads' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin(auth.uid())));

create policy "uploads user insert own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gc_uploads' and split_part(name, '/', 1) = auth.uid()::text);

create policy "uploads admin read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'gc_uploads' and public.is_admin(auth.uid()));

create policy "uploads admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gc_uploads' and (split_part(name, '/', 1) = auth.uid()::text or public.is_admin(auth.uid())));
