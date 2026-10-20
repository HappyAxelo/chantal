-- Initial schema: inquiries, appointment requests, availability, admin profiles.
--
-- Access model
--   * Public visitors never talk to these tables directly. Form submissions go
--     through Next.js server actions that validate input and use the
--     service-role key (server-only), which bypasses RLS.
--   * RLS is enabled on every table with NO anon policies, so the public anon
--     key cannot read or write anything here.
--   * Authenticated users listed in `profiles` with an admin role may read and
--     manage records (useful for Supabase Studio / future client-side admin).
--
-- Service descriptions and articles are kept in versioned content files
-- (content/*.ts) rather than tables; see README "Content management".

create extension if not exists btree_gist;

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'admin', 'staff')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------- inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  name text not null check (char_length(name) between 2 and 120),
  organization text check (char_length(organization) <= 160),
  email text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (char_length(phone) <= 40),
  jurisdiction text check (char_length(jurisdiction) <= 120),
  service_category text not null check (service_category in ('procurement','contract','fidic','mou','notarial','documentation','general')),
  project_type text check (char_length(project_type) <= 160),
  timeframe text not null check (timeframe in ('urgent','within_month','one_to_three_months','flexible','unsure')),
  message text not null check (char_length(message) between 20 and 3000),
  contact_preference text not null check (contact_preference in ('email','phone')),
  privacy_notice_version text not null,
  status text not null default 'new' check (status in ('new','in_review','responded','closed','spam')),
  admin_notes text, -- private: never sent to clients
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index inquiries_service_idx on public.inquiries (service_category);
create trigger inquiries_touch before update on public.inquiries
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------ appointments
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  client_name text not null check (char_length(client_name) between 2 and 120),
  client_email text not null check (char_length(client_email) <= 200),
  client_phone text check (char_length(client_phone) <= 40),
  service_category text not null check (service_category in ('procurement','contract','fidic','mou','notarial','documentation','general')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null, -- business timezone used for display
  meeting_format text not null check (meeting_format in ('in_person','online','phone','to_be_agreed')),
  status text not null default 'pending' check (status in ('pending','confirmed','declined','cancelled','completed')),
  general_notes text not null check (char_length(general_notes) <= 1000), -- client's non-confidential reason
  admin_notes text, -- private: never sent to clients
  privacy_notice_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_time_order check (end_at > start_at),
  -- Prevents double-booking at the database level, even under concurrent requests.
  constraint appointments_no_overlap exclude using gist (
    tstzrange(start_at, end_at, '[)') with &&
  ) where (status in ('pending', 'confirmed'))
);

create index appointments_start_idx on public.appointments (start_at);
create index appointments_status_idx on public.appointments (status, start_at);
create trigger appointments_touch before update on public.appointments
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------ availability_rules
create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6), -- 0 = Sunday, business timezone
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint availability_rules_order check (end_time > start_time)
);

-- --------------------------------------------------------- blocked_periods
create table public.blocked_periods (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text, -- private
  created_at timestamptz not null default now(),
  constraint blocked_periods_order check (end_at > start_at)
);
create index blocked_periods_range_idx on public.blocked_periods using gist (tstzrange(start_at, end_at, '[)'));

-- ---------------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.availability_rules enable row level security;
alter table public.blocked_periods enable row level security;

-- Admins may read their own profile; profile roles are managed by the owner
-- in Supabase Studio (no self-service role changes).
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "inquiries: admin all" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "appointments: admin all" on public.appointments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "availability: admin all" on public.availability_rules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "blocked: admin all" on public.blocked_periods
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Defence in depth: the anon role gets no table privileges at all.
revoke all on public.profiles, public.inquiries, public.appointments,
  public.availability_rules, public.blocked_periods from anon;
