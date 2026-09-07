-- ArchPlan Market schema, indexes, triggers, RLS, and storage policies.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('homeowner', 'architect', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.architect_approval_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.plan_status as enum ('draft', 'pending_review', 'published', 'rejected', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'paid', 'fulfilled', 'refunded', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payout_status as enum ('pending', 'processing', 'completed', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_type as enum ('main', 'gallery', 'floor_plan', 'exterior', 'interior', 'watermarked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.plan_file_type as enum ('pdf', 'dwg', 'dxf', 'jpg', 'png', 'skp', 'rvt', 'zip', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.architectural_style as enum (
    'modern', 'contemporary', 'traditional', 'farmhouse', 'mediterranean',
    'minimalist', 'craftsman', 'colonial', 'ranch', 'luxury', 'duplex', 'apartment'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.property_type as enum (
    'single_family', 'duplex', 'townhouse', 'multi_family', 'vacation_home', 'villa'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role public.user_role not null default 'homeowner',
  country text,
  bio text,
  phone text,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.architect_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  professional_name text not null,
  slug text not null unique,
  title text,
  biography text,
  location text,
  country text,
  years_experience integer,
  website text,
  portfolio_url text,
  instagram text,
  linkedin text,
  behance text,
  approval_status public.architect_approval_status not null default 'pending',
  rejection_reason text,
  specializations text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0
);

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  architect_id uuid not null references public.architect_profiles(id) on delete restrict,
  title text not null,
  slug text not null unique,
  description text not null,
  overview text,
  category_id uuid references public.categories(id) on delete set null,
  property_type public.property_type not null,
  architectural_style public.architectural_style not null,
  price numeric(10,2) not null check (price >= 0),
  bedrooms integer not null default 0,
  bathrooms numeric(4,1) not null default 0,
  floors integer not null default 1,
  floor_area integer not null default 0,
  lot_width numeric(8,2),
  lot_depth numeric(8,2),
  garage_spaces integer not null default 0,
  has_living_room boolean not null default true,
  has_dining_room boolean not null default true,
  has_kitchen boolean not null default true,
  has_office boolean not null default false,
  has_laundry boolean not null default true,
  has_balcony boolean not null default false,
  has_basement boolean not null default false,
  has_pool boolean not null default false,
  features text[] not null default '{}',
  included_items text[] not null default '{}',
  file_formats public.plan_file_type[] not null default '{}',
  delivery_information text,
  important_notes text,
  status public.plan_status not null default 'draft',
  featured boolean not null default false,
  review_notes text,
  average_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  sales_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plan_media (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  file_path text not null,
  media_type public.media_type not null default 'gallery',
  is_primary boolean not null default false,
  alt text,
  created_at timestamptz not null default now()
);

create table if not exists public.plan_files (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete restrict,
  file_path text not null,
  file_type public.plan_file_type not null,
  file_name text not null,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.plan_rooms (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  name text not null,
  width numeric(8,2),
  depth numeric(8,2),
  area numeric(10,2),
  notes text
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  subtotal numeric(10,2) not null,
  commission_percentage numeric(5,2) not null,
  platform_commission numeric(10,2) not null,
  architect_earnings numeric(10,2) not null,
  payment_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  currency text not null default 'USD',
  payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  plan_id uuid not null references public.plans(id) on delete restrict,
  architect_id uuid not null references public.architect_profiles(id) on delete restrict,
  price numeric(10,2) not null,
  commission_percentage numeric(5,2) not null,
  platform_commission numeric(10,2) not null,
  architect_earnings numeric(10,2) not null
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  payment_provider text not null,
  provider_transaction_id text,
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  plan_id uuid not null references public.plans(id) on delete restrict,
  order_id uuid not null references public.orders(id) on delete restrict,
  file_id uuid not null references public.plan_files(id) on delete restrict,
  downloaded_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  plan_id uuid not null references public.plans(id) on delete restrict,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  content text not null,
  verified_purchase boolean not null default false,
  architect_response text,
  architect_responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (buyer_id, plan_id)
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  architect_id uuid not null references public.architect_profiles(id) on delete restrict,
  amount numeric(10,2) not null check (amount > 0),
  status public.payout_status not null default 'pending',
  payout_method text not null default 'bank_transfer',
  notes text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.architect_balances (
  architect_id uuid primary key references public.architect_profiles(id) on delete cascade,
  available_balance numeric(12,2) not null default 0,
  lifetime_earnings numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists plans_status_idx on public.plans (status);
create index if not exists plans_featured_idx on public.plans (featured) where featured = true;
create index if not exists plans_style_idx on public.plans (architectural_style);
create index if not exists plans_type_idx on public.plans (property_type);
create index if not exists plans_architect_idx on public.plans (architect_id);
create index if not exists plans_category_idx on public.plans (category_id);
create index if not exists plans_price_idx on public.plans (price);
create index if not exists plans_created_idx on public.plans (created_at desc);
create index if not exists plans_search_idx on public.plans using gin (to_tsvector('english', title || ' ' || description));
create index if not exists plan_media_plan_idx on public.plan_media (plan_id);
create index if not exists plan_files_plan_idx on public.plan_files (plan_id);
create index if not exists favorites_user_idx on public.favorites (user_id);
create index if not exists orders_buyer_idx on public.orders (buyer_id);
create index if not exists order_items_architect_idx on public.order_items (architect_id);
create index if not exists reviews_plan_idx on public.reviews (plan_id);
create index if not exists downloads_buyer_idx on public.downloads (buyer_id);
create index if not exists architect_profiles_slug_idx on public.architect_profiles (slug);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists architect_profiles_updated_at on public.architect_profiles;
create trigger architect_profiles_updated_at before update on public.architect_profiles
for each row execute function public.set_updated_at();

drop trigger if exists plans_updated_at on public.plans;
create trigger plans_updated_at before update on public.plans
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth profile bootstrap
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'homeowner')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Review aggregates
-- ---------------------------------------------------------------------------
create or replace function public.refresh_plan_review_stats()
returns trigger as $$
declare
  target_plan uuid;
begin
  target_plan := coalesce(new.plan_id, old.plan_id);
  update public.plans
  set
    review_count = (select count(*) from public.reviews where plan_id = target_plan),
    average_rating = coalesce((select round(avg(rating)::numeric, 2) from public.reviews where plan_id = target_plan), 0)
  where id = target_plan;
  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists reviews_refresh_stats on public.reviews;
create trigger reviews_refresh_stats
after insert or update or delete on public.reviews
for each row execute function public.refresh_plan_review_stats();

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_suspended = false
  );
$$ language sql stable security definer set search_path = public;

create or replace function public.current_architect_id()
returns uuid as $$
  select id from public.architect_profiles where user_id = auth.uid() limit 1;
$$ language sql stable security definer set search_path = public;

create or replace function public.has_purchased_plan(target_plan uuid)
returns boolean as $$
  select exists (
    select 1
    from public.orders o
    join public.order_items i on i.order_id = o.id
    where o.buyer_id = auth.uid()
      and i.plan_id = target_plan
      and o.payment_status = 'succeeded'
  );
$$ language sql stable security definer set search_path = public;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.architect_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.platform_settings enable row level security;
alter table public.plans enable row level security;
alter table public.plan_media enable row level security;
alter table public.plan_files enable row level security;
alter table public.plan_rooms enable row level security;
alter table public.favorites enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.transactions enable row level security;
alter table public.downloads enable row level security;
alter table public.reviews enable row level security;
alter table public.payouts enable row level security;
alter table public.architect_balances enable row level security;

-- Profiles
create policy "profiles_select_own_or_public"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Architect profiles
create policy "architect_profiles_public_approved"
  on public.architect_profiles for select
  using (
    approval_status = 'approved'
    or user_id = auth.uid()
    or public.is_admin()
  );

create policy "architect_profiles_insert_own"
  on public.architect_profiles for insert
  with check (user_id = auth.uid() or public.is_admin());

create policy "architect_profiles_update_own"
  on public.architect_profiles for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Categories
create policy "categories_public_read"
  on public.categories for select
  using (true);

create policy "categories_admin_write"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Settings
create policy "settings_public_read"
  on public.platform_settings for select
  using (true);

create policy "settings_admin_write"
  on public.platform_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Plans
create policy "plans_public_published"
  on public.plans for select
  using (
    status = 'published'
    or architect_id = public.current_architect_id()
    or public.is_admin()
    or public.has_purchased_plan(id)
  );

create policy "plans_architect_insert"
  on public.plans for insert
  with check (
    architect_id = public.current_architect_id()
    or public.is_admin()
  );

create policy "plans_architect_update"
  on public.plans for update
  using (
    architect_id = public.current_architect_id()
    or public.is_admin()
  )
  with check (
    architect_id = public.current_architect_id()
    or public.is_admin()
  );

-- Plan media (previews only; originals stay in private storage)
create policy "plan_media_read"
  on public.plan_media for select
  using (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (
          p.status = 'published'
          or p.architect_id = public.current_architect_id()
          or public.is_admin()
          or public.has_purchased_plan(p.id)
        )
    )
  );

create policy "plan_media_write"
  on public.plan_media for all
  using (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  );

-- Plan files: metadata visible only to purchaser, owning architect, or admin
create policy "plan_files_select_restricted"
  on public.plan_files for select
  using (
    public.has_purchased_plan(plan_id)
    or exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  );

create policy "plan_files_write_owner"
  on public.plan_files for all
  using (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  );

create policy "plan_rooms_read"
  on public.plan_rooms for select
  using (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (
          p.status = 'published'
          or p.architect_id = public.current_architect_id()
          or public.is_admin()
          or public.has_purchased_plan(p.id)
        )
    )
  );

create policy "plan_rooms_write"
  on public.plan_rooms for all
  using (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.plans p
      where p.id = plan_id
        and (p.architect_id = public.current_architect_id() or public.is_admin())
    )
  );

-- Favorites / cart
create policy "favorites_own"
  on public.favorites for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "cart_own"
  on public.cart_items for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Orders
create policy "orders_select"
  on public.orders for select
  using (
    buyer_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.order_items i
      where i.order_id = id and i.architect_id = public.current_architect_id()
    )
  );

create policy "orders_insert_own"
  on public.orders for insert
  with check (buyer_id = auth.uid() or public.is_admin());

create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "order_items_select"
  on public.order_items for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
    or architect_id = public.current_architect_id()
    or public.is_admin()
  );

