# ZenFlow — Plan de Producción

## Stack
- **Frontend**: React 19 + Vite 6 + TypeScript
- **Backend**: Express 4 + TypeScript
- **DB**: Supabase (PostgreSQL)
- **Auth**: JWT + Google OAuth
- **Pagos**: Stripe
- **Mobile**: Capacitor (Android)
- **Hosting**: Railway (backend), Vercel o Railway (frontend)

---

## Fase 1 — Backend & Deploy

### 1.1 Migrar DB a Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Copiar `schema.sql` al SQL Editor
3. Anotar: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
4. Instalar `@supabase/supabase-js`
5. Reemplazar `server/src/db.ts` (SQLite → Supabase cliente)
6. Actualizar queries para PostgreSQL

### 1.2 Deploy Backend a Railway
1. Crear repo en GitHub con `server/`
2. Railway → New Project → Deploy from GitHub
3. Env vars: `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
4. Obtener URL tipo `https://zenflow-api.up.railway.app`

### 1.3 Frontend apunta a Railway
- `VITE_API_URL` = Railway URL
- `vite.config.ts` proxy solo para dev

### 1.4 Seguridad
- `express-rate-limit` en `/api/auth`
- `helmet` middleware
- Zod validation en endpoints
- `morgan` para logs

---

## Fase 2 — Google Auth

- Backend: `POST /api/auth/google` verifica token con `google-auth-library`
- Frontend: AuthModal envía credential al backend → guarda JWT de la app
- Consola Google Cloud: crear OAuth Client ID (Web + Android)

---

## Fase 3 — Pagos (Stripe)

- `POST /api/payments/create-checkout` → Stripe Checkout Session
- `POST /api/payments/webhook` → `checkout.session.completed`
- `GET /api/payments/status` → subscription status
- Sidebar "Membership" abre checkout

---

## Fase 4 — Android (Capacitor)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init zenflow com.zenflow.app
npx cap add android
npm run build && npx cap sync
```

- Splash screen, icono, nombre de app
- Google Sign-In nativo con `@capacitor-community/google-signin`
- Stripe en Android WebView o con plugin nativo

---

## Fase 5 — Publicar en Google Play

1. Build AAB: `cd android && ./gradlew bundleRelease`
2. Google Play Console: $25, store listing, screenshots
3. Política de privacidad
4. Enviar para revisión
