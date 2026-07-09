-- Pagos (Stripe). Las filas normalmente las crea/actualiza la Edge Function
-- del webhook usando la service role key (bypassa RLS). Los clientes solo
-- necesitan leer sus propios pagos; el admin los ve y gestiona todos.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  stripe_session_id text unique,
  amount numeric(10, 2) not null,
  currency text not null default 'EUR',
  service text not null check (service in ('plan_329', 'sesion_80')),
  status text not null default 'pendiente' check (status in ('pendiente', 'pagado', 'fallido', 'reembolsado')),
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "payments_owner_or_admin_select"
  on public.payments for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "payments_admin_write"
  on public.payments for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Reservas de sesión. user_id es nullable porque la sesión de 1h admite
-- reserva sin cuenta (se paga después / en persona, ver README Fase 10).
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  service text not null check (service in ('plan_329', 'sesion_80')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'reservada'
    check (status in ('reservada', 'confirmada', 'pagada', 'cancelada', 'completada')),
  payment_id uuid references public.payments (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint bookings_end_after_start check (end_at > start_at)
);

alter table public.bookings enable row level security;

-- Evita dobles reservas a nivel de base de datos: dos reservas activas no
-- pueden compartir el mismo start_at.
create unique index bookings_unique_active_slot
  on public.bookings (start_at)
  where status not in ('cancelada');

create policy "bookings_owner_or_admin_select"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Cualquiera (con o sin sesión) puede crear una reserva para sí mismo o
-- como invitado (user_id null); nunca para otro usuario.
create policy "bookings_insert_self_or_guest"
  on public.bookings for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "bookings_update_owner_or_admin"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_admin(auth.uid()))
  with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "bookings_delete_admin_only"
  on public.bookings for delete
  using (public.is_admin(auth.uid()));
