
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke execute on function public.set_updated_at() from anon, authenticated, public;

drop policy if exists "Anyone can log a tracking request" on public.tracking_requests;
create policy "Anyone can log a tracking request"
  on public.tracking_requests for insert
  to anon, authenticated
  with check (length(trim(tracking_number)) between 1 and 64);
