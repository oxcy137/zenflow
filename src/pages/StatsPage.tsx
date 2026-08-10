import { useLanguage } from '@/context/LanguageContext';
import { SessionStats } from '@/components/SessionStats';
import { OmIcon } from '@/components/Icons';
import type { Session, User } from '@/types';

interface StatsPageProps {
  sessions: Session[];
  totalMinutes: number;
  streak: number;
  onClear: () => void;
  user: User | null;
}

export function StatsPage({ sessions, totalMinutes, streak, onClear, user }: StatsPageProps) {
  const { t } = useLanguage();
  return (
    <div className="page fade-in">
      <div style={{ height: 80 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, position: 'relative' }}>

        <h1 className="shimmer" data-text={t('stats.title')}>{t('stats.title')}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {sessions.length > 0 && (
            <button
              onClick={() => onClear()}
              style={{
                padding: '6px 14px', fontSize: '0.75rem', borderRadius: 50,
                background: 'rgba(255,255,255,0.15)', color: 'var(--text)',
                border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600,
              }}
            >
              {t('stats.delete')}
            </button>
          )}
        </div>
      </div>

      {user && (
        <div style={{
          padding: '14px 16px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
          fontSize: '0.85rem', borderRadius: 16,
          background: 'rgba(204,0,0,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(204,0,0,0.15)',
        }}>
          <span style={{ fontSize: '1rem', color: 'white' }}>✓</span>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>{t('stats.syncedMsg')}</p>
        </div>
      )}

      <div style={{ position: 'relative' }}>

        <SessionStats sessions={sessions} totalMinutes={totalMinutes} streak={streak} />
      </div>

      <div style={{
        marginTop: 16, padding: 16, borderRadius: 16,
        background: 'rgba(204,0,0,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(204,0,0,0.15)',
        display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <OmIcon style={{ width: 24, height: 24, color: 'white', flexShrink: 0 }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.6 }}>
          {t('stats.quote2')}
        </p>
      </div>
    </div>
  );
}
