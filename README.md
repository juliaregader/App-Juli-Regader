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
- [ ] Fase 1 — Supabase: esquema, RLS, Auth, SMTP propio, rol admin
- [ ] Fase 2 — Web pública (Home, Servicios, Consulta, Contacto, Legal)
- [ ] Fase 3 — Onboarding (carrusel) + Mi perfil
- [ ] Fase 4 — Dashboard financiero + indicadores
- [ ] Fase 5 — Estrategia de inversión
- [ ] Fase 6 — Registro mensual + evolución del patrimonio
- [ ] Fase 7 — Panel de administrador
- [ ] Fase 8 — i18n (es/ca/en) + divisas
- [ ] Fase 9 — Calendario de reservas + notificaciones por email
- [ ] Fase 10 — Stripe (Checkout + webhook)
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
| `STRIPE_SECRET_KEY` | Edge Functions | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Edge Functions | Firma del webhook de Stripe |
| `RESEND_API_KEY` | Edge Functions + SMTP Supabase | Envío de emails transaccionales |
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

## Estructura del proyecto

```
src/
  components/   Componentes reutilizables (brand, layout, ui, charts...)
  features/     Lógica de dominio por área (auth, wealth, booking, admin...)
  pages/        Páginas/rutas
  lib/          Clientes (Supabase, Query), helpers, tipos
  i18n/         Configuración react-i18next + locales es/ca/en
  hooks/        Hooks compartidos
supabase/
  migrations/   Migraciones SQL (esquema + RLS)
  functions/    Edge Functions (Stripe webhook, notificaciones de reserva)
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
