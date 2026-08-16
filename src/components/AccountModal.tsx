import { CloseIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';
import type { User } from '@/types';

interface AccountModalProps {
  onClose: () => void;
  user: User | null;
}

export function AccountModal({ onClose, user }: AccountModalProps) {
  const { t } = useLanguage();

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
          maxWidth: 400,
          width: '100%',
          animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{t('sidebar.account')}</h2>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--red-400)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.3rem', fontWeight: 700,
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{user.username}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0' }}>{user.email}</p>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
            {t('sidebar.signIn')}
          </p>
        )}
      </div>
    </div>
  );
}
