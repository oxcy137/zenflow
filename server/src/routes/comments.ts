import { Router } from 'express';
import { z } from 'zod';
import { query, run, get } from '../db.js';
import crypto from 'crypto';

export const commentsRouter = Router();

const CommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

commentsRouter.get('/:meditationId', async (req, res) => {
  try {
    const { meditationId } = req.params;
    const rows = await query(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.meditation_id = ?
       ORDER BY c.created_at DESC
       LIMIT 100`,
      [meditationId]
    );
    if (rows.length === 0) {
      res.json([]);
      return;
    }
    const ids = rows.map(r => r.id as string);
    const placeholders = ids.map(() => '?').join(',');
    const likeCounts = await query(
      `SELECT comment_id, COUNT(*) as count FROM comment_likes WHERE comment_id IN (${placeholders}) GROUP BY comment_id`,
      ids
    );
    const countMap: Record<string, number> = {};
    for (const row of likeCounts) {
      countMap[row.comment_id as string] = row.count as number;
    }
    const userId = (req as any).userId;
    let likedSet: Record<string, boolean> = {};
    if (userId) {
      const likeRows = await query(
        `SELECT comment_id FROM comment_likes WHERE user_id = ? AND comment_id IN (${placeholders})`,
        [userId, ...ids]
      );
      for (const row of likeRows) {
        likedSet[row.comment_id as string] = true;
      }
    }
    const commentsWithLikes = rows.map(row => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      username: row.username,
      createdAt: row.created_at,
      likes: countMap[row.id as string] ?? 0,
      liked: !!likedSet[row.id as string],
    }));
    res.json(commentsWithLikes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

commentsRouter.post('/:meditationId', async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { meditationId } = req.params;
    const data = CommentSchema.parse(req.body);
    const id = crypto.randomUUID();
    await run(
      'INSERT INTO comments (id, user_id, meditation_id, content) VALUES (?, ?, ?, ?)',
      [id, userId, meditationId, data.content]
    );
    const user = await get('SELECT username FROM users WHERE id = ?', [userId]);
    res.status(201).json({
      id,
      content: data.content,
      userId,
      username: (user as any)?.username ?? 'unknown',
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Comentario muy largo o vacío' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

commentsRouter.delete('/:id', async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { id } = req.params;
    const comment = await get('SELECT user_id FROM comments WHERE id = ?', [id]);
    if (!comment) {
      res.status(404).json({ error: 'Comentario no encontrado' });
      return;
    }
    if (comment.user_id !== userId) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }
    await run('DELETE FROM comment_likes WHERE comment_id = ?', [id]);
    await run('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

commentsRouter.post('/:id/like', async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { id } = req.params;
    const existing = await get(
      'SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = ?',
      [userId, id]
    );
    if (existing) {
      await run('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?', [userId, id]);
      res.json({ liked: false });
    } else {
      await run('INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)', [userId, id]);
      res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});
