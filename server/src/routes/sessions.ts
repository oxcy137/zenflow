import { Router } from 'express';
import { z } from 'zod';
import { query, run } from '../db.js';
import crypto from 'crypto';

export const sessionsRouter = Router();

const CreateSessionSchema = z.object({
  meditationId: z.string().min(1).max(100),
  meditationTitle: z.string().min(1).max(200),
  duration: z.number().int().positive(),
  completed: z.boolean(),
});

sessionsRouter.get('/', async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const rows = await query(
      'SELECT id, meditation_id, meditation_title, duration, completed, created_at FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

sessionsRouter.post('/', async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const data = CreateSessionSchema.parse(req.body);
    const id = crypto.randomUUID();
    await run(
      'INSERT INTO sessions (id, user_id, meditation_id, meditation_title, duration, completed) VALUES (?, ?, ?, ?, ?, ?)',
      [id, userId, data.meditationId, data.meditationTitle, data.duration, data.completed ? 1 : 0]
    );
    res.status(201).json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

sessionsRouter.get('/stats', async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const totalSessions = await query(
      'SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND completed = 1',
      [userId]
    );
    const totalMinutes = await query(
      'SELECT COALESCE(SUM(duration), 0) as total FROM sessions WHERE user_id = ? AND completed = 1',
      [userId]
    );
    const byMeditation = await query(
      'SELECT meditation_id, meditation_title, COUNT(*) as count FROM sessions WHERE user_id = ? AND completed = 1 GROUP BY meditation_id, meditation_title ORDER BY count DESC',
      [userId]
    );
    res.json({
      totalSessions: (totalSessions[0] as any)?.count ?? 0,
      totalMinutes: Math.round(((totalMinutes[0] as any)?.total ?? 0) / 60),
      byMeditation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});
