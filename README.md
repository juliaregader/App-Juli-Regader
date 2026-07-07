# JuliusCapital — App de educación y organización patrimonial

Web-app de acompañamiento a las sesiones de educación financiera de Julià Regader.
Permite a cada cliente organizar y visualizar su propia situación patrimonial
(ingresos, gastos, activos y pasivos), sin sustituir en ningún caso el
asesoramiento profesional de la sesión.

> **Aviso legal:** esta herramienta tiene una finalidad exclusivamente educativa
> y de organización personal. No constituye asesoramiento financiero, fiscal ni
> de inversión. Las decisiones son responsabilidad exclusiva del usuario.

## Estado del proyecto

**Las 8 fases previstas están completas.** Web-app funcional de principio a
fin, lista para probarse con datos reales y desplegarse:

- [x] Fase 0 — Scaffolding, marca, i18n, tema claro/oscuro, layout base
- [x] Fase 1 — Autenticación (Supabase Auth) y roles (cliente/admin)
- [x] Fase 2 — Onboarding patrimonial y modelo de datos
- [x] Fase 3 — Dashboard, gráficos, KPIs y personalización del panel
- [x] Fase 4 — Estrategia de inversión y herramientas educativas
- [x] Fase 5 — Exportación a Excel con fórmulas
- [x] Fase 6 — Panel de administrador
- [x] Fase 7 — Pulido, accesibilidad y despliegue

## Stack técnico

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend/datos:** Supabase (Auth, Postgres con RLS, Storage)
- **Gráficos:** Recharts (a partir de la Fase 3)
- **Exportación:** ExcelJS (a partir de la Fase 5)
- **Formularios:** React Hook Form + Zod (a partir de la Fase 1)
- **Datos remotos:** TanStack Query (a partir de la Fase 1)
- **i18n:** i18next / react-i18next — catalán, español (por defecto) e inglés

## Puesta en marcha

### Requisitos

