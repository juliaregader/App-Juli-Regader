-- Fase 1: perfiles, roles y aprobación de nuevos clientes por parte del admin.
--
-- Roles: 'client' (por defecto) y 'admin' (Julià).
-- Estado de aprobación: todo cliente nuevo entra en 'pending' y no puede usar
-- la app hasta que el admin lo apruebe manualmente (requisito de negocio:
-- el registro es por email + código OTP, pero el acceso real lo confirma
-- Julià por email/panel antes de dejar entrar al cliente).

create type public.user_role as enum ('client', 'admin');
create type public.approval_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'client',
  status public.approval_status not null default 'pending',
  base_currency text not null default 'EUR',
  locale text not null default 'es',
  theme text not null default 'system',
  dashboard_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Un perfil por usuario de auth.users. El rol y el estado de aprobación solo los puede cambiar un admin (ver trigger enforce_profile_role_change).';

-- ---------------------------------------------------------------------------
-- Helper: ¿el usuario autenticado es un admin aprobado?
-- SECURITY DEFINER + dueño de la tabla => sortea RLS al comprobarlo,
-- evitando el ciclo "para leer profiles necesito ya saber si soy admin".
-- ---------------------------------------------------------------------------
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'approved'
  );
$$;

-- ---------------------------------------------------------------------------
-- Trigger: crear automáticamente el perfil al registrarse en auth.users.
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Trigger: un usuario normal no puede auto-promocionarse ni auto-aprobarse.
-- Solo un admin aprobado puede cambiar `role` o `status` de un perfil.
-- ---------------------------------------------------------------------------
create function public.enforce_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger before_profile_update
  before update on public.profiles
  for each row execute function public.enforce_profile_role_change();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "Los usuarios ven su propio perfil"
  on public.profiles for select
  using (id = auth.uid());

create policy "Los admins ven todos los perfiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Los usuarios actualizan su propio perfil"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Los admins actualizan cualquier perfil"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- No se permite insert/delete directo desde el cliente: los perfiles se crean
-- solo vía el trigger on_auth_user_created y se eliminan en cascada con el
-- usuario de auth.users.

-- ---------------------------------------------------------------------------
-- Nota de despliegue: el primer administrador (Julià) debe promocionarse a sí
-- mismo manualmente una vez registrado, ejecutando en el SQL Editor de
-- Supabase (sustituyendo el email real):
--
--   update public.profiles
--   set role = 'admin', status = 'approved'
--   where id = (select id from auth.users where email = 'julia@example.com');
--
-- Esto es intencional: automatizar "el primer usuario en registrarse es
-- admin" sería un riesgo de seguridad.
