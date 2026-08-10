import { useState } from 'react';
import { BellIcon, CloseIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface NotificationsModalProps {
  onClose: () => void;
}

const STORAGE_KEY = 'zenflow-notif-prefs';

const defaultPrefs = {
  dailyReminder: true,
  streakAlert: true,
  newContent: false,
  tips: true,
};

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const toggle = (key: keyof typeof defaultPrefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const items = [
    { key: 'dailyReminder' as const, label: t('notifications.dailyReminder'), desc: t('notifications.dailyReminderDesc') },
    { key: 'streakAlert' as const, label: t('notifications.streakAlert'), desc: t('notifications.streakAlertDesc') },
    { key: 'newContent' as const, label: t('notifications.newContent'), desc: t('notifications.newContentDesc') },
    { key: 'tips' as const, label: t('notifications.tips'), desc: t('notifications.tipsDesc') },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 300, padding: 20, paddingBottom: 60,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'none', borderRadius: 24, padding: 28, maxWidth: 380, width: '100%',
        animation: 'scaleIn 0.3s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BellIcon style={{ width: 22, height: 22, color: 'white' }} />
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('notifications.title')}</h2>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20, lineHeight: 1.5 }}>
          {t('notifications.subtitle')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 14,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                cursor: 'pointer',
              }}
              onClick={() => toggle(item.key)}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{
                width: 44, height: 26, borderRadius: 13,
                background: prefs[item.key] ? 'var(--red-400)' : 'var(--gray-100)',
                position: 'relative', transition: '0.3s', flexShrink: 0, marginLeft: 12,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', position: 'absolute', top: 2,
                  left: prefs[item.key] ? 20 : 2,
                  transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textAlign: 'center', marginTop: 16, opacity: 0.6 }}>
          {t('notifications.footer2')}
        </p>
      </div>
    </div>
  );
}
