import React, { useState, useRef, useEffect, useCallback } from 'react';
import { meditations } from '@/data/meditations';
import { OmIcon, MeditateIcon, LeafIcon } from '@/components/Icons';
import { QuestionnaireModal } from '@/components/QuestionnaireModal';
import { DailyChallenge } from '@/components/DailyChallenge';
import { useLanguage } from '@/context/LanguageContext';
import { getMeditationVideo } from '@/utils/video';
import { useFlipOnEnter } from '@/hooks/useFlipOnEnter';
import { useCardTilt } from '@/hooks/useCardTilt';
import { meditationText } from '@/i18n/meditationTexts';
import { CardTiltControl } from '@/components/CardTiltControl';
import type { Meditation, User, Session } from '@/types';

interface HomePageProps {
  onSelect: (meditation: Meditation) => void;
  user: User | null;
  onLogout: () => void;
  onGoogleAuth: () => void;
  streak: number;
  sessions: Session[];
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function sections(meditations: Meditation[]) {
  const order = ['miracle-of-mind', 'nada-yoga', 'nadi-shuddhi', 'chit-shakti-salud'];
  return order.map(id => meditations.find(m => m.id === id)).filter(Boolean) as Meditation[];
}

function FlipCard({ children, className = '', style, idx = 0, onTiltReady, onToggleTilt, videoPlaying }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  idx?: number;
  onTiltReady?: (fn: (x: number, y: number) => void) => void;
  onToggleTilt?: () => void;
  videoPlaying?: boolean;
}) {
  const flipRef = useFlipOnEnter(idx);
  const tilt = useCardTilt(flipRef);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    const el = flipRef.current;
    if (!el) return;
    const handler = () => setAnimDone(true);
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, [flipRef]);

  useEffect(() => {
    if (!animDone) return;
    const wrapper = flipRef.current?.closest('.flip-card-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('card-shimmer-active', !videoPlaying);
    }
  }, [animDone, videoPlaying, flipRef]);

  useEffect(() => {
    onTiltReady?.(tilt.setTransform);
  }, [onTiltReady, tilt.setTransform]);

  return (
    <div
      className="flip-card-wrapper"
      style={{ perspective: '800px', marginTop: 70, position: 'relative' }}
    >
      <div
        ref={flipRef}
        className="flip-card-inner"
        onPointerMove={videoPlaying ? undefined : tilt.onPointerMove}
        onPointerLeave={videoPlaying ? undefined : tilt.onPointerLeave}
        style={{
          position: 'relative',
          width: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        <button
          onClick={onToggleTilt}
          style={{
            position: 'absolute', top: 0, right: 0, zIndex: 10,
            width: 44, height: 44, border: 'none',
            borderRadius: '0 24px 0 24px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), -1px -1px 3px rgba(0,0,0,0.15)',
            transition: 'opacity 0.35s ease, background 0.2s',
            opacity: animDone ? 1 : 0,
            pointerEvents: animDone ? 'auto' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
            lineHeight: 1,
          }}
        >
          <LeafIcon style={{ width: 14, height: 14 }} />
        </button>
        <img
          className="flip-card-back-face"
          src="./images/card-back.jpg"
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            borderRadius: 24, backfaceVisibility: 'hidden', objectFit: 'cover',
          }}
        />
        <div
          className="flip-card-front-face"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'relative' }}
        >
          <div className="card-shimmer-overlay" />
          <div className={`${className} card-holo`} style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.04)',
            ...style,
          }}>
            <div style={{ position: 'relative', zIndex: 3 }}>
              {children}
            </div>
          </div>
        </div>
        <div className="card__grain" />
        <div className="card__scanlines" />
      </div>
    </div>
  );
}

