-- Landing page pública + acceso de pago (229€: sesión + plataforma).
--
-- El registro (con teléfono) es libre e instantáneo: ya no requiere
-- aprobación manual del admin para poder rellenar datos o reservar sesión.
-- El único filtro de acceso a la plataforma (panel, estrategia, objetivos...)
-- es el pago ("has_paid"), que hoy activa el admin manualmente desde su
-- panel (a la espera de conectar Stripe); en el futuro un webhook de Stripe
-- podrá hacer el mismo update sin intervención manual. El estado
-- pending/rejected se conserva por si el admin necesita bloquear a algún
-- cliente puntual, pero ya no es el estado de partida.

alter table public.profiles
  add column phone text,
  add column has_paid boolean not null default false;

alter table public.profiles
  alter column status set default 'approved';

-- ---------------------------------------------------------------------------
-- El registro ahora también guarda el teléfono introducido en el alta y
-- queda aprobado automáticamente (sin espera de revisión manual).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, status)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone', 'approved');
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Extiende la protección anti-auto-escalado: además de `role`/`status`,
-- ahora tampoco se puede auto-conceder `has_paid` sin ser admin.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role
      or new.status is distinct from old.status
      or new.has_paid is distinct from old.has_paid)
     and not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.has_paid := old.has_paid;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Cualquier usuario autenticado puede ver el perfil del admin (necesario
-- para saber a quién dirigir una solicitud de cita). No expone perfiles de
-- otros clientes, solo el/los que tengan role = 'admin'.
-- ---------------------------------------------------------------------------
create policy "Cualquiera ve el perfil del admin"
  on public.profiles for select
  using (role = 'admin');

-- ---------------------------------------------------------------------------
-- El cliente puede crear su propia solicitud de cita (queda en 'requested'
-- hasta que el admin la confirme desde su agenda).
-- ---------------------------------------------------------------------------
create policy "El cliente solicita sus propias citas"
  on public.appointments for insert
  with check (client_id = auth.uid() and status = 'requested');
