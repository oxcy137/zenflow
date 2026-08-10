import type { Meditation } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface UnlockModalProps {
  meditation: Meditation;
  totalPoints: number;
  onUnlock: (id: string) => void;
  onClose: () => void;
}

export function UnlockModal({ meditation, totalPoints, onUnlock, onClose }: UnlockModalProps) {
  const { t } = useLanguage();
  const required = meditation.pointsRequired ?? 0;
  const canUnlock = totalPoints >= required;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 20,
          padding: 28,
          maxWidth: 340,
          width: '90%',
          textAlign: 'center',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>

        <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
          {meditation.title}
        </h3>

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.4 }}>
          {required > 0
            ? `${t('practicas.requires')} ${required} ${t('practicas.sessions')}`
            : t('practicas.premiumOnly')}
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
            {t('practicas.yourPoints')}
          </span>
          <span style={{ color: canUnlock ? '#ff0000' : 'rgba(255,255,255,0.4)', fontSize: '0.95rem', fontWeight: 700 }}>
            {totalPoints} {required > 0 ? `/ ${required}` : ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {canUnlock && !meditation.premium && (
            <button
              onClick={() => { onUnlock(meditation.id); onClose(); }}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 12, border: 'none',
                background: '#ff0000', color: 'white', fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {t('practicas.unlock')}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {t('practicas.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
