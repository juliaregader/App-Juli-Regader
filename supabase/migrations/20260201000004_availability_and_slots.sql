-- Reglas de disponibilidad semanal, configurables por el admin desde su panel.
create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6), -- 0 = domingo … 6 = sábado
  start_time time not null,
  end_time time not null,
  slot_duration_minutes int not null default 60 check (slot_duration_minutes > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint availability_rules_valid_range check (end_time > start_time)
);

alter table public.availability_rules enable row level security;

create policy "availability_rules_admin_all"
  on public.availability_rules for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Bloqueos puntuales (un día concreto, o un tramo horario concreto dentro de un día).
create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  block_date date not null,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz not null default now(),
  constraint availability_blocks_range_consistent check (
    (start_time is null and end_time is null) or (start_time is not null and end_time is not null and end_time > start_time)
  )
);

alter table public.availability_blocks enable row level security;

create policy "availability_blocks_admin_all"
  on public.availability_blocks for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Seed razonable por defecto: lunes a viernes, 9:00-14:00 y 16:00-19:00, slots de 1h.
-- Ajustable desde el panel de administrador en cualquier momento.
insert into public.availability_rules (weekday, start_time, end_time, slot_duration_minutes)
select weekday, start_time, end_time, 60
from (
  values
    (1, time '09:00', time '14:00'),
    (2, time '09:00', time '14:00'),
    (3, time '09:00', time '14:00'),
    (4, time '09:00', time '14:00'),
    (5, time '09:00', time '14:00'),
    (1, time '16:00', time '19:00'),
    (2, time '16:00', time '19:00'),
    (3, time '16:00', time '19:00'),
    (4, time '16:00', time '19:00'),
    (5, time '16:00', time '19:00')
) as seed(weekday, start_time, end_time);

-- Devuelve los huecos libres de un día concreto, cruzando reglas semanales,
-- bloqueos puntuales y reservas activas. security definer + acceso público
-- (anon/authenticated) para no exponer las tablas de disponibilidad ni de
-- reservas directamente: este es el único punto de lectura de huecos.
-- Zona horaria en la que se interpretan las franjas configuradas por el admin.
create or replace function public.get_available_slots(p_date date)
returns table (slot_start timestamptz, slot_end timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  with rules as (
    select
      r.start_time,
      r.end_time,
      r.slot_duration_minutes,
      greatest(
        0,
        floor(
          extract(epoch from (r.end_time - r.start_time)) / (r.slot_duration_minutes * 60)
        )::int
      ) as slot_count
    from public.availability_rules r
    where r.active
      and r.weekday = extract(dow from p_date)::smallint
  ),
  candidate_slots as (
    select
      (p_date::timestamp + rules.start_time + (n * make_interval(mins => rules.slot_duration_minutes)))
        as slot_start_local,
      (p_date::timestamp + rules.start_time + ((n + 1) * make_interval(mins => rules.slot_duration_minutes)))
        as slot_end_local
    from rules
    cross join lateral generate_series(0, rules.slot_count - 1) as n
    where rules.slot_count > 0
  ),
  full_day_blocked as (
    select 1 from public.availability_blocks b
    where b.block_date = p_date and b.start_time is null
  )
  select
    c.slot_start_local at time zone 'Europe/Madrid' as slot_start,
    c.slot_end_local at time zone 'Europe/Madrid' as slot_end
  from candidate_slots c
  where not exists (select 1 from full_day_blocked)
    and (c.slot_start_local at time zone 'Europe/Madrid') > now()
    and not exists (
      select 1 from public.availability_blocks b
      where b.block_date = p_date
        and b.start_time is not null
        and c.slot_start_local::time < b.end_time
        and c.slot_end_local::time > b.start_time
    )
    and not exists (
      select 1 from public.bookings bk
      where bk.status <> 'cancelada'
        and bk.start_at < (c.slot_end_local at time zone 'Europe/Madrid')
        and bk.end_at > (c.slot_start_local at time zone 'Europe/Madrid')
    )
  order by slot_start;
$$;

grant execute on function public.get_available_slots(date) to anon, authenticated;