- Node.js 20+
- Una cuenta y proyecto de [Supabase](https://supabase.com) (necesario a partir de la Fase 1)

### Instalación

```bash
npm install
cp .env.example .env
# Completa .env con la URL y la clave anónima de tu proyecto Supabase
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Scripts disponibles

| Script            | Descripción                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo con hot reload         |
| `npm run build`    | Compilación de tipos + build de producción    |
| `npm run preview`  | Sirve el build de producción localmente       |
| `npm run lint`     | Linter (ESLint)                               |
| `npm run typecheck`| Verificación de tipos sin generar archivos    |

## Variables de entorno

Ver [`.env.example`](./.env.example). Ninguna clave secreta debe usarse desde el
cliente: solo la URL del proyecto y la clave `anon` (pública, protegida por RLS).

## Base de datos y autenticación (Supabase)

Las migraciones SQL están en [`supabase/migrations`](./supabase/migrations). Para
aplicarlas:

```bash
# Con la Supabase CLI, apuntando a tu proyecto remoto
supabase link --project-ref <tu-project-ref>
supabase db push
```

O simplemente copia el contenido del `.sql` en el **SQL Editor** del panel de
Supabase.

### Verificación de RLS (Row Level Security)

Todas las tablas con datos de usuario (`profiles`, `income_items`,
`expense_items`, `assets`, `liabilities`, `net_worth_snapshots`,
`strategy_allocations`, `goals`, `appointments`, `admin_notes`) tienen RLS
habilitado, y se ha revisado que:

- Un cliente solo puede leer/escribir filas donde `profile_id` (o `id` en
  `profiles`) coincide con su propio `auth.uid()` — verificado revisando cada
  política una por una y comprobando que ninguna usa `using (true)` ni omite
  el filtro por usuario.
- `admin_notes` no tiene ninguna política de lectura para clientes: un cliente
  que consulte esa tabla recibe siempre cero filas (RLS deniega por defecto
  sin política aplicable), confirmando que las notas del admin son
  verdaderamente privadas.
- Un cliente no puede auto-promocionarse a `admin` ni auto-aprobar su cuenta:
  el trigger `enforce_profile_role_change` revierte cualquier cambio a las
  columnas `role`/`status` que no venga de un admin, aunque la política RLS
  de "actualizar mi propio perfil" permita el `UPDATE` en general.
- Las inserciones llevan siempre `with check (profile_id = auth.uid())`, así
  que aunque el cliente manipule la petición para intentar escribir con el
  `profile_id` de otro usuario, la base de datos la rechaza.
- Ninguna tabla tiene RLS habilitado sin al menos una política (lo que
  bloquearía todo acceso, incluido el del propio dueño).

### Flujo de acceso

- El login es **sin contraseña**: el usuario introduce su nombre y email y
  recibe un enlace de acceso por email (Supabase Auth magic link); al abrirlo
  desde el mismo dispositivo, entra automáticamente. Se usa enlace en vez de
  código de un solo uso porque personalizar la plantilla para mostrar un
  código requiere configurar un proveedor SMTP externo (el correo gratuito de
  Supabase no permite editar plantillas).
- Todo usuario nuevo queda en estado `pending` y **no puede usar la app** hasta
  que el admin lo apruebe desde el panel de administrador (listado de clientes
  con botones de aprobar/rechazar).
- El **primer administrador** (Julià) debe promocionarse a sí mismo tras
  registrarse, ejecutando en el SQL Editor (los siguientes admins, si los
  hubiera, ya no lo necesitan):

  ```sql
  update public.profiles
  set role = 'admin', status = 'approved'
  where id = (select id from auth.users where email = 'TU_EMAIL_AQUI');
  ```
- En **Authentication → URL Configuration** del panel de Supabase, añade la URL
  de desarrollo (`http://localhost:5173`) y la de producción en Vercel a
  **Site URL** / **Redirect URLs**, o el enlace de acceso no redirigirá bien.

## Estructura del proyecto

```
src/
  assets/logo/       Isotipo SVG de la marca
  components/
    brand/           Logo e isotipo
    charts/          Gráficos Recharts reutilizables (línea, barras, donut)
    dashboard/        KpiCard, InfoTooltip, CustomizePanel
    export/          Botón de exportación a Excel
    layout/          AppShell, RootLayout, MainNav, Disclaimer
    tools/           Calculadoras educativas (interés compuesto, FIRE, deuda, 50/30/20)
    ui/              Componentes de interfaz reutilizables
  lib/
    admin/           Tipos y hooks del panel de administrador
    auth/            AuthProvider, useProfile, guards de ruta por rol
    dashboard/       Preferencias de personalización del panel
    export/          Generación del libro Excel (ExcelJS)
    i18n/            Configuración i18next + locales (es, ca, en)
    format/          Formateo de divisas por locale
    query/           Cliente de TanStack Query
    theme/           Proveedor de tema claro/oscuro
    tools/           Funciones puras de cálculo (interés compuesto, amortización)
    supabase/        Cliente de Supabase
    wealth/          Tipos y hooks de ingresos, gastos, activos, pasivos, KPIs
  pages/
    auth/            Login (email + OTP), pendiente de aprobación
    onboarding/       Carrusel patrimonial (ingresos, gastos, activos, pasivos, resumen)
    goals/           Objetivos financieros
    strategy/        Constructor de estrategia de inversión
    tools/           Página de herramientas educativas
    glossary/        Glosario financiero
    admin/           Panel de administrador: clientes, ficha de cliente, agenda
  router.tsx         Rutas y protección por sesión/rol

supabase/
  migrations/        Migraciones SQL (perfiles, roles, RLS, modelo patrimonial,
                     estrategia, objetivos, citas y notas de admin)
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build` · Output directory: `dist`.
4. Añade las variables de entorno de `.env.example` en *Project Settings > Environment Variables*
   (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
5. El archivo [`vercel.json`](./vercel.json) ya incluye la reescritura
   necesaria para que las rutas de React Router (`/wealth`, `/admin`, etc.)
   funcionen al recargar la página o acceder directamente por URL, en vez de
   dar un 404.
6. En **Authentication → URL Configuration** de Supabase, añade la URL de
   producción (`https://tu-dominio.vercel.app`) a **Site URL** / **Redirect
   URLs**, igual que hiciste con `localhost:5173` en desarrollo.

## Marco legal del producto

Julià Regader no está registrado como asesor financiero ni gestor de
patrimonios. Por diseño, la aplicación **nunca genera recomendaciones de
inversión**: el cliente define siempre su propia estrategia y sus propias
clases de activo. Cualquier plantilla o ejemplo incluido en la app es
genérico y educativo (nunca instrumentos financieros concretos). Antes de
comercializar el producto, este enfoque debe validarse con un abogado
especializado.