export function HomePage({ onSelect, user, onLogout, streak, sessions }: HomePageProps) {
  const { lang, t } = useLanguage();
  const snaps = sections(meditations);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const hasProfile = !!localStorage.getItem('zenflow-profile');
  const scrollRef = useRef<HTMLDivElement>(null);
  const tiltSetters = useRef<((x: number, y: number) => void)[]>([]);
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [tiltOpen, setTiltOpen] = useState(false);

  useEffect(() => {
    setExpandedVideo(null);
  }, [visibleIdx]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      if (idx >= 0 && idx < snaps.length) setVisibleIdx(idx);
    };
    el.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => el.removeEventListener('scroll', handler);
  }, [snaps.length]);

  const handleTilt = useCallback((x: number, y: number) => {
    tiltSetters.current[visibleIdx]?.(x, y);
  }, [visibleIdx]);

  return (
    <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>
      {snaps.map((m, idx) => {
        const clientModeOff = localStorage.getItem('zenflow-client-mode') === 'false';
        const isLocked = clientModeOff ? false : (m.premium && !localStorage.getItem('zenflow-premium'));
        return (
          <div
            key={m.id}
            style={{
              height: '100dvh',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 28px 60px',
              position: 'relative',
            }}
          >
            {idx === 0 && user && (
              <div style={{ position: 'absolute', top: 64, right: 16, zIndex: 101 }}>
                <div style={{ padding: '6px 12px', borderRadius: 50, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>{user.username}</span>
                  <button onClick={onLogout} style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', background: 'none', padding: 0, border: 'none', cursor: 'pointer' }}>{t('general.logout')}</button>
                </div>
              </div>
            )}


            <FlipCard
              idx={idx}
              onTiltReady={(fn) => { tiltSetters.current[idx] = fn; }}
              onToggleTilt={() => setTiltOpen(o => !o)}
              videoPlaying={expandedVideo === m.id}
              className="meditation-card glass-depth"
              style={{
                width: '100%',
                maxWidth: 360,
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                position: 'relative',
              }}
            >

              <div style={{ padding: '14px 20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {m.youtubeId ? (
                  <>
                    <h1 className="shimmer" data-text={meditationText(m.id, 'title', lang, m.title, m.titleEn)} style={{ fontSize: '1.25rem', margin: 0 }}>{meditationText(m.id, 'title', lang, m.title, m.titleEn)}</h1>
                    <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, opacity: 0.85 }}>{meditationText(m.id, 'subtitle', lang, m.subtitle, m.subtitleEn)}</p>
                    <p style={{ color: 'white', fontSize: '0.72rem', lineHeight: 1.4, opacity: 0.75, maxWidth: 280 }}>{meditationText(m.id, 'description', lang, m.description, m.descriptionEn)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                        {Math.floor(m.duration / 60)}
                      </span>
                      <span style={{ color: 'white', opacity: 0.7, fontSize: '0.75rem' }}>{t('player.min')}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: 40, height: 40, color: 'white', opacity: 0.9 }}>
                      <MeditateIcon style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h1 className="shimmer" data-text={meditationText(m.id, 'title', lang, m.title, m.titleEn)} style={{ fontSize: '1.25rem', margin: 0 }}>{meditationText(m.id, 'title', lang, m.title, m.titleEn)}</h1>
                    <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, opacity: 0.85 }}>{meditationText(m.id, 'subtitle', lang, m.subtitle, m.subtitleEn)}</p>
                    <p style={{ color: 'white', fontSize: '0.72rem', lineHeight: 1.4, opacity: 0.75, maxWidth: 280 }}>{meditationText(m.id, 'description', lang, m.description, m.descriptionEn)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                        {Math.floor(m.duration / 60)}
                      </span>
                      <span style={{ color: 'white', opacity: 0.7, fontSize: '0.75rem' }}>{t('player.min')}</span>
                    </div>
                  </>
                )}
                {!m.youtubeId && (
                  <div
                    onClick={() => { if (!isLocked) onSelect(m); }}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(12px)',
                      color: 'white',
                      padding: '8px 24px',
                      borderRadius: 50,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      marginTop: 2,
                    }}
                  >
                    {t('home.start')}
                  </div>
                )}
              </div>

              {m.youtubeId && (() => {
                const vid = getMeditationVideo(m, lang);
                const isOffline = localStorage.getItem('zenflow-offline-mode') === 'true';
                const localPath = `./videos/practices/${vid.youtubeId}.mp4`;

                if (isOffline) {
                  return (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                      <video
                        src={localPath}
                        muted={expandedVideo !== m.id}
                        autoPlay={expandedVideo === m.id}
                        controls={expandedVideo === m.id}
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {expandedVideo !== m.id && (
                        <div
                          onClick={() => setExpandedVideo(m.id)}
                          style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.15)'; }}
                        >
                          <svg width="52" height="52" viewBox="0 0 24 24" fill="white" opacity="0.95">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                }

                return expandedVideo === m.id ? (
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 12, overflow: 'hidden' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${vid.youtubeId}?autoplay=1&playsinline=1&rel=0${vid.videoStart ? `&start=${vid.videoStart}` : ''}`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => setExpandedVideo(m.id)}
                    style={{
                      width: '100%', aspectRatio: '16/9', position: 'relative', cursor: 'pointer',
                      background: '#000', borderRadius: 12, overflow: 'hidden',
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt={m.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.15)',
                    transition: 'background 0.3s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.15)'; }}
                  >
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="white" opacity="0.95">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                );
              })()}
            </FlipCard>

            {idx < snaps.length - 1 && (
              <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.4 }}>
                <svg className="shimmer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
                <span className="shimmer" data-text="Desliza">Desliza</span>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ height: '100dvh', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, gap: 24 }}>
        {!hasProfile && (
          <div
            onClick={() => setShowQuestionnaire(true)}
            className="card glass-depth"
            style={{
              width: '100%', maxWidth: 340,
              padding: '28px 24px',
              borderRadius: 24,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 12,
              position: 'relative',
            background: 'linear-gradient(135deg, rgba(200,200,200,0.1) 0%, rgba(180,180,180,0.03) 50%, rgba(190,190,190,0.06) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            }}
          >

            <div style={{ width: 44, height: 44, color: 'white', opacity: 0.9 }}>
              <OmIcon style={{ width: '100%', height: '100%' }} />
            </div>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.15rem' }}>{t('home.discoverProfile')}</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              {t('home.quizDesc')}
            </p>
            <div style={{
              marginTop: 4, padding: '8px 24px', borderRadius: 50,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: 'white', fontSize: '0.82rem', fontWeight: 600,
            }}>
              {t('home.start')}
            </div>
          </div>
        )}

        {streak > 0 && (
          <DailyChallenge streak={streak} sessions={sessions} />
        )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px 10px 16px', borderRadius: 50, background: 'rgba(255,255,255,0.08)', boxShadow: 'var(--shadow)' }}>
          <OmIcon style={{ width: 24, height: 24, color: 'white' }} />
          <MeditateIcon className="shimmer-icon" style={{ width: 24, height: 24 }} />
          <h1 className="shimmer" data-text="ZenFlow" style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1 }}>ZenFlow</h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          {t('home.taglineDesc')}
        </p>

        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--red-400)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <InstagramIcon style={{ width: 20, height: 20 }} />
          </a>
          <a href="#" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--red-400)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <YouTubeIcon style={{ width: 20, height: 20 }} />
          </a>
          <a href="#" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--red-400)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XIcon style={{ width: 18, height: 18 }} />
          </a>
        </div>

        <button className="btn-primary" onClick={() => {}} style={{ padding: '14px 36px', fontSize: '0.9rem' }}>
          {t('general.contact')}
        </button>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MeditateIcon style={{ width: 16, height: 16 }} />
            ZenFlow
          </span>
          © 2026
        </p>
      </div>

      <CardTiltControl open={tiltOpen} onTilt={handleTilt} onClose={() => setTiltOpen(false)} style={{ position: 'fixed', left: 0, bottom: 80, zIndex: 1000 }} />

      {showQuestionnaire && (
        <QuestionnaireModal onClose={() => setShowQuestionnaire(false)} />
      )}

    </div>
  );
}
