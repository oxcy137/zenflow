import type { Session } from '@/types';
import { OmIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface SessionStatsProps {
  sessions: Session[];
  totalMinutes: number;
  streak: number;
}

export function SessionStats({ sessions, totalMinutes, streak }: SessionStatsProps) {
  const { t, lang } = useLanguage();
  const completed = sessions.filter(s => s.completed).length;

  const meditationCounts: Record<string, number> = {};
  for (const s of sessions) {
    if (s.completed) {
      meditationCounts[s.meditationTitle] = (meditationCounts[s.meditationTitle] ?? 0) + 1;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '28px 0' }}>
      <div style={{
        padding: '28px 16px', display: 'flex', justifyContent: 'space-around', textAlign: 'center',
        borderRadius: 16,
        background: 'rgba(204,0,0,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(204,0,0,0.15)',
      }}>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{completed}</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginTop: 2, letterSpacing: '0.05em' }}>{t('stats.sessions').toUpperCase()}</p>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{totalMinutes}</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginTop: 2, letterSpacing: '0.05em' }}>{t('stats.minutes').toUpperCase()}</p>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{streak}</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginTop: 2, letterSpacing: '0.05em' }}>{t('stats.streak').toUpperCase()}</p>
        </div>
      </div>

      {Object.keys(meditationCounts).length > 0 && (
        <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(204,0,0,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(204,0,0,0.15)' }}>
          <h3 style={{ marginBottom: 14, color: 'white' }}>{t('stats.favorites')}</h3>
          {Object.entries(meditationCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([title, count]) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.9rem',
                }}
              >
                <span style={{ color: 'white', fontWeight: 500 }}>{title}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.85rem' }}>{count}x</span>
              </div>
            ))}
        </div>
      )}

      {sessions.filter(s => s.completed).slice(0, 10).length > 0 && (
        <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(204,0,0,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(204,0,0,0.15)' }}>
          <h3 style={{ marginBottom: 14, color: 'white' }}>{t('stats.recentSessions')}</h3>
          {sessions
            .filter(s => s.completed)
            .slice(0, 10)
            .map(s => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ color: 'white', fontWeight: 600 }}>{s.meditationTitle}</div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginTop: 2 }}>
                    {new Date(s.date).toLocaleDateString(lang !== 'es' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '0.85rem' }}>{Math.round(s.duration / 60)} min</span>
              </div>
            ))}
        </div>
      )}

      {sessions.length === 0 && (
        <div style={{
          padding: '44px 20px', textAlign: 'center', borderRadius: 16,
          background: 'rgba(204,0,0,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(204,0,0,0.15)',
        }}>
          <OmIcon style={{ width: 36, height: 36, color: 'rgba(255,255,255,0.4)', margin: '0 auto 12px' }} />
<p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{t('stats.empty')}</p>
           <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4, fontSize: '0.82rem' }}>{t('stats.emptySub')}</p>
        </div>
      )}
    </div>
  );
}
