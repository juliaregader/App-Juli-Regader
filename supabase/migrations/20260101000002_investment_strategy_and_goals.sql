-- Fase 4: estrategia de inversión definida por el cliente y objetivos
-- financieros. Ambas tablas son "lienzos" que rellena el propio cliente: la
-- app nunca sugiere clases de activo, instrumentos ni importes (ver §2 del
-- marco legal del producto).

create table public.strategy_allocations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  asset_class text not null,
  target_percentage numeric(5, 2) not null check (target_percentage >= 0 and target_percentage <= 100),
  current_value numeric(14, 2) not null default 0 check (current_value >= 0),
  currency text not null default 'EUR',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.strategy_allocations enable row level security;

create policy "Dueño gestiona su estrategia"
  on public.strategy_allocations for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Admin lee todas las estrategias"
  on public.strategy_allocations for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  currency text not null default 'EUR',
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "Dueño gestiona sus objetivos"
  on public.goals for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Admin lee todos los objetivos"
  on public.goals for select
  using (public.is_admin());
