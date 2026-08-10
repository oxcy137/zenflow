import { useState, useEffect, type FormEvent } from 'react';
import { api } from '@/api/client';
import type { Comment } from '@/types';
import { HeartFilledIcon, HeartOutlineIcon } from '@/components/Icons';

interface CommentSectionProps {
  meditationId: string;
}

export function CommentSection({ meditationId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const token = api.token;

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.comments.list(meditationId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [meditationId, token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const comment = await api.comments.create(meditationId, content.trim());
      setComments(prev => [{ ...comment, createdAt: new Date().toISOString() }, ...prev]);
      setContent('');
    } catch { /* ignore */ }
    setPosting(false);
  };

  const handleLike = async (commentId: string) => {
    try {
      const result = await api.comments.like(commentId);
      setComments(prev => prev.map(c =>
        c.id === commentId
          ? { ...c, liked: result.liked, likes: c.likes + (result.liked ? 1 : -1) }
          : c
      ));
    } catch { /* ignore */ }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 16, textAlign: 'left' }}>Comparte tu experiencia</h3>

      {token ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escribe un comentario..."
            maxLength={2000}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--gray-100)',
              fontSize: '0.9rem',
              outline: 'none',
              background: 'var(--white)',
              color: 'var(--gray-900)',
              transition: 'var(--transition)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--gray-100)'; }}
          />
          <button
            type="submit"
            disabled={!content.trim() || posting}
            className="btn-primary"
            style={{ padding: '12px 20px', fontSize: '0.85rem' }}
          >
            {posting ? '...' : 'Enviar'}
          </button>
        </form>
      ) : (
        <div className="card" style={{ padding: 16, marginBottom: 16, textAlign: 'center', border: '1.5px solid var(--gray-100)' }}>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Inicia sesión para compartir tu experiencia.</p>
        </div>
      )}

      {loading ? (
        <p className="muted" style={{ textAlign: 'center', padding: 20 }}>Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--gray-300)', padding: 20, fontSize: '0.85rem' }}>
          {token ? 'Sé el primero en comentar.' : ''}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comments.map(c => (
            <div key={c.id} className="card" style={{ padding: '16px', border: '1.5px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--red-400), var(--red-600))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {c.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-900)' }}>{c.username}</span>
                    <p className="muted" style={{ fontSize: '0.7rem', marginTop: 1 }}>
                      {new Date(c.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 10 }}>{c.content}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {token && (
                  <button
                    onClick={() => handleLike(c.id)}
                    style={{
                      background: 'none',
                      fontSize: '0.8rem',
                      color: c.liked ? 'white' : 'var(--gray-300)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 600,
                    }}
                  >
                    {c.liked ? <HeartFilledIcon style={{ width: 16, height: 16 }} /> : <HeartOutlineIcon style={{ width: 16, height: 16 }} />}
                    {c.likes}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
