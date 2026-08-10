import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import { verifyToken } from './auth.js';
import { authRouter } from './routes/auth.js';
import { sessionsRouter } from './routes/sessions.js';
import { commentsRouter } from './routes/comments.js';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(DIR, '../../dist');

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const IS_DEV = process.env.NODE_ENV !== 'production';

if (!IS_DEV) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", 'https://www.youtube.com', 'https://s.ytimg.com'],
        imgSrc: ["'self'", 'https://i.pinimg.com', 'https://img.youtube.com', 'https://i.ytimg.com', 'data:'],
        mediaSrc: ["'self'"],
        connectSrc: ["'self'", 'https://xpchqoergleqekbwkkfh.supabase.co', 'https://www.youtube.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", 'https://www.youtube.com'],
      },
    },
  }));
}

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(morgan('short'));
app.use(express.json({ limit: '10kb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intentá de nuevo en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos, intentá de nuevo en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

if (!IS_DEV) {
  app.use(express.static(DIST, {
    maxAge: '1y',
    immutable: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html') || filePath.endsWith('.webmanifest')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }
  (req as any).userId = payload.userId;
  next();
}

function optionalAuth(req: express.Request, _res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      (req as any).userId = payload.userId;
    }
  }
  next();
}

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/sessions', requireAuth, sessionsRouter);
app.use('/api/comments', optionalAuth, commentsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

await initDb();

app.listen(PORT, () => {
  console.log(`ZenFlow API running on http://localhost:${PORT}`);
});
