import { useLanguage } from '@/context/LanguageContext';
import { OmIcon, PrayerIcon, EyeIcon, PotionIcon, CrownIcon, LockIcon } from '@/components/Icons';
import type { Session } from '@/types';

interface DailyChallengeProps {
  streak: number;
  sessions: Session[];
}

interface Milestone {
  days: number;
  title: string;
  description: string;
  icon: typeof OmIcon;
}

export function DailyChallenge({ streak, sessions }: DailyChallengeProps) {
  const { t, lang } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const hasSession = sessions.some(s => {
      if (!s.completed) return false;
      const sDate = new Date(s.date);
      return sDate.toDateString() === dateStr;
    });
    const isToday = i === 0;
    const isFuture = d > today;
    return { date: d, hasSession, isToday, isFuture };
  }).reverse();

  const milestones: Milestone[] = [
    { days: 3, title: t('daily.milestone.observer'), description: t('daily.milestone.observerDesc'), icon: EyeIcon },
    { days: 7, title: t('daily.milestone.silence'), description: t('daily.milestone.silenceDesc'), icon: PotionIcon },
    { days: 14, title: t('daily.milestone.gratitude'), description: t('daily.milestone.gratitudeDesc'), icon: PrayerIcon },
    { days: 21, title: t('daily.milestone.master'), description: t('daily.milestone.masterDesc'), icon: OmIcon },
    { days: 30, title: t('daily.milestone.premium'), description: t('daily.milestone.premiumDesc'), icon: CrownIcon },
  ];

  const dayLabels = lang !== 'es' ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const nextMilestone = milestones.find(m => streak < m.days);
  const progressToNext = nextMilestone ? (streak / nextMilestone.days) * 100 : 100;

  return (
    <div style={{
      width: '100%', maxWidth: 360,
      padding: '24px 20px', borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(120,120,120,0.3) 0%, rgba(120,120,120,0.08) 50%, rgba(120,120,120,0.18) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.25)',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
          {streak}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.1em', marginTop: 2 }}>
          {t('daily.streakLabel')}
        </p>
      </div>

      {nextMilestone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
            <span>{streak} {t('daily.days')}</span>
            <span>{nextMilestone.days} {t('daily.days')}</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(progressToNext, 100)}%`, height: '100%', background: 'var(--red-400)', borderRadius: 2, transition: 'width 0.5s ease' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textAlign: 'center', marginTop: 2 }}>
            {nextMilestone.days - streak} {t('daily.unlockIn')} <span style={{ color: 'white', fontWeight: 600 }}>{nextMilestone.title}</span>
          </p>
        </div>
      )}

      {streak >= milestones[milestones.length - 1]!.days && (
        <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
          {t('daily.allUnlocked2')}
        </p>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
        padding: 16, borderRadius: 16,
        background: 'rgba(120,120,120,0.08)',
      }}>
        {dayLabels.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, paddingBottom: 4 }}>
            {d}
          </div>
        ))}
        {last30Days.map((day, i) => (
          <div
            key={i}
            style={{
              width: '100%', aspectRatio: '1',
              borderRadius: '50%',
              background: day.hasSession ? 'var(--red-400)' : day.isToday ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: day.isToday ? '1.5px solid var(--red-400)' : '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', color: day.hasSession ? 'white' : 'rgba(255,255,255,0.15)',
              fontWeight: 600,
            }}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {milestones.map((m) => {
          const isUnlocked = streak >= m.days;
          const Icon = m.icon;
          return (
            <div
              key={m.days}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 14,
                background: isUnlocked ? 'rgba(204,0,0,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isUnlocked ? 'var(--red-400)' : 'rgba(255,255,255,0.06)'}`,
                opacity: isUnlocked ? 1 : 0.5,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isUnlocked ? 'var(--red-400)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isUnlocked ? 'white' : 'rgba(255,255,255,0.3)',
                flexShrink: 0,
              }}>
                {isUnlocked ? <Icon style={{ width: 16, height: 16 }} /> : <LockIcon style={{ width: 14, height: 14 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isUnlocked ? 'white' : 'rgba(255,255,255,0.5)' }}>
                  {isUnlocked ? '✓ ' : ''}{m.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {isUnlocked ? m.description : `${t('daily.unlockIn')} ${m.days} ${t('daily.days')}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
