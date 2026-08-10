import { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';
import { useBackgrounds } from '@/context/BackgroundContext';

interface PreferencesModalProps {
  onClose: () => void;
}

const SECTIONS = [
  { id: 'home', label: 'Zen' },
  { id: 'practicas', label: 'Prácticas' },
  { id: 'music', label: 'Música' },
  { id: 'stats', label: 'Estadísticas' },
  { id: 'misticismo', label: 'Misticismo' },
];

const LANG_OPTIONS = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'zh-TW', label: '中文 (台灣)', flag: '🇹🇼' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
] as const;

export function PreferencesModal({ onClose }: PreferencesModalProps) {
  const { t, lang, setLang } = useLanguage();
  const { backgrounds, setBackground, allOptions } = useBackgrounds();
  const [offlineMode, setOfflineMode] = useState(() => localStorage.getItem('zenflow-offline-mode') === 'true');
  const [clientMode, setClientMode] = useState(() => localStorage.getItem('zenflow-client-mode') === 'true');
  const [selectedSection, setSelectedSection] = useState('home');
  const [showLangOptions, setShowLangOptions] = useState(false);
  const currentLang = LANG_OPTIONS.find(l => l.code === lang) ?? LANG_OPTIONS[0];

  useEffect(() => {
    localStorage.setItem('zenflow-offline-mode', String(offlineMode));
  }, [offlineMode]);

  useEffect(() => {
    localStorage.setItem('zenflow-client-mode', String(clientMode));
  }, [clientMode]);

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
          maxWidth: 420,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{t('sidebar.preferences')}</h2>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={offlineMode ? 'var(--red-400)' : 'var(--text)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="2" x2="22" y2="22" />
                <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
                <path d="M10.66 5.12A15 15 0 0 1 22 8.82" />
                <path d="M14.5 19.5a2.5 2.5 0 0 1-5 0" />
              </svg>
              <span style={{ color: 'var(--text)', fontSize: '0.88rem' }}>{t('sidebar.offlineMode')}</span>
            </div>
            <button onClick={() => setOfflineMode(!offlineMode)} style={{
              width: 44, height: 24, borderRadius: 999,
              background: offlineMode ? 'var(--red-400)' : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0,
            }}>
              <span style={{
                position: 'absolute', top: 3, left: offlineMode ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: 'white', transition: 'left 0.25s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={clientMode ? 'var(--red-400)' : 'var(--text)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span style={{ color: 'var(--text)', fontSize: '0.88rem' }}>{t('sidebar.resetClient')}</span>
            </div>
            <button onClick={() => setClientMode(!clientMode)} style={{
              width: 44, height: 24, borderRadius: 999,
              background: clientMode ? 'var(--red-400)' : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flexShrink: 0,
            }}>
              <span style={{
                position: 'absolute', top: 3, left: clientMode ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: 'white', transition: 'left 0.25s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

          <div>
            <div
              onClick={() => setShowLangOptions(!showLangOptions)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span style={{ color: 'var(--text)', fontSize: '0.88rem' }}>{t('sidebar.language')}</span>
              </div>
              <span style={{ color: 'white', fontSize: '0.95rem' }}>
                {currentLang.flag} {currentLang.label}
              </span>
            </div>
            {showLangOptions && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
                padding: '10px 0',
              }}>
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => { setLang(opt.code as any); setShowLangOptions(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 12px', borderRadius: 12,
                      border: lang === opt.code ? '1px solid var(--red-400)' : '1px solid rgba(255,255,255,0.08)',
                      background: lang === opt.code ? 'rgba(204,0,0,0.15)' : 'rgba(255,255,255,0.04)',
                      color: 'white', fontSize: '0.8rem', cursor: 'pointer',
                      fontWeight: lang === opt.code ? 700 : 400,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{opt.flag}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

          <div>
            <h3 style={{ color: 'white', fontSize: '0.9rem', margin: '0 0 8px' }}>Fondo de pantalla</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSection(s.id)}
                  style={{
                    padding: '5px 14px', borderRadius: 50,
                    fontSize: '0.75rem', fontWeight: 600,
                    border: selectedSection === s.id ? '1px solid var(--red-400)' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedSection === s.id ? 'rgba(204,0,0,0.2)' : 'rgba(255,255,255,0.06)',
                    color: 'white', cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {allOptions.map(opt => {
                const isActive = backgrounds[selectedSection]?.src === opt.src;
                return (
                  <button
                    key={opt.src}
                    onClick={() => setBackground(selectedSection, opt)}
                    style={{
                      position: 'relative',
                      aspectRatio: '16/9',
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: isActive ? '2px solid var(--red-400)' : '2px solid transparent',
                      cursor: 'pointer',
                      padding: 0,
                      background: opt.type === 'video' ? '#111' : `center/cover url(${opt.src})`,
                    }}
                  >
                    {opt.type === 'video' && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.7rem', fontWeight: 600,
                      }}>
                        ▶ {opt.label}
                      </div>
                    )}
                    {opt.type === 'image' && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '3px 6px',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        fontSize: '0.6rem',
                        textAlign: 'center',
                      }}>
                        {opt.label}
                      </div>
                    )}
                    {isActive && (
                      <div style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 14, height: 14, borderRadius: '50%',
                        background: 'var(--red-400)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" fill="none" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