create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
    or public.is_admin()
  );

create policy "transactions_select"
  on public.transactions for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
    or public.is_admin()
  );

create policy "transactions_insert_own"
  on public.transactions for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
    or public.is_admin()
  );

create policy "downloads_own"
  on public.downloads for select
  using (buyer_id = auth.uid() or public.is_admin());

create policy "downloads_insert_own"
  on public.downloads for insert
  with check (buyer_id = auth.uid());

-- Reviews
create policy "reviews_public_read"
  on public.reviews for select
  using (true);

create policy "reviews_insert_purchaser"
  on public.reviews for insert
  with check (
    buyer_id = auth.uid()
    and public.has_purchased_plan(plan_id)
    and not exists (
      select 1 from public.plans p
      join public.architect_profiles a on a.id = p.architect_id
      where p.id = plan_id and a.user_id = auth.uid()
    )
  );

create policy "reviews_update_response"
  on public.reviews for update
  using (
    buyer_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.plans p
      where p.id = plan_id and p.architect_id = public.current_architect_id()
    )
  );

-- Payouts / balances
create policy "payouts_own"
  on public.payouts for select
  using (architect_id = public.current_architect_id() or public.is_admin());

create policy "payouts_insert_own"
  on public.payouts for insert
  with check (architect_id = public.current_architect_id());

