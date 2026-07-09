# JuliusCapital

Plataforma de organización patrimonial de Julià Regader: web pública de
servicios, área privada de clientes (onboarding, dashboard financiero,
estrategia de inversión, registro mensual), panel de administrador, reservas
con calendario, pagos con Stripe y multi-idioma (es/ca/en).

> **Aviso legal:** JuliusCapital es una herramienta de organización
> patrimonial con fines educativos e informativos. No constituye
> asesoramiento financiero, fiscal ni de inversión personalizado ni una
> recomendación de compra/venta de productos financieros. Las decisiones de
> inversión son responsabilidad del usuario.

## Estado del proyecto

- [x] Fase 0 — Setup: scaffolding, marca, página de estado de env vars
- [x] Fase 1 — Supabase: esquema, RLS, Auth, SMTP propio, rol admin
- [x] Fase 2 — Web pública (Home, Servicios, Consulta, Contacto, Legal)
- [x] Fase 3 — Onboarding (carrusel) + Mi perfil
- [x] Fase 4 — Dashboard financiero + indicadores
- [x] Fase 5 — Estrategia de inversión
- [x] Fase 6 — Registro mensual + evolución del patrimonio
- [x] Fase 7 — Panel de administrador
- [x] Fase 8 — i18n (es/ca/en) + divisas
- [x] Fase 9 — Calendario de reservas + notificaciones por email
- [x] Fase 10 — Stripe (Checkout + webhook)
- [ ] Fase 11 — Legal / RGPD / disclaimers finales
- [ ] Fase 12 — Pulido, responsive, QA

## Stack técnico

- **Frontend:** React + Vite + TypeScript + Tailwind CSS, React Router,
  TanStack Query, Recharts, lucide-react.
- **Backend/datos:** Supabase (Auth, Postgres + Row Level Security, Storage,
  Edge Functions).
- **Pagos:** Stripe (Checkout + webhook vía Edge Function).
- **Emails transaccionales:** Resend (SMTP de Supabase Auth + notificaciones
  de reserva desde Edge Functions).
- **i18n:** react-i18next — castellano (por defecto), català, English.

## Marca

- **Nombre:** JuliusCapital.
- **Eslogan** (3 opciones, la primera es la que usa la app por defecto):
  1. **"Organización financiera para tomar mejores decisiones."** ← por defecto
  2. "Claridad patrimonial para decidir con confianza."
  3. "Tu patrimonio, organizado. Tu futuro, decidido."
- **Color primario:** azul marino `#0A1F44` (hover `#12315F`), acento dorado
  `#C9A44C` y azul claro `#3E6DB5` para CTAs secundarios, fondo `#F7F8FA`.
- **Logo:** isotipo minimalista basado en una única "J" geométrica de trazo
  continuo (`src/components/brand/LogoMark.tsx`), con un punto de acento
  dorado. Usa `currentColor` para funcionar sobre fondo claro u oscuro.
  Versión estática para favicon en `public/favicon.svg`.

## Puesta en marcha en local

```bash
npm install
cp .env.example .env
# Completa .env con tus credenciales (ver tabla de variables abajo)
npm run dev
```

Disponible en `http://localhost:5173`. `npm run build` compila tipos +
produce el build de producción; `npm run typecheck` y `npm run lint`
verifican tipos y estilo sin generar archivos.

## Variables de entorno

Ver [`.env.example`](./.env.example). **Las que usa el frontend (Vite) deben
empezar por `VITE_`** — cualquier otra variable NUNCA debe leerse desde
`src/`, solo desde Edge Functions.

