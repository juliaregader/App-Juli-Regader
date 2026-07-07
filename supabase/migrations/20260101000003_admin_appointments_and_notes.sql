-- Fase 6: panel de administrador — agenda de visitas y notas privadas.

create type public.appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled');

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  admin_id uuid not null references public.profiles (id) on delete cascade,
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  status public.appointment_status not null default 'requested',
  amount numeric(10, 2) not null default 80,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

create policy "Admin gestiona todas las citas"
  on public.appointments for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "El cliente ve sus propias citas"
  on public.appointments for select
  using (client_id = auth.uid());

-- ---------------------------------------------------------------------------
create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_notes enable row level security;

create policy "Solo el admin ve y gestiona las notas"
  on public.admin_notes for all
  using (public.is_admin())
  with check (public.is_admin());
