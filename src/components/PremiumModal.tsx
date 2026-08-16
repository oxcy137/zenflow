import { useState } from 'react';
import { CrownIcon, CloseIcon, CheckIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface PremiumModalProps {
  onClose: () => void;
  onUnlock: () => void;
}

export function PremiumModal({ onClose, onUnlock }: PremiumModalProps) {
  const { t } = useLanguage();
  const plans = [
    { id: 'monthly', label: t('premium.monthly'), price: '$4.99', period: t('premium.priceMonth') },
    { id: 'yearly', label: t('premium.yearly'), price: '$39.99', period: t('premium.priceYear'), badge: t('premium.save33') },
    { id: 'triennial', label: t('premium.triennial'), price: '$79.99', period: t('premium.price3y'), badge: t('premium.save55') },
  ];
  const [selected, setSelected] = useState('yearly');
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      localStorage.setItem('zenflow-premium', 'true');
      onUnlock();
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 300,
        padding: 20,
        paddingBottom: 60,
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
          padding: 32,
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
          animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          position: 'relative',
        }}
      >

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CrownIcon style={{ width: 24, height: 24, color: 'white' }} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{t('premium.title')}</h2>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          {t('premium.subtitle')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {plans.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 14,
                border: selected === p.id ? '1.5px solid var(--red-400)' : '1px solid var(--glass-border)',
                background: selected === p.id ? 'var(--red-400)' : 'var(--glass-bg)',
                backdropFilter: selected !== p.id ? 'blur(8px)' : 'none',
                WebkitBackdropFilter: selected !== p.id ? 'blur(8px)' : 'none',
                color: selected === p.id ? 'white' : 'var(--text)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{p.label}</span>
                {p.badge && (
                  <span style={{ fontSize: '0.7rem', color: 'white', fontWeight: 700, background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: 4, marginLeft: 8, letterSpacing: '0.03em' }}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>{p.price}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.period}</span>
                {selected === p.id && <CheckIcon style={{ width: 18, height: 18, color: 'white', marginLeft: 8 }} />}
              </div>
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleSubscribe}
          disabled={processing}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {processing ? (
            t('premium.processing')
          ) : (
            <><CrownIcon style={{ width: 18, height: 18 }} /> {t('premium.subscribe')}</>
          )}
        </button>

        <p className="muted" style={{ fontSize: '0.72rem', marginTop: 12, lineHeight: 1.5 }}>
          {t('premium.disclaimer2')}
        </p>
      </div>
    </div>
  );
}
