import { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import type { Page, Meditation, User } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { api } from '@/api/client';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { PremiumModal } from '@/components/PremiumModal';
import { UnlockModal } from '@/components/UnlockModal';
import { useUnlockSystem } from '@/hooks/useUnlockSystem';
import { FloatingMenu } from '@/components/FloatingMenu';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { Sidebar } from '@/components/Sidebar';

import { ArrowLeftIcon, MeditateIcon, getMeditationIcon } from '@/components/Icons';
import { VideoBackground } from '@/components/VideoBackground';
import { meditationText, getStepText } from '@/i18n/meditationTexts';
import { BackgroundProvider, useBackgrounds } from '@/context/BackgroundContext';
import { HomePage } from '@/pages/HomePage';
import { PracticasPage } from '@/pages/PracticasPage';
import { MusicPage } from '@/pages/MusicPage';
import { StatsPage } from '@/pages/StatsPage';
import { MisticismoPage } from '@/pages/MisticismoPage';

const MemoHomePage = memo(HomePage);
const MemoPracticasPage = memo(PracticasPage);
const MemoMusicPage = memo(MusicPage);
const MemoStatsPage = memo(StatsPage);
const MemoMisticismoPage = memo(MisticismoPage);

function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div className="loading-screen" style={{
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MeditateIcon className="shimmer-icon" style={{ width: 24, height: 24 }} />
          <span className="shimmer" data-text="ZenFlow" style={{ fontSize: '1.3rem', fontWeight: 800 }}>ZenFlow</span>
        </div>
        <div className="loading-squares">
          <div className="loading-square s1" />
          <div className="loading-square s2" />
        </div>
      </div>
    </div>
  );
}

const PAGE_ORDER: Page[] = ['home', 'practicas', 'music', 'misticismo', 'stats'];

function AppInner() {
  const { lang, setLang, t } = useLanguage();
  const { theme } = useTheme();
  const { backgrounds } = useBackgrounds();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [selected, setSelected] = useState<Meditation | null>(null);
  const [started, setStarted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<Meditation | null>(null);
  const [serverSessions, setServerSessions] = useState<any[]>([]);
  const [serverStats, setServerStats] = useState<{ totalSessions: number; totalMinutes: number; byMeditation: any[] } | null>(null);
  const { sessions: localSessions, addSession: addLocalSession, clearHistory: clearLocal, totalMinutes: localMinutes, streak } = useSessionHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLangSelector, setShowLangSelector] = useState(() => !localStorage.getItem('zenflow-lang'));
  const handleLanguageToggle = useCallback(() => {
    setShowLangSelector(true);
  }, []);

  useEffect(() => {
    const urls = new Set<string>();
    for (const p of PAGE_ORDER) {
      const bg = backgrounds[p];
      if (bg?.type === 'video') urls.add(bg.src);
    }
    let loaded = 0;
    const total = urls.size;
    let done = false;
    const hide = () => { if (!done) { done = true; setLoading(false); } };
    if (total === 0) { hide(); return; }
    for (const url of urls) {
      const vid = document.createElement('video');
      vid.preload = 'auto';
      vid.muted = true;
      vid.src = url;
      vid.load();
      const onReady = () => { loaded++; if (loaded >= total) hide(); };
      vid.addEventListener('canplay', onReady, { once: true });
      vid.addEventListener('loadedmetadata', onReady, { once: true });
    }
    const t = setTimeout(hide, 5000);
    return () => clearTimeout(t);
  }, [backgrounds]);

  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener('zenflow:logout', handler);
    return () => window.removeEventListener('zenflow:logout', handler);
  }, []);


  const loadServerData = useCallback(async () => {
    if (!api.token) return;
    try {
      const [sess, stats] = await Promise.all([
        api.sessions.list(),
        api.sessions.stats(),
      ]);
      setServerSessions(sess);
      setServerStats(stats);
    } catch { /* offline */ }
  }, []);

  useEffect(() => { if (user) loadServerData(); }, [user, loadServerData]);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToPage = useCallback((p: Page) => {
    if (!scrollRef.current) return;
    const idx = PAGE_ORDER.indexOf(p);
    const child = scrollRef.current.children[idx] as HTMLElement;
    if (child) child.scrollIntoView({ behavior: 'smooth' });
    setPage(p);
  }, []);
  const sessions = useMemo(() => user && serverSessions.length > 0
    ? serverSessions.map(s => ({ id: s.id, meditationId: s.meditation_id, meditationTitle: s.meditation_title, date: s.created_at, duration: s.duration, completed: !!s.completed }))
    : localSessions, [user, serverSessions, localSessions]);
  const totalPoints = useMemo(() => sessions.filter(s => s.completed).length, [sessions]);
  const { isUnlocked, unlock, autoUnlock } = useUnlockSystem(totalPoints);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!scrollRef.current) return;
      const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setPage(PAGE_ORDER[idx] ?? 'home');
    }, 80);
  }, []);

  const handleSelect = useCallback((m: Meditation) => {
    const clientModeOff = localStorage.getItem('zenflow-client-mode') === 'false';
    if (!clientModeOff && m.premium && !localStorage.getItem('zenflow-premium')) {
      setShowPremium(true);
      return;
    }
    if (!isUnlocked(m)) {
      setUnlockTarget(m);
      return;
    }
    setSelected(m);
  }, [isUnlocked]);

  const handleComplete = useCallback(async () => {
    if (selected) {
      const sessionData = { meditationId: selected.id, meditationTitle: selected.title, duration: selected.duration, completed: true };
      addLocalSession({ id: crypto.randomUUID(), date: new Date().toISOString(), ...sessionData });
      if (api.token) {
        try {
          await api.sessions.create(selected.id, selected.title, selected.duration, true);
          loadServerData();
        } catch { /* offline */ }
      }
    }
    setStarted(false);
    setSelected(null);
    autoUnlock();
  }, [selected, addLocalSession, loadServerData, autoUnlock]);

  const handleAuth = useCallback((u: User) => { setUser(u); setShowAuth(false); }, []);

  const handleLogout = useCallback(() => {
    api.setToken(null); setUser(null); setServerSessions([]); setServerStats(null);
  }, []);

  const handleGoogleAuth = useCallback(() => {
    setShowAuth(true);
  }, []);

  const handleNavigate = useCallback((p: Page) => {
    setStarted(false);
    setSelected(null);
    scrollToPage(p);
  }, [scrollToPage]);

  const totalMinutes = serverStats ? serverStats.totalMinutes : localMinutes;

  if (showLangSelector) return <LanguageSelector onSelect={(l) => { setLang(l as any); setShowLangSelector(false); }} />;

  return (
    <>
      {PAGE_ORDER.map(p => {
        const bg = backgrounds[p];
        if (bg?.type !== 'video') return null;
        return <VideoBackground key={p} src={bg.src} playing={p === page} />;
      })}
      <LoadingScreen visible={loading} />
      <Navbar current={page} onNavigate={handleNavigate} />
      <Sidebar current={page} onNavigate={handleNavigate} onPremium={() => setShowPremium(true)} user={user} onGoogleAuth={handleGoogleAuth} onLogout={handleLogout} onLanguageToggle={handleLanguageToggle} />
      <div ref={scrollRef} className="scroll-container" onScroll={handleScroll}>
        {PAGE_ORDER.map(p => {
          const bg = backgrounds[p];
          const bgStyle = bg?.type === 'image' ? { backgroundImage: `url(${bg.src})` } : {};
          return (
            <div key={p} className="scroll-page" style={{ ...bgStyle, contain: 'layout style' }}>
              {p === 'home' && <MemoHomePage onSelect={handleSelect} user={user} onLogout={handleLogout} onGoogleAuth={handleGoogleAuth} streak={streak} sessions={sessions} />}
              {p === 'practicas' && <MemoPracticasPage onSelect={handleSelect} user={user} onAuthClick={() => setShowAuth(true)} onLogout={handleLogout} totalPoints={totalPoints} />}
              {p === 'music' && <MemoMusicPage />}
              {p === 'misticismo' && <MemoMisticismoPage />}
              {p === 'stats' && <MemoStatsPage sessions={sessions} totalMinutes={totalMinutes} streak={streak} onClear={clearLocal} user={user} />}
            </div>
          );
        })}
      </div>

      <FloatingMenu onPremium={() => setShowPremium(true)} onNavigate={handleNavigate} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} onUnlock={() => {}} />}
      {unlockTarget && (
        <UnlockModal
            meditation={unlockTarget}
            totalPoints={totalPoints}
            onUnlock={unlock}
            onClose={() => setUnlockTarget(null)}
          />
        )}

      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center',
            padding: '0 16px 80px',
            background: 'rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { started ? setStarted(false) : setSelected(null); } }}
        >
          <div className="glass-depth" style={{
            width: '100%', maxWidth: 440, maxHeight: started ? '85vh' : '70vh',
            overflow: started ? 'hidden' : 'auto',
            background: started ? `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),${selected.gradient}` : 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 20,
            padding: started ? '4px 0 0' : '20px 24px 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: started ? 0 : 10, textAlign: 'center',
            position: 'relative',
          }}> 

              {started ? (
                <MeditationPlayer
                  meditation={selected}
                  onComplete={handleComplete}
                  onBack={() => setStarted(false)}
                  autoStart
                  inline
                />
              ) : (
                <>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      position: 'absolute', top: 12, left: 12,
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      borderRadius: '50%', width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <ArrowLeftIcon style={{ width: 16, height: 16 }} />
                  </button>

                  <div style={{ width: 48, height: 48, color: 'white', animation: 'float 3s ease-in-out infinite' }}>
                    {getMeditationIcon(selected.iconType, { style: { width: '100%', height: '100%' } })}
                  </div>

                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{meditationText(selected.id, 'title', lang, selected.title, selected.titleEn)}</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.8rem', marginTop: 4 }}>{meditationText(selected.id, 'description', lang, selected.description, selected.descriptionEn)}</p>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '8px 20px',
                    textAlign: 'center',
                  }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
                      {Math.floor(selected.duration / 60)}
                      <span style={{ fontSize: '0.78rem', fontWeight: 500, marginLeft: 4, color: 'var(--text-muted)' }}>{t('player.min')}</span>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginLeft: 10 }}>
                      {selected.steps.length} {t('app.steps')}
                    </span>
                  </div>

                  <div style={{
                    width: '100%',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: 10,
                    textAlign: 'left',
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {t('app.practiceSteps')}
                    </p>
                    <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {selected.steps.slice(0, 5).map((step, i) => (
                        <li key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', lineHeight: 1.3 }}>
                          {(() => { const t = getStepText(step, lang); return t.length > 60 ? t.slice(0, 60) + '...' : t; })()}
                        </li>
                      ))}
                      {selected.steps.length > 5 && (
                        <li style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontStyle: 'italic', listStyle: 'none' }}>
                          {`+ ${selected.steps.length - 5} ${t('app.moreSteps')}`}
                        </li>
                      )}
                    </ol>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => setStarted(true)}
                    style={{ fontSize: '0.9rem', padding: '10px 40px', marginTop: 2 }}
                  >
                    {t('app.start')}
                  </button>
                </>
              )}
            </div>
          </div>
      )}
      {theme === 'dark' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.18)',
          pointerEvents: 'none',
          zIndex: 999999,
        }} />
      )}
    </>
  );
}

export function App() {
  useEffect(() => {
    localStorage.setItem('zenflow-low-spec', 'false');
    document.documentElement.setAttribute('data-low-spec', 'false');
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BackgroundProvider>
          <AppInner />
        </BackgroundProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
