import { useLanguage } from '@/context/LanguageContext';
import { PotionIcon } from '@/components/Icons';

export function MisticismoPage() {
  const { t } = useLanguage();

  return (
    <div className="misticismo-container" style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 28, textAlign: 'center', gap: 16,
    }}>
      <div className="misticismo-icon" style={{ width: 80, height: 80, color: 'white', opacity: 0.4, animation: 'float 3s ease-in-out infinite' }}>
        <PotionIcon style={{ width: '100%', height: '100%' }} />
      </div>
      <h1 className="shimmer" data-text={t('misticismo.title')} style={{ fontSize: '1.6rem', margin: 0 }}>
        {t('misticismo.title')}
      </h1>
      <p className="misticismo-text misticismo-subtitle" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 280 }}>
        {t('misticismo.subtitle')}
      </p>
      <div className="misticismo-glass" style={{
        marginTop: 8, padding: '12px 28px', borderRadius: 12,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', fontStyle: 'italic', letterSpacing: '0.05em', margin: 0 }}>
          {t('misticismo.comingSoon')}
        </p>
      </div>
      <p className="misticismo-text misticismo-desc" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', maxWidth: 260, lineHeight: 1.5 }}>
        {t('misticismo.desc')}
      </p>
    </div>
  );
}
