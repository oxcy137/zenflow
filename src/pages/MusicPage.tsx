import { useState, type ReactNode } from 'react';
import { PlayIcon, PauseIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface Track {
  id: string;
  title: string;
  category: string;
  duration: string;
  youtubeId?: string;
  start?: number;
}

const tracks: Track[] = [
  { id: 'nature-forest', title: 'music.track.forest', category: 'nature', duration: '30:00', youtubeId: 'lSMnowpc5nI' },
  { id: 'nature-ocean', title: 'music.track.ocean', category: 'nature', duration: '30:00', youtubeId: 'WHPEKLQID4U' },
  { id: 'nature-rain', title: 'music.track.rain', category: 'nature', duration: '30:00', youtubeId: 'jIvQlyIH-xs' },
  { id: 'nature-river', title: 'music.track.river', category: 'nature', duration: '60:00', youtubeId: 'RtVhM2o573A' },
  { id: 'nature-birds', title: 'music.track.birds', category: 'nature', duration: '60:00', youtubeId: 'EHklxmBvzwc' },
  { id: 'nature-wind', title: 'music.track.wind', category: 'nature', duration: '60:00', youtubeId: 'qBAPsQkS8QI' },
  { id: 'nature-thunder', title: 'music.track.thunder', category: 'nature', duration: '60:00', youtubeId: 'EY1NLcx3BuU' },
  { id: 'nature-fire', title: 'music.track.fire', category: 'nature', duration: '60:00', youtubeId: 'uUHrQutwdvE' },
  { id: 'binaural-delta', title: 'music.track.delta', category: 'binaural', duration: '60:00', youtubeId: 'gnyXd_fM9k4' },
  { id: 'binaural-theta', title: 'music.track.theta', category: 'binaural', duration: '45:00', youtubeId: 'qQ_W1w9v-2Y' },
  { id: 'binaural-alpha', title: 'music.track.alpha', category: 'binaural', duration: '60:00', youtubeId: 'izzvYLSCKx4' },
  { id: 'binaural-beta', title: 'music.track.beta', category: 'binaural', duration: '60:00', youtubeId: 'HA6nSQawROM' },
  { id: 'binaural-gamma', title: 'music.track.gamma', category: 'binaural', duration: '60:00', youtubeId: 'DHGPl4vJXU4' },
  { id: 'instrumental-flute', title: 'music.track.flute', category: 'instrumental', duration: '20:00', youtubeId: 'h57jU2w5KXM' },
  { id: 'instrumental-bowls', title: 'music.track.bowl', category: 'instrumental', duration: '25:00', youtubeId: 'PDI3mdiQuG0' },
  { id: 'mantra-aum', title: 'music.track.maha', category: 'mantras', duration: '15:00', youtubeId: '7zHDL0_sRGI' },
  { id: 'mantra-gayatri', title: 'music.track.gayatri', category: 'mantras', duration: '15:00', youtubeId: 'ynC4VY10qYk' },
  { id: 'silence', title: 'music.track.silence', category: 'silence', duration: '20:00' },
  { id: 'solfeggio-396', title: 'music.track.solf396', category: 'solfeggio', duration: '60:00', youtubeId: 'WGFhyb_HY80' },
  { id: 'solfeggio-528', title: 'music.track.solf528', category: 'solfeggio', duration: '60:00', youtubeId: 'CyNdyQOfgpU' },
  { id: 'solfeggio-639', title: 'music.track.solf639', category: 'solfeggio', duration: '60:00', youtubeId: 'yiGweP--BRs' },
  { id: 'solfeggio-741', title: 'music.track.solf741', category: 'solfeggio', duration: '60:00', youtubeId: 'S1hoBiXXSjM' },
  { id: 'solfeggio-852', title: 'music.track.solf852', category: 'solfeggio', duration: '60:00', youtubeId: 'dJoXVILGeKQ' },
  { id: 'solfeggio-963', title: 'music.track.solf963', category: 'solfeggio', duration: '60:00', youtubeId: '2JI7Q38KKuw' },
];

const categories = ['silence', 'nature', 'binaural', 'instrumental', 'mantras', 'solfeggio'] as const;

const categoryIcons: Record<string, ReactNode> = {
  silence: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  ),
  nature: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
    </svg>
  ),
  binaural: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  instrumental: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11.9 12.1 4.514-4.514" />
      <path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z" />
      <path d="m6 16 2 2" />
      <path d="M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z" />
    </svg>
  ),
  mantras: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  solfeggio: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </svg>
  ),
};

