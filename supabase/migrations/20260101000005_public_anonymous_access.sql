-- Pivote: web pública sin cuentas de cliente.
--
-- Los visitantes ya no se registran con email+teléfono: usan las
-- herramientas mediante una sesión anónima de Supabase Auth (invisible,
-- sin contraseña ni email visible). La primera visita crea un perfil
-- normal (role='client', status='approved' vía el trigger existente) y
-- todos los datos patrimoniales/estrategia/objetivos se guardan igual que
-- antes, ligados a ese id. Cuando el visitante deja su email (para
-- guardar resultados o reservar sesión) simplemente actualizamos su
-- propio perfil, que ya puede hacerlo por la política "Los usuarios
-- actualizan su propio perfil".
--
-- El pago (has_paid) deja de tener sentido: ya no hay plataforma
-- bloqueada por pago, así que se retira esa columna y su protección.

alter table public.profiles
  add column email text;

create or replace function public.enforce_profile_role_change()
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

alter table public.profiles
  drop column has_paid;
