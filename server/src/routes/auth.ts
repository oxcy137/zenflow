import { Router } from 'express';
import { z } from 'zod';
import { run, get } from '../db.js';
import { hashPassword, verifyPassword, generateToken } from '../auth.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const googleClient = new OAuth2Client();

export const authRouter = Router();

const RegisterSchema = z.object({
  email: z.string().email().max(254),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/register', async (req, res) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const existing = await get('SELECT id FROM users WHERE email = ? OR username = ?', [data.email, data.username]);
    if (existing) {
      res.status(409).json({ error: 'Email o usuario ya registrado' });
      return;
    }
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(data.password);
    await run('INSERT INTO users (id, email, username, password_hash) VALUES (?, ?, ?, ?)', [id, data.email, data.username, passwordHash]);
    const token = generateToken(id);
    res.status(201).json({ token, user: { id, email: data.email, username: data.username } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = await get('SELECT id, email, username, password_hash FROM users WHERE email = ?', [data.email]);
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    const valid = await verifyPassword(data.password, user.password_hash as string);
    if (!valid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    const token = generateToken(user.id as string);
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

authRouter.post('/google', async (req, res) => {
  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
      res.status(500).json({ error: 'Google OAuth no configurado' });
      return;
    }

    const { credential } = req.body;
    if (typeof credential !== 'string' || !credential) {
      res.status(400).json({ error: 'Credencial inválida' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Token inválido' });
      return;
    }

    const googleId = payload.sub;
    const email = payload.email;
    const username = payload.name?.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
      ?? `user_${googleId.slice(0, 8)}`;
    const avatarUrl = payload.picture ?? null;

    const existingGoogle = await get(
      'SELECT id, email, username, avatar_url FROM users WHERE google_id = ?',
      [googleId]
    );

    if (existingGoogle) {
      await run(
        'UPDATE users SET avatar_url = COALESCE(?, avatar_url), last_login = NOW() WHERE id = ?',
        [avatarUrl, existingGoogle.id]
      );
      const token = generateToken(existingGoogle.id as string);
      res.json({
        token,
        user: {
          id: existingGoogle.id,
          email: existingGoogle.email,
          username: existingGoogle.username,
          avatarUrl: existingGoogle.avatar_url,
        },
      });
      return;
    }

    const existingEmail = await get(
      'SELECT id, email, username, avatar_url FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail) {
      await run(
        'UPDATE users SET google_id = ?, avatar_url = COALESCE(?, avatar_url), last_login = NOW() WHERE id = ?',
        [googleId, avatarUrl, existingEmail.id]
      );
      const token = generateToken(existingEmail.id as string);
      res.json({
        token,
        user: {
          id: existingEmail.id,
          email: existingEmail.email,
          username: existingEmail.username,
          avatarUrl: existingEmail.avatar_url,
        },
      });
      return;
    }

    const isUsernameTaken = await get(
      'SELECT 1 FROM users WHERE username = ?',
      [username]
    );
    const finalUsername = isUsernameTaken
      ? `${username}_${googleId.slice(0, 6)}`
      : username;

    const id = crypto.randomUUID();
    await run(
      'INSERT INTO users (id, email, username, google_id, avatar_url, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, finalUsername, googleId, avatarUrl, '']
    );

    const token = generateToken(id);
    res.status(201).json({
      token,
      user: { id, email, username: finalUsername, avatarUrl },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Autenticación con Google falló' });
  }
});
