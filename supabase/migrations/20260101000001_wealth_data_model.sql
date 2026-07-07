-- Fase 2: modelo de datos patrimonial (ingresos, gastos, activos, pasivos)
-- y snapshots de patrimonio neto generados automáticamente.

alter table public.profiles
  add column onboarding_completed boolean not null default false;

-- ---------------------------------------------------------------------------
-- Ingresos y gastos
-- ---------------------------------------------------------------------------
create type public.income_category as enum ('fixed', 'variable');

create table public.income_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category public.income_category not null default 'fixed',
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'EUR',
  period_month date not null default date_trunc('month', now())::date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.expense_category as enum (
  'housing', 'utilities', 'transport', 'leisure', 'debt', 'savings', 'other'
);

create table public.expense_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category public.expense_category not null default 'other',
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'EUR',
  period_month date not null default date_trunc('month', now())::date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Activos y pasivos
-- ---------------------------------------------------------------------------
create type public.asset_category as enum ('liquid', 'investment', 'real_estate', 'other');

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category public.asset_category not null default 'liquid',
  value numeric(14, 2) not null check (value >= 0),
  currency text not null default 'EUR',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.liability_category as enum ('mortgage', 'loan', 'credit_card', 'other');

create table public.liabilities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category public.liability_category not null default 'other',
  value numeric(14, 2) not null check (value >= 0),
  currency text not null default 'EUR',
  interest_rate numeric(6, 3),
  monthly_payment numeric(14, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Snapshots de patrimonio neto (uno por perfil y día)
-- ---------------------------------------------------------------------------
create table public.net_worth_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  snapshot_date date not null default current_date,
  total_assets numeric(16, 2) not null default 0,
  total_liabilities numeric(16, 2) not null default 0,
  net_worth numeric(16, 2) generated always as (total_assets - total_liabilities) stored,
  created_at timestamptz not null default now(),
  unique (profile_id, snapshot_date)
);

-- ---------------------------------------------------------------------------
-- Trigger: recalcular y guardar el snapshot del día al cambiar activos/pasivos.
-- Nota: suma valores tal cual están guardados, sin conversión de divisa (cada
-- perfil trabaja en su divisa base; la conversión entre divisas distintas
-- queda fuera del alcance de esta fase).
-- ---------------------------------------------------------------------------
create function public.refresh_net_worth_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile_id uuid;
  assets_total numeric(16, 2);
  liabilities_total numeric(16, 2);
begin
  target_profile_id := coalesce(new.profile_id, old.profile_id);

  select coalesce(sum(value), 0) into assets_total
  from public.assets where profile_id = target_profile_id;

  select coalesce(sum(value), 0) into liabilities_total
  from public.liabilities where profile_id = target_profile_id;

  insert into public.net_worth_snapshots (profile_id, snapshot_date, total_assets, total_liabilities)
  values (target_profile_id, current_date, assets_total, liabilities_total)
  on conflict (profile_id, snapshot_date)
  do update set total_assets = excluded.total_assets,
                total_liabilities = excluded.total_liabilities;

  return coalesce(new, old);
end;
$$;

create trigger on_assets_changed
  after insert or update or delete on public.assets
  for each row execute function public.refresh_net_worth_snapshot();

create trigger on_liabilities_changed
  after insert or update or delete on public.liabilities
  for each row execute function public.refresh_net_worth_snapshot();

-- ---------------------------------------------------------------------------
-- RLS: cada tabla solo es visible/editable por su dueño; los admins leen todo.
-- ---------------------------------------------------------------------------
alter table public.income_items enable row level security;
alter table public.expense_items enable row level security;
alter table public.assets enable row level security;
alter table public.liabilities enable row level security;
alter table public.net_worth_snapshots enable row level security;

create policy "Dueño gestiona sus ingresos"
  on public.income_items for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Admin lee todos los ingresos"
  on public.income_items for select
  using (public.is_admin());

create policy "Dueño gestiona sus gastos"
  on public.expense_items for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Admin lee todos los gastos"
  on public.expense_items for select
  using (public.is_admin());

create policy "Dueño gestiona sus activos"
  on public.assets for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Admin lee todos los activos"
  on public.assets for select
  using (public.is_admin());

create policy "Dueño gestiona sus pasivos"
  on public.liabilities for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Admin lee todos los pasivos"
  on public.liabilities for select
  using (public.is_admin());

create policy "Dueño lee sus snapshots"
  on public.net_worth_snapshots for select
  using (profile_id = auth.uid());

create policy "Admin lee todos los snapshots"
  on public.net_worth_snapshots for select
  using (public.is_admin());

-- Los snapshots los escribe únicamente el trigger (security definer);
-- no se permite insert/update/delete directo desde el cliente.
