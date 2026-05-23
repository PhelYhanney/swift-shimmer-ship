
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Admins can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Shipment status
create type public.shipment_status as enum (
  'pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'cancelled'
);

create type public.service_type as enum ('air', 'ocean', 'land');

-- Shipments
create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique,
  status public.shipment_status not null default 'pending',
  service public.service_type not null default 'land',
  customer_name text not null,
  customer_email text,
  customer_phone text,
  origin text not null,
  destination text not null,
  current_location text,
  weight_kg numeric(10,2),
  description text,
  estimated_delivery date,
  delivered_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shipments_tracking_idx on public.shipments (tracking_number);
create index shipments_status_idx on public.shipments (status);

alter table public.shipments enable row level security;

create policy "Public can view shipments by tracking number"
  on public.shipments for select
  to anon, authenticated
  using (true);

create policy "Admins can insert shipments"
  on public.shipments for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update shipments"
  on public.shipments for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete shipments"
  on public.shipments for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Shipment events
create table public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status public.shipment_status not null,
  location text,
  notes text,
  occurred_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index shipment_events_shipment_idx on public.shipment_events (shipment_id, occurred_at desc);

alter table public.shipment_events enable row level security;

create policy "Public can view shipment events"
  on public.shipment_events for select
  to anon, authenticated
  using (true);

create policy "Admins can insert events"
  on public.shipment_events for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update events"
  on public.shipment_events for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete events"
  on public.shipment_events for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Tracking requests log
create table public.tracking_requests (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null,
  shipment_id uuid references public.shipments(id) on delete set null,
  found boolean not null default false,
  user_agent text,
  created_at timestamptz not null default now()
);

create index tracking_requests_created_idx on public.tracking_requests (created_at desc);

alter table public.tracking_requests enable row level security;

create policy "Anyone can log a tracking request"
  on public.tracking_requests for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view tracking requests"
  on public.tracking_requests for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shipments_set_updated_at
  before update on public.shipments
  for each row execute function public.set_updated_at();

-- Auto-create initial event when shipment is created
create or replace function public.create_initial_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.shipment_events (shipment_id, status, location, notes, created_by)
  values (new.id, new.status, new.current_location, 'Shipment created', new.created_by);
  return new;
end;
$$;

create trigger shipments_initial_event
  after insert on public.shipments
  for each row execute function public.create_initial_event();

-- Auto-create event when status changes
create or replace function public.log_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.shipment_events (shipment_id, status, location, notes, created_by)
    values (new.id, new.status, new.current_location, 'Status updated', auth.uid());
    if new.status = 'delivered' and new.delivered_at is null then
      new.delivered_at = now();
    end if;
  end if;
  return new;
end;
$$;

create trigger shipments_log_status_change
  before update on public.shipments
  for each row execute function public.log_status_change();

-- Auto-assign admin role to the FIRST signup (bootstrap admin)
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_role();
