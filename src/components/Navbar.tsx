import type { Page } from '@/types';
import { MusicIcon, SparklesIcon, LeafIcon, PotionIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
}

export function Navbar({ current, onNavigate, onBack, showBack, title }: NavbarProps) {
  const { t } = useLanguage();
  const tabs: { id: Page; label: string; icon: 'leaf' | 'sparkles' | 'music' | 'cosmos' | 'potion' }[] = [
    { id: 'home', label: 'Zen', icon: 'leaf' },
    { id: 'practicas', label: t('nav.practicas'), icon: 'sparkles' },
    { id: 'music', label: t('nav.music'), icon: 'music' },
    { id: 'misticismo', label: 'Mystic', icon: 'potion' },
  ];
  if (showBack) {
    return (
      <nav className="top-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', paddingTop: 'calc(env(safe-area-inset-top, 8px) + 8px)',
      }}>
        <button onClick={onBack} className="btn-icon" style={{ width: 40, height: 40, transition: 'background 0.2s', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', color: 'var(--text)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{title}</span>
        <div style={{ width: 40 }} />
      </nav>
    );
  }

  return (
    <nav className="top-nav-wrap" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', justifyContent: 'center', paddingTop: 'calc(env(safe-area-inset-top, 8px) + 16px)',
      pointerEvents: 'none',
    }}>
      <div className="glass-depth nav-tabs" style={{
        display: 'flex', pointerEvents: 'auto', position: 'relative',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.15) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 14, padding: 3, gap: 2,
        transition: 'background 0.3s',
      }}>
        {tabs.map(tab => {
          const active = current === tab.id;
          return (
            <button
              key={tab.id}
              className="nav-tab"
              onClick={() => onNavigate(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 12,
                background: active ? 'var(--red-400)' : 'transparent',
                color: 'var(--text)',
                fontSize: '0.78rem', fontWeight: active ? 700 : 500,
                border: 'none', cursor: 'pointer',
                transition: '0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab.icon === 'leaf' && <LeafIcon style={{ width: 14, height: 14 }} />}
              {tab.icon === 'sparkles' && <SparklesIcon style={{ width: 14, height: 14 }} />}
              {tab.icon === 'music' && <MusicIcon style={{ width: 14, height: 14 }} />}
              {tab.icon === 'potion' && <PotionIcon style={{ width: 14, height: 14 }} />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