function trackIcon(id: string): ReactNode {
  const icons: Record<string, ReactNode> = {
    'nature-forest': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z" />
        <path d="M12 22v-3" />
      </svg>
    ),
    'nature-ocean': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
    'nature-rain': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1" />
      </svg>
    ),
    'nature-river': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
      </svg>
    ),
    'nature-birds': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 7h.01" />
        <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
        <path d="m20 7 2 .5-2 .5" />
        <path d="M10 18v3" />
        <path d="M14 17.75V21" />
        <path d="M7 18a6 6 0 0 0 3.84-10.61" />
      </svg>
    ),
    'nature-wind': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
        <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
        <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
      </svg>
    ),
    'nature-thunder': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      </svg>
    ),
    'nature-fire': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
      </svg>
    ),
    'binaural-delta': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
    'binaural-theta': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
    'binaural-alpha': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
    'binaural-beta': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
    'binaural-gamma': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
    'instrumental-flute': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="18" r="4" />
        <path d="M12 18V2l7 4" />
      </svg>
    ),
    'instrumental-bowls': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    'mantra-aum': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
    'mantra-gayatri': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
    'silence': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 0 12 6 6 0 0 0 0-12z" />
        <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
        <path d="M12 22v-4" />
      </svg>
    ),
    'solfeggio-396': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
      </svg>
    ),
    'solfeggio-528': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
      </svg>
    ),
    'solfeggio-639': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
      </svg>
    ),
    'solfeggio-741': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
      </svg>
    ),
    'solfeggio-852': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
      </svg>
    ),
    'solfeggio-963': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
      </svg>
    ),
  };
  return icons[id] ?? null;
}

export function MusicPage() {
  const { t } = useLanguage();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('nature');

  const togglePlay = (track: Track) => {
    if (currentTrack?.id === track.id && playing) {
      setPlaying(false);
      return;
    }
    setCurrentTrack(track);
    setPlaying(true);
  };

  const filtered = tracks.filter(t => t.category === activeCategory);

  return (
    <div
      className="page fade-in"
      style={{ paddingBottom: 100, paddingTop: '22vh' }}
    >
      <div style={{ paddingTop: 28, position: 'relative' }}>

        <h1 className="shimmer" data-text={t('music.title')} style={{ fontSize: '1.5rem' }}>{t('music.title')}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.85rem' }}>{t('music.subtitle')}</p>
      </div>

      <div
        className="music-categories"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginTop: 16,
        }}
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? 'pill-active' : 'pill'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            {categoryIcons[cat]}
            {t('music.category.' + cat)}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {filtered.map(track => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => togglePlay(track)}
                className={`card${isCurrent ? ' card-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                >
                <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {trackIcon(track.id)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.2 }}>{t(track.title)}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{track.duration}</div>
                </div>
                {isCurrent && playing ? (
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'var(--red-400)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <PauseIcon style={{ width: 14, height: 14, color: 'white' }} />
                  </div>
                ) : (
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <PlayIcon style={{ width: 14, height: 14, color: 'var(--text)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {currentTrack && (
        <div
          className="card glass-depth"
          style={{
            marginTop: 20,
            padding: 16,
            border: '1px solid var(--red-400)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{t(currentTrack.title)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('music.category.' + currentTrack.category)}</div>
            </div>
            <button
              onClick={() => togglePlay(currentTrack)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--red-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                transition: '0.2s',
              }}
            >
              {playing ? <PauseIcon style={{ width: 18, height: 18 }} /> : <PlayIcon style={{ width: 18, height: 18 }} />}
            </button>
          </div>

          {playing && currentTrack.youtubeId ? (
            <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', marginTop: 10 }}>
              <iframe
                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&loop=1&playlist=${currentTrack.youtubeId}&playsinline=1&rel=0${currentTrack.start ? `&start=${currentTrack.start}` : ''}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
