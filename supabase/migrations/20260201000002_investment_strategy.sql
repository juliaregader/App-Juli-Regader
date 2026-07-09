-- Estrategia de inversión definida por el propio cliente (nunca recomendada
-- por la app: ver disclaimer). Una estrategia activa por usuario.
create table public.investment_strategy (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  name text not null default 'Mi estrategia',
  monthly_contribution numeric(14, 2) not null default 0,
  notes text,
  updated_at timestamptz not null default now()
);

alter table public.investment_strategy enable row level security;

create trigger investment_strategy_set_updated_at
  before update on public.investment_strategy
  for each row execute function public.set_updated_at();

create policy "investment_strategy_owner_or_admin_select"
  on public.investment_strategy for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "investment_strategy_owner_write"
  on public.investment_strategy for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Activos que componen la estrategia (% objetivo y aportación).
create table public.investment_assets (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references public.investment_strategy (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset_name text not null,
  target_pct numeric(5, 2) not null default 0 check (target_pct >= 0 and target_pct <= 100),
  amount numeric(14, 2) not null default 0,
  currency text not null default 'EUR',
  updated_at timestamptz not null default now()
);

alter table public.investment_assets enable row level security;

create trigger investment_assets_set_updated_at
  before update on public.investment_assets
  for each row execute function public.set_updated_at();

create policy "investment_assets_owner_or_admin_select"
  on public.investment_assets for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "investment_assets_owner_write"
  on public.investment_assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
