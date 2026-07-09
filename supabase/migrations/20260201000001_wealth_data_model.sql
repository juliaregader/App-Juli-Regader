-- Trigger reutilizable para mantener updated_at al día.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Activos patrimoniales del usuario.
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null check (type in ('liquido', 'inversion', 'inmueble', 'otros')),
  value numeric(14, 2) not null default 0,
  currency text not null default 'EUR',
  is_liquid boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.assets enable row level security;

create trigger assets_set_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

create policy "assets_owner_or_admin_select"
  on public.assets for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "assets_owner_write"
  on public.assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Pasivos / deudas del usuario.
create table public.liabilities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null default 'otros',
  balance numeric(14, 2) not null default 0,
  monthly_payment numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.liabilities enable row level security;

create trigger liabilities_set_updated_at
  before update on public.liabilities
  for each row execute function public.set_updated_at();

create policy "liabilities_owner_or_admin_select"
  on public.liabilities for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "liabilities_owner_write"
  on public.liabilities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Objetivos financieros.
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  target_amount numeric(14, 2),
  target_date date,
  description text,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "goals_owner_or_admin_select"
  on public.goals for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "goals_owner_write"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Registro mensual: ingresos, gastos y foto del patrimonio de cada mes,
-- desde enero de 2026. Alimenta el dashboard y la evolución del patrimonio.
create table public.financial_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  month date not null,
  net_income numeric(14, 2) not null default 0,
  expenses jsonb not null default '{}'::jsonb,
  total_expenses numeric(14, 2) not null default 0,
  total_assets numeric(14, 2) not null default 0,
  total_liabilities numeric(14, 2) not null default 0,
  savings numeric(14, 2) generated always as (net_income - total_expenses) stored,
  net_worth numeric(14, 2) generated always as (total_assets - total_liabilities) stored,
  notes text,
  created_at timestamptz not null default now(),
  constraint financial_snapshots_month_is_first_day check (extract(day from month) = 1),
  constraint financial_snapshots_user_month_unique unique (user_id, month)
);

alter table public.financial_snapshots enable row level security;

create policy "financial_snapshots_owner_or_admin_select"
  on public.financial_snapshots for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "financial_snapshots_owner_write"
  on public.financial_snapshots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
