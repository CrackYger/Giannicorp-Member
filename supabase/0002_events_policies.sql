
-- v0002: request_events insert by user + updated_at trigger
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'request_events' and policyname = 'user can insert non-admin events for own requests'
  ) then
    create policy "user can insert non-admin events for own requests" on request_events
      for insert with check (
        by_admin = false
        and exists (select 1 from requests r where r.id = request_id and r.user_id = auth.uid())
      );
  end if;
end $$;

create or replace function public.touch_requests_updated_at()
returns trigger as $$
begin
  update requests set updated_at = now() where id = new.request_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_touch_requests_updated on request_events;
create trigger trg_touch_requests_updated
  after insert on request_events
  for each row execute function public.touch_requests_updated_at();
