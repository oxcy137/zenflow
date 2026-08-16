import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CrownIcon, HeartOutlineIcon, CloseIcon, CheckIcon } from '@/components/Icons';

interface DonationsModalProps {
  onClose: () => void;
}

const donationAmounts = [3, 5, 10, 25];

export function DonationsModal({ onClose }: DonationsModalProps) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'membership' | 'donation'>('membership');
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [processing, setProcessing] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [donated, setDonated] = useState(false);

  const plans = [
    { id: 'monthly', label: t('premium.monthly'), price: '$4.99', period: t('premium.priceMonth') },
    { id: 'yearly', label: t('premium.yearly'), price: '$39.99', period: t('premium.priceYear'), badge: t('premium.save33') },
    { id: 'triennial', label: t('premium.triennial'), price: '$79.99', period: t('premium.price3y'), badge: t('premium.save55') },
  ];

  const handleSubscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      localStorage.setItem('zenflow-premium', 'true');
      setProcessing(false);
      onClose();
    }, 800);
  };

  const handleDonate = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDonated(true);
    }, 600);
  };

  const displayAmount = customAmount ? parseFloat(customAmount) : donationAmount;

  if (donated) {
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
          border: 'none', borderRadius: 24, padding: 32, maxWidth: 340, width: '100%',
          textAlign: 'center', animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <HeartOutlineIcon style={{ width: 48, height: 48, color: 'white', marginBottom: 12 }} />
          <h2 style={{ margin: '0 0 8px' }}>{t('donations.thankYou')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.6 }}>
            {t('donations.thanksDesc2')}
          </p>
          <button className="btn-primary" onClick={onClose}>{t('general.close')}</button>
        </div>
      </div>
    );
  }

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
        maxHeight: '85vh', overflowY: 'auto',
        animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            {tab === 'membership' ? t('donations.membership') : t('donations.title')}
          </h2>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 12, padding: 4 }}>
          <button
            onClick={() => setTab('membership')}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 10,
              background: tab === 'membership' ? 'var(--red-400)' : 'transparent',
              color: tab === 'membership' ? 'white' : 'var(--text)',
              fontWeight: 700, fontSize: '0.82rem',
              border: 'none', cursor: 'pointer', transition: '0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <CrownIcon style={{ width: 16, height: 16 }} /> {t('donations.membership')}
          </button>
          <button
            onClick={() => setTab('donation')}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 10,
              background: tab === 'donation' ? 'var(--red-400)' : 'transparent',
              color: tab === 'donation' ? 'white' : 'var(--text)',
              fontWeight: 700, fontSize: '0.82rem',
              border: 'none', cursor: 'pointer', transition: '0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <HeartOutlineIcon style={{ width: 16, height: 16 }} /> {t('donations.donate')}
          </button>
        </div>

        {tab === 'membership' ? (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
              {t('donations.membershipDesc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {plans.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderRadius: 14,
                      border: selectedPlan === p.id ? '1.5px solid var(--red-400)' : '1px solid var(--glass-border)',
                      background: selectedPlan === p.id ? 'var(--red-400)' : 'var(--glass-bg)',
                      backdropFilter: selectedPlan !== p.id ? 'blur(8px)' : 'none',
                      WebkitBackdropFilter: selectedPlan !== p.id ? 'blur(8px)' : 'none',
                      color: selectedPlan === p.id ? 'white' : 'var(--text)',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                    }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{p.label}</span>
                    {p.badge && (
                      <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 700, background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: 4, marginLeft: 8 }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>{p.price}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.period}</span>
                    {selectedPlan === p.id && <CheckIcon style={{ width: 16, height: 16, color: 'white', marginLeft: 6 }} />}
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
              {processing ? t('premium.processing') : <><CrownIcon style={{ width: 18, height: 18 }} /> {t('premium.subscribe')}</>}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: 10, textAlign: 'center', lineHeight: 1.5, opacity: 0.6 }}>
              {t('donations.cancel')}
            </p>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
              {t('donations.donationDesc2')}
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {donationAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => { setDonationAmount(amount); setCustomAmount(''); }}
                  style={{
                    flex: 1, padding: '14px 8px', borderRadius: 14,
                    border: donationAmount === amount && !customAmount ? '2px solid var(--red-400)' : '1px solid var(--glass-border)',
                    background: donationAmount === amount && !customAmount ? 'var(--red-400)' : 'var(--glass-bg)',
                    backdropFilter: donationAmount === amount && !customAmount ? 'none' : 'blur(8px)',
                    WebkitBackdropFilter: donationAmount === amount && !customAmount ? 'none' : 'blur(8px)',
                    color: donationAmount === amount && !customAmount ? 'white' : 'var(--text)', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{t('donations.customAmount')}</p>
              <input
                type="number"
                min="1"
                placeholder="$0.00"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '1px solid var(--glass-border)', fontSize: '1rem',
                  outline: 'none', background: 'var(--glass-bg)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: 'var(--text)', textAlign: 'center',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleDonate}
              disabled={processing || displayAmount < 1}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {processing ? t('premium.processing') : <><HeartOutlineIcon style={{ width: 18, height: 18 }} /> {t('donations.donate')} ${displayAmount}</>}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: 10, textAlign: 'center', opacity: 0.6 }}>
              {t('donations.demoMsg')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
