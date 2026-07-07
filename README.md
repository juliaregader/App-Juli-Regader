# Julià Regader — App de educación y organización patrimonial

Web-app de acompañamiento a las sesiones de educación financiera de Julià Regader.
Permite a cada cliente organizar y visualizar su propia situación patrimonial
(ingresos, gastos, activos y pasivos), sin sustituir en ningún caso el
asesoramiento profesional de la sesión.

> **Aviso legal:** esta herramienta tiene una finalidad exclusivamente educativa
> y de organización personal. No constituye asesoramiento financiero, fiscal ni
> de inversión. Las decisiones son responsabilidad exclusiva del usuario.

## Estado del proyecto

**Fase 0 — Fundamentos**, en curso de construcción por fases:

- [x] Fase 0 — Scaffolding, marca, i18n, tema claro/oscuro, layout base
- [x] Fase 1 — Autenticación (Supabase Auth) y roles (cliente/admin)
- [ ] Fase 2 — Onboarding patrimonial y modelo de datos
- [ ] Fase 3 — Dashboard, gráficos y KPIs
- [ ] Fase 4 — Estrategia de inversión y herramientas educativas
- [ ] Fase 5 — Exportación a Excel con fórmulas
- [ ] Fase 6 — Panel de administrador
- [ ] Fase 7 — Pulido, accesibilidad y despliegue

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

### Flujo de acceso

- El login es **sin contraseña**: el usuario introduce su nombre y email y
  recibe un enlace de acceso por email (Supabase Auth magic link); al abrirlo
  desde el mismo dispositivo, entra automáticamente. Se usa enlace en vez de
  código de un solo uso porque personalizar la plantilla para mostrar un
  código requiere configurar un proveedor SMTP externo (el correo gratuito de
  Supabase no permite editar plantillas).
- Todo usuario nuevo queda en estado `pending` y **no puede usar la app** hasta
  que el admin lo apruebe. Por ahora esa aprobación se hace manualmente en la
  tabla `profiles` desde el SQL Editor o el Table Editor de Supabase (cambiando
  `status` a `approved`); un panel de aprobación dedicado llega en la Fase 6.
- El **primer administrador** (Julià) debe promocionarse a sí mismo tras
  registrarse, ejecutando en el SQL Editor:

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
    layout/          AppShell, RootLayout, Disclaimer
    ui/              Componentes de interfaz reutilizables
  lib/
    auth/            AuthProvider, useProfile, guards de ruta por rol
    i18n/            Configuración i18next + locales (es, ca, en)
    query/           Cliente de TanStack Query
    theme/           Proveedor de tema claro/oscuro
    supabase/        Cliente de Supabase
  pages/
    auth/            Login (email + OTP), pendiente de aprobación
    admin/           Panel de administrador (placeholder, Fase 6)
  router.tsx         Rutas y protección por sesión/rol

supabase/
  migrations/        Migraciones SQL (perfiles, roles, RLS)
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build` · Output directory: `dist`.
4. Añade las variables de entorno de `.env.example` en *Project Settings > Environment Variables*.

## Marco legal del producto

Julià Regader no está registrado como asesor financiero ni gestor de
patrimonios. Por diseño, la aplicación **nunca genera recomendaciones de
inversión**: el cliente define siempre su propia estrategia y sus propias
clases de activo. Cualquier plantilla o ejemplo incluido en la app es
genérico y educativo (nunca instrumentos financieros concretos). Antes de
comercializar el producto, este enfoque debe validarse con un abogado
especializado.