| Variable | Dónde se usa | Descripción |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Frontend | URL del proyecto Supabase (Project Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Clave pública `anon` (protegida por RLS) |
| `VITE_APP_URL` | Frontend | URL pública de producción, p. ej. `https://juliuscapital.vercel.app` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Frontend | Clave publicable de Stripe |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Clave con privilegios totales — **nunca** en el frontend |
| `APP_URL` | Edge Functions | Igual que `VITE_APP_URL` pero legible desde las Edge Functions (Stripe `success_url`/`cancel_url`) |
| `STRIPE_SECRET_KEY` | Edge Functions | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Edge Functions | Firma del webhook de Stripe |
| `RESEND_API_KEY` | Edge Functions + SMTP Supabase | Envío de emails transaccionales |
| `RESEND_FROM` | Edge Functions | Remitente verificado en Resend para los emails de reserva |
| `ADMIN_EMAIL` | Migraciones + Edge Functions | Email que recibe el rol `admin` automáticamente y las notificaciones de reserva |
| `ADMIN_PHONE` | Edge Functions (reservado) | Número de contacto del admin; hoy no se usa (ver WhatsApp más abajo) |
| `TWILIO_*` | — | **Ampliación futura.** No configurar todavía; ver `notifyAdmin()` |

## Checklist de despliegue (crítico — leer antes del primer deploy)

1. **Vercel → Project Settings → Environment Variables:** añade todas las
   `VITE_*` de la tabla anterior en **Production y Preview**, *antes* del
   primer build. Un build sin estas variables no falla, pero la app mostrará
   avisos de configuración en vez de datos reales (compruébalo en `/status`).
2. **Supabase → Authentication → URL Configuration:** fija **Site URL** al
   dominio de producción (`VITE_APP_URL`) y añade a **Redirect URLs** tanto
   ese dominio como `http://localhost:5173`.
3. **Emails de confirmación (SMTP propio, importante):** en
   **Authentication → Emails → SMTP Settings**, configura Resend en vez del
   proveedor por defecto de Supabase (límite muy bajo y cae en spam). Pasos:
   - Crea una cuenta en [resend.com](https://resend.com), verifica tu dominio
     remitente (añade los registros **SPF** y **DKIM** que te indique Resend
     en el DNS del dominio) y genera un `RESEND_API_KEY`.
   - En Supabase, host `smtp.resend.com`, puerto `465` (SSL) o `587`, usuario
     `resend`, contraseña = tu `RESEND_API_KEY`, remitente con el dominio
     verificado (p. ej. `no-reply@tudominio.com`).
   - Personaliza las plantillas **"Confirm signup"** y **"Reset password"**
     en castellano y confirma que los enlaces usan `{{ .SiteURL }}` (que
     apuntará a `VITE_APP_URL` una vez configurado el Site URL del paso 2).
4. **Primer deploy de verificación:** con solo las `VITE_*` configuradas,
   despliega y visita `/status` — debe mostrar "OK" en las variables de
   Supabase y en la conexión del cliente. Solo entonces continuar con el
   resto de fases (Stripe, Resend en Edge Functions, etc.).
5. **Stripe:** crea la cuenta en [stripe.com](https://stripe.com), activa el
   modo test primero, obtén `STRIPE_SECRET_KEY` / `VITE_STRIPE_PUBLISHABLE_KEY`
   en *Developers → API keys*, y configura el webhook (`Developers →
   Webhooks`, endpoint = la URL de la Edge Function `stripe-webhook`) para
   obtener `STRIPE_WEBHOOK_SECRET`. Detalle completo en la Fase 10.

## Base de datos, RLS y autenticación (Fase 1)

Las migraciones SQL están en [`supabase/migrations`](./supabase/migrations),
numeradas y aplicables en orden. Para aplicarlas:

```bash
supabase link --project-ref <tu-project-ref>
supabase db push
```

O copia el contenido de cada `.sql` (en orden) en el **SQL Editor** del panel
de Supabase.

### Esquema

- `app_settings` — fila única con el email que recibe el rol admin
  (`admin_email`, por defecto `juliaregader@gmail.com`). Sin políticas RLS:
  solo la lee el trigger `handle_new_user` (security definer).
- `profiles` — 1:1 con `auth.users`. `role` ('admin'|'client'), `language`,
  `currency`, `onboarding_completed`.
- `assets`, `liabilities`, `goals`, `financial_snapshots` (registro mensual,
  desde enero 2026), `investment_strategy`, `investment_assets` — datos
  patrimoniales del cliente.
- `bookings`, `payments` — reservas y pagos (detalle de calendario y Stripe
  en las Fases 9 y 10).

### Rol de administrador (seed automático)

Al registrarse, el trigger `handle_new_user` crea el perfil y le asigna
`role = 'admin'` automáticamente **si el email coincide con
`app_settings.admin_email`** (`juliaregader@gmail.com` por defecto); cualquier
otro email recibe `role = 'client'`. Julià puede registrarse desde `/registro`
igual que cualquier cliente y entra como admin sin pasos manuales. Para
cambiar el email admin más adelante:

```sql
update public.app_settings set admin_email = 'nuevo-email@ejemplo.com';
```

(Esto solo afecta a **nuevos** registros; para promocionar una cuenta ya
existente, actualiza su `role` directamente como admin desde el panel de
administración, cuando esté disponible en la Fase 7, o vía SQL.)

### RLS (Row Level Security)

Todas las tablas de datos de usuario tienen RLS habilitado y verificado:

- Cada cliente solo lee/escribe sus propias filas (`auth.uid() = user_id`,
  o `= id` en `profiles`).
- El helper `public.is_admin(uid)` (security definer) permite políticas de
  **lectura** para el admin sin caer en recursión de RLS.
- Un cliente no puede auto-promocionarse a `admin`: el trigger
  `enforce_profile_role_change` revierte cualquier cambio a la columna
  `role` que no provenga de un admin, aunque la política de UPDATE permita
  la operación en general.
- `bookings` admite `user_id` nulo (reserva sin cuenta) pero el `insert`
  exige `user_id is null or auth.uid() = user_id`: nadie puede reservar en
  nombre de otro usuario. Un índice único parcial (`bookings_unique_active_slot`)
  impide dos reservas activas en el mismo `start_at`.
- `payments` solo lo escribe el admin o la Edge Function del webhook de
  Stripe (con la `service_role` key, que bypassa RLS) — nunca el cliente.

### Autenticación

Registro con nombre, email, teléfono (opcional) y contraseña
(`/registro`), login (`/login`), recuperación de contraseña
(`/recuperar-contrasena` → `/restablecer-contrasena`). El registro exige
aceptar la política de privacidad y los términos de uso (checkbox
obligatorio). `ProtectedRoute` protege `/app/*` (requiere sesión) y
`AdminRoute` protege `/app/admin/*` (requiere `role = 'admin'`).

**Configuración obligatoria en Supabase → Authentication → URL Configuration:**
Site URL = `VITE_APP_URL` de producción; Redirect URLs = ese mismo dominio +
`http://localhost:5173`. Sin esto, los enlaces de confirmación de email y de
recuperación de contraseña no redirigirán correctamente.

## Onboarding y Mi perfil (Fase 3)

Al entrar por primera vez (`/app`), si `profile.onboarding_completed` es
`false` el cliente es redirigido a `/app/onboarding`: un carrusel de 5 pasos
(ingresos y gastos, activos, pasivos, objetivos, resumen) con barra de
progreso, cada campo con texto de ejemplo orientativo, y un enlace "Rellenar
más tarde" que marca el onboarding como completado sin exigir todos los
datos. Assets, liabilities y goals se guardan fila a fila en cuanto se
añaden/editan (sin esperar a un "Guardar" final); ingresos y gastos del mes
en curso se guardan como un `financial_snapshot` al pasar al siguiente paso.

Toda esta información es editable en cualquier momento desde **Mi perfil**
(`/app/perfil`), que reutiliza exactamente los mismos componentes
(`IncomeExpensesEditor`, `AssetsEditor`, `LiabilitiesEditor`, `GoalsEditor`)
en una sola página, además de los datos personales (nombre, teléfono,
idioma, divisa).

## Dashboard financiero (Fase 4)

`/app` (Dashboard) calcula en el cliente, a partir de activos/pasivos en vivo
y el último registro mensual:

- Patrimonio neto (Activos − Pasivos), ahorro mensual y tasa de ahorro,
  ratio de endeudamiento (cuotas de deuda / ingresos, semáforo verde <30 % /
  ámbar 30–40 % / rojo >40 %), cobertura de fondo de emergencia (activos
  líquidos / gastos mensuales, en meses), ratio de liquidez, peso de la
  vivienda sobre el patrimonio y ratio deuda/activos.
- Gráfico de distribución de activos (tarta) y evolución del patrimonio neto
  (línea), alimentado por `financial_snapshots`.
- Paleta de los gráficos validada con el script de accesibilidad del skill
  de visualización de datos (separación CVD y contraste verificados).

## Panel de administrador (Fase 7)

`/app/admin` (solo accesible con `role = 'admin'`, protegido por `AdminRoute`):

- **Clientes**: listado con búsqueda por nombre/email; ficha de detalle de
  solo lectura por cliente (KPIs, activos, pasivos, objetivos), reutilizando
  `useDashboardData` y los hooks de `features/wealth` con el `id` del
  cliente en vez del usuario autenticado — funciona porque las políticas RLS
  ya permiten `select` al admin sobre las tablas de cualquier usuario.
- **Reservas**: listado de todas las reservas con cambio de estado.
- **Pagos**: listado de pagos con botón "Marcar como pagado" (pensado para
  la sesión de 80 € con pago diferido, Fase 10).

No se usa la `service_role` key en el frontend en ningún momento: todo el
acceso del admin pasa por RLS con el helper `is_admin()`.

## Idiomas y divisas (Fase 8)

Selector de idioma (`LanguageSwitcher`) con castellano (por defecto), català e
English, usando `react-i18next` (`src/i18n`). **Cobertura de traducción en
esta fase:** toda la web pública (Home, Servicios, Consulta patrimonial,
Contacto, Reservas), las páginas de autenticación (registro, login,
recuperación de contraseña) y la navegación (cabecera pública, menú del área
privada, pestañas del admin) están completamente traducidas a los 3 idiomas,
incluido el disclaimer legal. El **área de trabajo patrimonial en sí**
(dashboard, estrategia, registro mensual, editores de activos/pasivos/
objetivos, tablas del admin) se mantiene en castellano por ahora: la
infraestructura i18n ya está lista (estructura de locales, `profile.language`
guardado en Supabase) para traducirla sin cambios de arquitectura cuando se
priorice.

**Divisas:** selector en "Mi perfil" (EUR por defecto, USD, GBP, CHF),
guardado en `profiles.currency`. `formatCurrency`/`formatPercent`
(`src/lib/format/currency.ts`) usan `Intl.NumberFormat` y toman el idioma
activo de la UI automáticamente, así que cualquier importe en la app respeta
tanto la divisa elegida como el idioma seleccionado.

## Calendario de reservas y notificaciones (Fase 9)

- **Disponibilidad configurable por el admin** (`/app/admin/disponibilidad`):
  franjas semanales (día, hora de inicio/fin, duración del slot) y bloqueos
  puntuales (día completo o un tramo horario). Seed inicial: L–V, 9:00–14:00
  y 16:00–19:00, slots de 1h — ajustable desde el panel en cualquier momento.
- **`public.get_available_slots(p_date)`**: función `security definer` que
  cruza franjas, bloqueos y reservas activas y devuelve solo los huecos
  libres, en la zona horaria `Europe/Madrid`. Es el único punto de lectura
  de disponibilidad expuesto a `anon`/`authenticated`: las tablas
  `availability_rules`/`availability_blocks`/`bookings` no son legibles
  directamente por el público (verificado con RLS contra un Postgres real).
- **Anti doble-reserva**: además del índice único parcial de la Fase 1, la
  propia función excluye cualquier hueco que se solape con una reserva
  activa, comprobado insertando una reserva y confirmando que ese hueco
  desaparece de los resultados.
- **Calendario público** (`/reservas`, `BookingCalendar`): selector de
  servicio, tira de próximos 21 días y huecos disponibles del día
  seleccionado; funciona con o sin sesión iniciada.
- **Notificaciones por email**: al confirmar una reserva se invoca la Edge
  Function `notify-booking`, que relee la reserva con la `service_role` key
  (nunca confía en lo que envía el cliente) y envía, vía Resend:
  (a) aviso al admin (`ADMIN_EMAIL`) y (b) confirmación al cliente.
- **`notifyAdmin()`** (`supabase/functions/_shared/notifyAdmin.ts`) es el
  único punto de notificación al admin. Hoy solo envía email; para añadir
  WhatsApp más adelante (Twilio, ver `.env.example` — `ADMIN_PHONE` y
  `TWILIO_*`, todavía sin configurar) solo hay que añadir una rama dentro de
  esa función, sin tocar el resto del código.

### Desplegar las Edge Functions

```bash
supabase functions deploy notify-booking
supabase secrets set RESEND_API_KEY=... ADMIN_EMAIL=juliaregader@gmail.com RESEND_FROM="JuliusCapital <no-reply@tudominio.com>"
```

`RESEND_FROM` debe usar un dominio verificado en Resend (mismo SPF/DKIM que
el SMTP de Supabase Auth, ver checklist de despliegue más arriba).

## Pagos con Stripe (Fase 10)

### Crear la cuenta de Stripe

1. Crea una cuenta en [stripe.com](https://dashboard.stripe.com/register).
   Empieza en **modo test** (no actives el modo real hasta haber probado
   todo el flujo).
2. En *Developers → API keys* copia la **Secret key** (`STRIPE_SECRET_KEY`,
   Edge Functions) y la **Publishable key** (`VITE_STRIPE_PUBLISHABLE_KEY`,
   frontend).
3. Despliega las funciones y añade el resto de secretos:
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy stripe-webhook
   supabase secrets set STRIPE_SECRET_KEY=sk_test_... APP_URL=https://tu-dominio.vercel.app
   ```
4. En *Developers → Webhooks*, añade un endpoint apuntando a
   `https://<tu-project-ref>.functions.supabase.co/stripe-webhook`, escucha
   el evento **`checkout.session.completed`**, y copia el **Signing secret**
   a `STRIPE_WEBHOOK_SECRET` (`supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`).

### Flujo de pago

- **Plan de organización patrimonial (329 €):** compra online con Stripe
  Checkout. El botón "Comprar el plan" en `/servicios` crea la sesión de
  pago desde la Edge Function `create-checkout-session` (nunca desde el
  frontend, que no conoce la clave secreta) y redirige a Stripe. Si el
  usuario no ha iniciado sesión, primero pasa por `/registro?plan=329`.
- **Sesión individual (80 €): reservar y pagar después.** La reserva en
  `/reservas` **no exige pago por adelantado** (`bookings.status =
  'reservada'`); tras confirmar, se ofrece un botón opcional "Pagar ahora"
  que abre el mismo flujo de Checkout vinculado a esa reserva. Si el
  cliente no paga online, el admin puede marcar el pago como recibido
  (transferencia/en persona) desde `/app/admin/pagos`.
- **Webhook (`stripe-webhook`):** verifica la firma con
  `stripe.webhooks.constructEventAsync` (compatible con Deno/Edge Runtime),
  y en `checkout.session.completed` marca el `payment` correspondiente como
  `pagado` y, si la sesión llevaba `metadata.booking_id`, actualiza también
  esa reserva a `status = 'pagada'`.
- **Páginas de resultado:** `/pago/exito` y `/pago/cancelado`.
- La `STRIPE_SECRET_KEY` y el `STRIPE_WEBHOOK_SECRET` solo existen como
  secretos de Edge Functions; el frontend únicamente usa la publishable key
  a través de `VITE_STRIPE_PUBLISHABLE_KEY`.

## Estructura del proyecto

```
src/
  components/
    brand/        Logo e isotipo ("J" geométrica)
    layout/        RootLayout/Header/Footer (público), PrivateLayout (área cliente)
    ui/            Componentes de interfaz reutilizables
  features/
    auth/          AuthProvider, useAuth, ProtectedRoute, AdminRoute, tipos
  pages/
    Home, Status (público)
    auth/          Register, Login, ForgotPassword, ResetPassword
    legal/         Aviso legal, privacidad, términos
    app/           Área privada de cliente (AppHome; onboarding/dashboard en fases siguientes)
    admin/         Panel de administrador (placeholder; Fase 7)
  lib/
    supabase/      Cliente Supabase (defensivo ante env vars ausentes)
    query/         Cliente TanStack Query
    env.ts         VITE_APP_URL, clave publicable de Stripe
  i18n/            Configuración react-i18next + locales es/ca/en
  router.tsx       Árbol de rutas completo
supabase/
  migrations/    Migraciones SQL (esquema + RLS), numeradas y aplicables en orden
  functions/     Edge Functions (Stripe webhook, notificaciones de reserva — Fases 9-10)
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel. Framework preset: **Vite**. Build
   command: `npm run build`. Output directory: `dist`.
2. Configura las variables de entorno (ver checklist arriba) en Production y
   Preview antes del primer build.
3. `vercel.json` ya incluye la reescritura para que las rutas de React
   Router funcionen al recargar o acceder directamente por URL.
4. Verifica `/status` tras el deploy.

## Marco legal del producto

Julià Regader no está registrado como asesor financiero ni gestor de
patrimonios. La aplicación no genera recomendaciones de inversión: el
usuario define siempre su propia estrategia. Ver la Fase 11 para el detalle
de política de privacidad, términos y RGPD/LOPDGDD.
