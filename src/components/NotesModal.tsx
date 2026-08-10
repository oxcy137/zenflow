import { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface NotesModalProps {
  onClose: () => void;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'zenflow-notes';

export function NotesModal({ onClose }: NotesModalProps) {
  const { t, lang } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setNotes(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addNote = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const note: Note = {
      id: crypto.randomUUID(),
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    persist([note, ...notes]);
    setText('');
  };

  const deleteNote = (id: string) => {
    persist(notes.filter(n => n.id !== id));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang !== 'es' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 300, padding: 20, paddingBottom: 60,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none',
          borderRadius: 24,
          padding: 28,
          maxWidth: 400,
          width: '100%',
          maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{t('notes.title')}</h2>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={t('notes.placeholder2')}
            rows={3}
            style={{
              flex: 1, padding: 12, borderRadius: 12,
              border: '1px solid var(--glass-border)',
              fontSize: '0.88rem', resize: 'none',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: 'var(--text)',
              outline: 'none', fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) addNote(); }}
          />
          <button
            onClick={addNote}
            disabled={!text.trim()}
            style={{
              alignSelf: 'flex-end', padding: '10px 16px',
              borderRadius: 12,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: 'white', fontWeight: 700, fontSize: '0.82rem',
              border: 'none', cursor: 'pointer', opacity: text.trim() ? 1 : 0.4,
              transition: '0.2s',
            }}
          >
            {t('notes.save')}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notes.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 20 }}>
              {t('notes.empty2')}
            </p>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5, margin: 0, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {note.content}
                </p>
                <button
                  onClick={() => deleteNote(note.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.75rem',
                    padding: '2px 6px', borderRadius: 6, flexShrink: 0,
                    opacity: 0.5,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  ×
                </button>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '4px 0 0', opacity: 0.6 }}>
                {formatDate(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