create policy "payouts_admin_update"
  on public.payouts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "balances_own"
  on public.architect_balances for select
  using (architect_id = public.current_architect_id() or public.is_admin());

create policy "balances_admin_write"
  on public.architect_balances for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('plan-previews', 'plan-previews', true),
  ('plan-files', 'plan-files', false),
  ('category-images', 'category-images', true),
  ('portfolios', 'portfolios', true)
on conflict (id) do nothing;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_own_write"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "previews_public_read"
  on storage.objects for select
  using (bucket_id = 'plan-previews');

create policy "previews_authenticated_write"
  on storage.objects for insert
  with check (bucket_id = 'plan-previews' and auth.role() = 'authenticated');

create policy "previews_own_update"
  on storage.objects for update
  using (bucket_id = 'plan-previews' and auth.role() = 'authenticated');

create policy "category_images_public_read"
  on storage.objects for select
  using (bucket_id = 'category-images');

create policy "category_images_admin_write"
  on storage.objects for all
  using (bucket_id = 'category-images' and public.is_admin())
  with check (bucket_id = 'category-images' and public.is_admin());

create policy "portfolios_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolios');

create policy "portfolios_auth_write"
  on storage.objects for insert
  with check (bucket_id = 'portfolios' and auth.role() = 'authenticated');

-- Private plan files: no public select. Signed URLs are issued by the API
-- after a successful purchase check. Architects may upload their own files.
create policy "plan_files_no_public_read"
  on storage.objects for select
  using (
    bucket_id = 'plan-files'
    and (public.is_admin() or auth.role() = 'service_role')
  );

create policy "plan_files_architect_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'plan-files'
    and auth.role() = 'authenticated'
  );

-- ---------------------------------------------------------------------------
-- Default settings
-- ---------------------------------------------------------------------------
insert into public.platform_settings (key, value)
values
  ('platform_commission', '15'::jsonb),
  ('currency', '"USD"'::jsonb),
  ('payout_minimum', '50'::jsonb)
on conflict (key) do nothing;
