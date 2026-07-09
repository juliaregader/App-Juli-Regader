-- Extensiones necesarias
create extension if not exists pgcrypto;

-- Configuración de la app: un único registro con el email que recibe el rol admin.
create table public.app_settings (
  id boolean primary key default true constraint app_settings_singleton check (id),
  admin_email text not null default 'juliaregader@gmail.com',
  updated_at timestamptz not null default now()
);

insert into public.app_settings (id, admin_email) values (true, 'juliaregader@gmail.com');

alter table public.app_settings enable row level security;
-- Nadie necesita leer/escribir esta tabla desde el cliente: solo la usan
-- funciones security definer. Sin políticas => acceso denegado por defecto.

-- Perfiles de usuario (1:1 con auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  role text not null default 'client' check (role in ('admin', 'client')),
  language text not null default 'es' check (language in ('es', 'ca', 'en')),
  currency text not null default 'EUR',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper security definer: evita recursión de RLS al comprobar el rol admin.
create or replace function public.is_admin(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = p_uid and role = 'admin'
  );
$$;

-- Crea el perfil automáticamente al registrarse; asigna 'admin' si el email
-- coincide con app_settings.admin_email, 'client' en cualquier otro caso.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_email text;
begin
  select admin_email into v_admin_email from public.app_settings where id = true;

  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    case
      when v_admin_email is not null and lower(new.email) = lower(v_admin_email) then 'admin'
      else 'client'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impide que un cliente se auto-promocione a admin manipulando el UPDATE de
-- su propio perfil (la política RLS de abajo permite el UPDATE en general,
-- pero esta guarda revierte el cambio de rol si quien ejecuta no es admin).
create or replace function public.enforce_profile_role_immutability()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger enforce_profile_role_change
  before update on public.profiles
  for each row execute function public.enforce_profile_role_immutability();

-- RLS: cada usuario ve/edita su propio perfil; el admin ve todos.
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));

-- No hay política de INSERT/DELETE para clientes: el perfil solo se crea
-- vía el trigger (security definer, se ejecuta como propietario de la
-- tabla y por tanto no está sujeto a RLS) y no se borra desde el cliente.
