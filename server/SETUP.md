# ZenFlow Server Setup

## 1. Supabase (Base de datos)

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Ir a **SQL Editor** → pegar contenido de `schema.sql` → Run
4. Ir a **Project Settings → Database** → anotar **Connection string** (URI)
5. Ir a **Project Settings → API** → anotar **Project URL** y **service_role key**

## 2. Variables de entorno

Copiar `.env.example` como `.env` y llenar:

```
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (service_role key)
JWT_SECRET=generate-a-random-secret-here
PORT=3001
```

## 3. Development

```bash
npm run dev
```

## 4. Deploy a Railway

1. Subir `server/` a GitHub
2. Ir a [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. En **Variables** agregar todas las env vars del paso 2
4. Railway te da una URL, ej: `https://zenflow-api.up.railway.app`

## 5. Frontend

En el frontend, crear `.env`:

```
VITE_API_URL=https://zenflow-api.up.railway.app
```
