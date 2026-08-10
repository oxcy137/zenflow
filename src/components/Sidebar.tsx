import { useState, useEffect, useRef } from 'react';
import type { Page, User } from '@/types';
import { MeditateIcon, CrownIcon, GoogleIcon, MoonIcon, SunIcon, ChartIcon } from '@/components/Icons';
import { GlassesIcon } from '@/components/GlassesIcon';
import { useTheme } from '@/context/ThemeContext';
import { NotesModal } from '@/components/NotesModal';
import { DailyReviewModal } from '@/components/DailyReviewModal';
import { NotificationsModal } from '@/components/NotificationsModal';
import { DonationsModal } from '@/components/DonationsModal';
import { AccountModal } from '@/components/AccountModal';
import { PreferencesModal } from '@/components/PreferencesModal';
import { SupportModal } from '@/components/SupportModal';
import { useLanguage } from '@/context/LanguageContext';

function HomeIcon(props: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" />
    </svg>
  );
}

function BellIcon2(props: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function PenIcon(props: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function SmileyIcon(props: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="9" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HeartIcon2(props: { style?: React.CSSProperties }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}

function ChevronDownIcon(props: { style?: React.CSSProperties }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onPremium: () => void;
  user: User | null;
  onGoogleAuth: () => void;
  onLogout: () => void;
  onLanguageToggle?: () => void;
}

export function Sidebar({ current, onNavigate, onPremium, user, onGoogleAuth, onLogout, onLanguageToggle }: SidebarProps) {
  const { t } = useLanguage();
  const { theme, toggle } = useTheme();
  const [grandpa, setGrandpa] = useState(() => localStorage.getItem('grandpa-mode') === 'true');
  useEffect(() => {
    document.documentElement.classList.toggle('grandpa-mode', grandpa);
    localStorage.setItem('grandpa-mode', String(grandpa));
  }, [grandpa]);
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showDonations, setShowDonations] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showSettings && navRef.current) {
      setTimeout(() => {
        navRef.current?.scrollTo({ top: navRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [showSettings]);

  const mainItems: SidebarItem[] = [
    { id: 'home', label: t('sidebar.home'), icon: <HomeIcon /> },
    { id: 'stats', label: t('nav.stats'), icon: <ChartIcon style={{ width: 22, height: 22 }} /> },
    { id: 'notificaciones', label: t('sidebar.notifications'), icon: <BellIcon2 />, badge: t('general.badge.new') },
    { id: 'notas', label: t('sidebar.notes'), icon: <PenIcon /> },
    { id: 'revision', label: t('sidebar.dailyReview'), icon: <SmileyIcon /> },
    { id: 'membresia', label: t('sidebar.membership'), icon: <CrownIcon /> },
    { id: 'donaciones', label: t('sidebar.donations'), icon: <HeartIcon2 /> },
  ];

  const settingsSubItems = [
    { id: 'cuenta', label: t('sidebar.account') },
    { id: 'idioma', label: t('sidebar.language') },
    { id: 'estimulos', label: t('sidebar.alerts') },
    { id: 'preferencias', label: t('sidebar.preferences') },
    { id: 'soporte', label: t('sidebar.support') },
  ];

  const handleMainClick = (id: string) => {
    if (id === 'membresia') {
      onPremium();
    } else if (id === 'notas') {
      setShowNotes(true);
    } else if (id === 'revision') {
      setShowReview(true);
    } else if (id === 'notificaciones') {
      setShowNotifs(true);
    } else if (id === 'donaciones') {
      setShowDonations(true);
    } else if (id === 'home') {
      onNavigate(id as Page);
    } else if (id === 'stats') {
      onNavigate(id as Page);
    }
    setOpen(false);
  };

  const handleSettingsSubClick = (id: string) => {
    if (id === 'idioma' && onLanguageToggle) {
      onLanguageToggle();
    } else if (id === 'cuenta') {
      setShowAccount(true);
    } else if (id === 'estimulos') {
      setShowNotifs(true);
    } else if (id === 'preferencias') {
      setShowPrefs(true);
    } else if (id === 'soporte') {
      setShowSupport(true);
    }
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 199,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />
      )}

      <button
        onClick={() => setOpen(!open)}
        className="glass-depth"
        style={{
          position: 'fixed', left: 0, bottom: 140, zIndex: 201,
          width: 36, height: 64,
          borderTopRightRadius: 12, borderBottomRightRadius: 12,
          background: open ? '#FF0000' : 'rgba(204,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
          padding: 0,
        }}
        title={open ? 'Cerrar' : 'Abrir'}
      >

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white', transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        style={{
          position: 'fixed', left: 0, top: '35vh', bottom: 0, zIndex: 200,
          width: open ? 'min(220px, 72vw)' : 0,
          paddingLeft: open ? 20 : 0,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderTopRightRadius: 16,
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1), padding-left 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          overflow: 'hidden',
        }}
      >

        <div style={{ padding: '16px 16px 6px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <MeditateIcon className="shimmer-breathe" style={{ width: 22, height: 22 }} />
          <div className="shimmer" data-text="ZenFlow" style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>ZenFlow</div>
        </div>

        <div style={{ margin: '8px 12px 6px', height: 1, background: 'rgba(204,0,0,0.12)', flexShrink: 0 }} />

        <nav ref={navRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 1, padding: '0 8px' }}>
          {mainItems.map(item => {
            const isActive = !['notificaciones', 'notas', 'revision', 'donaciones', 'membresia'].includes(item.id) && current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMainClick(item.id)}
                className="nav-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px',
                  borderRadius: 10,
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: 'white',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  textAlign: 'left', width: '100%',
                  transition: 'background 0.2s',
                  opacity: open ? 1 : 0,
                  transitionDelay: open ? '0.1s' : '0s',
                  flexShrink: 0,
                }}
              >
                <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: '0.55rem', background: 'var(--red-400)', color: 'white', padding: '1px 6px', borderRadius: 6, marginLeft: 'auto' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ margin: '6px 0 4px', height: 1, background: 'rgba(204,0,0,0.08)', flexShrink: 0 }} />

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="nav-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px',
              borderRadius: 10,
                border: 'none', cursor: 'pointer',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.84rem',
              textAlign: 'left', width: '100%',
              background: 'transparent',
              transition: 'background 0.2s',
              opacity: open ? 1 : 0,
              transitionDelay: open ? '0.1s' : '0s',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
            </svg>
            <span>{t('sidebar.settings')}</span>
            <ChevronDownIcon style={{ marginLeft: 'auto', transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', opacity: 0.5 }} />
          </button>

          {showSettings && settingsSubItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleSettingsSubClick(item.id)}
              className="nav-btn-sub"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 10px 7px 32px',
                borderRadius: 8,
              border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 400,
                fontSize: '0.78rem',
                textAlign: 'left', width: '100%',
                background: 'transparent',
                transition: 'background 0.2s, color 0.2s',
                opacity: open ? 1 : 0,
                transitionDelay: open ? '0.12s' : '0s',
                flexShrink: 0,
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
          
        </nav>

        <div style={{ margin: '6px 12px', height: 1, background: 'rgba(204,0,0,0.12)', flexShrink: 0 }} />

        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px', margin: '0 8px', borderRadius: 10,
            opacity: open ? 1 : 0,
            transitionDelay: open ? '0.1s' : '0s',
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {theme === 'light'
              ? <MoonIcon style={{ width: 18, height: 18, color: 'white' }} />
              : <SunIcon style={{ width: 18, height: 18, color: 'white' }} />
            }
            <button
              onClick={toggle}
              style={{
                width: 44, height: 24, borderRadius: 999,
                background: theme === 'dark' ? 'var(--red-400)' : 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer', position: 'relative',
                padding: 0, transition: 'background 0.25s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: theme === 'dark' ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: 'white', transition: 'left 0.25s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GlassesIcon style={{ width: 16, height: 16, color: grandpa ? 'var(--red-400)' : 'var(--text)' }} />
            <div style={{ lineHeight: 1.1, color: grandpa ? 'var(--red-400)' : 'var(--text)', fontWeight: grandpa ? 700 : 500, fontSize: '0.68rem' }}>
              <div>Mod</div>
              <div>abuelo</div>
            </div>
            <button
              onClick={() => setGrandpa(!grandpa)}
              style={{
                width: 40, height: 22, borderRadius: 999,
                background: grandpa ? 'var(--red-400)' : 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer', position: 'relative',
                padding: 0, transition: 'background 0.25s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 2, left: grandpa ? 21 : 2,
                width: 18, height: 18, borderRadius: '50%',
                background: 'white', transition: 'left 0.25s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '8px 12px 16px', flexShrink: 0 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <GoogleIcon style={{ width: 18, height: 18, color: 'white' }} />
              <span style={{ fontSize: '0.78rem', color: 'white', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.username || user.email}
              </span>
              <button
                onClick={onLogout}
                style={{
                  fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--red-400)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                {t('sidebar.signout')}
              </button>
            </div>
          ) : (
            <button
              onClick={onGoogleAuth}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '8px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(204,0,0,0.15)',
                color: 'white', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <GoogleIcon style={{ width: 18, height: 18 }} />
              <span>{t('sidebar.signIn')}</span>
            </button>
          )}
        </div>
      </div>

      {showNotes && <NotesModal onClose={() => setShowNotes(false)} />}
      {showReview && <DailyReviewModal onClose={() => setShowReview(false)} />}
      {showNotifs && <NotificationsModal onClose={() => setShowNotifs(false)} />}
      {showDonations && <DonationsModal onClose={() => setShowDonations(false)} />}
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} user={user} />}
      {showPrefs && <PreferencesModal onClose={() => setShowPrefs(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </>
  );
}
