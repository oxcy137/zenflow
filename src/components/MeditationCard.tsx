import type { Meditation } from '@/types';
import { getMeditationIcon, CrownIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';
import { meditationText } from '@/i18n/meditationTexts';

interface MeditationCardProps {
  meditation: Meditation;
  totalPoints: number;
  onClick: () => void;
}

function formatDuration(seconds: number, t: (key: string) => string): string {
  const m = Math.floor(seconds / 60);
  return `${m} ${t('player.min')}`;
}

export function MeditationCard({ meditation, totalPoints, onClick }: MeditationCardProps) {
  const { lang, t } = useLanguage();
  const premium = !!localStorage.getItem('zenflow-premium');
  const premiumLocked = meditation.premium && !premium;
  const pointsLocked = !premium && meditation.pointsRequired !== undefined && totalPoints < meditation.pointsRequired;
  const clientModeOff = localStorage.getItem('zenflow-client-mode') === 'false';
  const isLocked = clientModeOff ? false : (premiumLocked || pointsLocked);
  const needed = meditation.pointsRequired !== undefined ? meditation.pointsRequired - totalPoints : 0;

  return (
    <div
      className="slide-up glass-depth"
      onClick={() => onClick()}
      style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'none',
        borderRadius: 16,
        padding: 0,
        cursor: isLocked ? 'default' : 'pointer',
        transition: '0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        opacity: isLocked ? 0.75 : 1,
        filter: isLocked ? 'grayscale(0.6)' : 'none',
      }}
    >
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ color: 'white', width: 28, height: 28, opacity: isLocked ? 0.5 : 1 }}>
            {getMeditationIcon(meditation.iconType, { style: { width: '100%', height: '100%' } })}
          </div>
          {meditation.premium && (
            <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: 700, background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 3 }}>
              <CrownIcon style={{ width: 10, height: 10 }} /> {t('medal.premium')}
            </span>
          )}
          {meditation.isVideo && !meditation.premium && (
            <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: 700, background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.08em' }}>
              {t('medal.video')}
            </span>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: '0.95rem', lineHeight: 1.3, marginBottom: 2, color: 'var(--text)', opacity: isLocked ? 0.5 : 1 }}>{meditationText(meditation.id, 'title', lang, meditation.title, meditation.titleEn)}</h3>
          <p style={{ color: 'var(--text)', fontSize: '0.72rem', lineHeight: 1.4, opacity: isLocked ? 0.35 : 0.8 }}>{meditationText(meditation.id, 'subtitle', lang, meditation.subtitle, meditation.subtitleEn)}</p>
        </div>
        <span
          style={{
            fontSize: '0.7rem',
            color: 'white',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.12)',
            padding: '3px 10px',
            borderRadius: 20,
            alignSelf: 'flex-start',
            letterSpacing: '0.02em',
          }}
        >
          {formatDuration(meditation.duration, t)}
        </span>
      </div>

      {premiumLocked && (
        <div
          className="premium-overlay"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{ cursor: 'pointer' }}
        >
          <CrownIcon style={{ width: 24, height: 24 }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.03em' }}>{t('medal.premium')}</span>
        </div>
      )}

      {pointsLocked && (
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '6px 0',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{needed} {t('practicas.morePoints')}</span>
        </div>
      )}
    </div>
  );
}
