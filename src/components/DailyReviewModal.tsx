import { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';

interface DailyReviewModalProps {
  onClose: () => void;
}

interface ReviewEntry {
  id: string;
  date: string;
  mood: number;
  wentWell: string;
  improve: string;
  gratitude: string;
}

const STORAGE_KEY = 'zenflow-reviews';

export function DailyReviewModal({ onClose }: DailyReviewModalProps) {
  const { t, lang } = useLanguage();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [mood, setMood] = useState<number>(0);
  const [wentWell, setWentWell] = useState('');
  const [improve, setImprove] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedReview, setSelectedReview] = useState<ReviewEntry | null>(null);

  const MOODS = [
    { emoji: '😢', label: t('review.moodVeryBad'), value: 1 },
    { emoji: '😕', label: t('review.moodBad'), value: 2 },
    { emoji: '😐', label: t('review.moodRegular'), value: 3 },
    { emoji: '🙂', label: t('review.moodGood'), value: 4 },
    { emoji: '😊', label: t('review.moodVeryGood'), value: 5 },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReviews(JSON.parse(stored));
    } catch {}
  }, []);

  const todayStr = new Date().toDateString();
  const alreadyDone = reviews.some(r => new Date(r.date).toDateString() === todayStr);

  const handleSave = () => {
    if (mood === 0) return;
    if (alreadyDone) return;
    const entry: ReviewEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      wentWell: wentWell.trim(),
      improve: improve.trim(),
      gratitude: gratitude.trim(),
    };
    const updated = [entry, ...reviews];
    setReviews(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return t('review.today');
    if (d.toDateString() === yesterday.toDateString()) return t('review.yesterday');
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const moodEmoji = (v: number) => MOODS.find(m => m.value === v)?.emoji ?? '';

  if (selectedReview) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 300, padding: 20, paddingBottom: 60,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setSelectedReview(null); }}
      >
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none', borderRadius: 24, padding: 28, maxWidth: 400, width: '100%',
          animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button className="btn-icon" onClick={() => setSelectedReview(null)} style={{ width: 36, height: 36 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
              {formatDate(selectedReview.date)}
            </span>
            <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
              <CloseIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: '3rem' }}>{moodEmoji(selectedReview.mood)}</span>
          </div>
          {selectedReview.wentWell && (
            <div style={{ marginBottom: 12, padding: 12, borderRadius: 12, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{t('review.wentWellLabel')}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{selectedReview.wentWell}</p>
            </div>
          )}
          {selectedReview.improve && (
            <div style={{ marginBottom: 12, padding: 12, borderRadius: 12, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{t('review.improveLabel')}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{selectedReview.improve}</p>
            </div>
          )}
          {selectedReview.gratitude && (
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{t('review.gratitudeLabel')}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{selectedReview.gratitude}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showHistory) {
    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    const startPad = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const reviewByDate: Record<string, ReviewEntry> = {};
    reviews.forEach(r => {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      reviewByDate[key] = r;
    });

    const monthName = new Date(calYear, calMonth).toLocaleDateString(lang !== 'es' ? 'en-US' : 'es-ES', { month: 'long', year: 'numeric' });

    const dayHeaders = [];
    const weekDays = lang !== 'es'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 0; i < 7; i++) {
      dayHeaders.push(
        <div key={`h${i}`} style={{ width: '14.28%', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>
          {weekDays[i]}
        </div>
      );
    }

    const cells = [];
    for (let p = 0; p < startPad; p++) {
      cells.push(<div key={`p${p}`} style={{ width: '14.28%' }} />);
    }
    for (let d = 1; d <= totalDays; d++) {
      const key = `${calYear}-${calMonth}-${d}`;
      const entry = reviewByDate[key];
      cells.push(
        <div
          key={`d${d}`}
          onClick={() => entry && setSelectedReview(entry)}
          style={{
            width: '14.28%', aspectRatio: '1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: entry ? 'pointer' : 'default',
            borderRadius: 8,
            transition: '0.15s',
            fontSize: entry ? '1.4rem' : '0.75rem',
            color: 'var(--text)',
          }}
          onMouseEnter={e => { if (entry) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { if (entry) e.currentTarget.style.background = ''; }}
        >
          {entry ? moodEmoji(entry.mood) : d}
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
        onClick={(e) => { if (e.target === e.currentTarget) setShowHistory(false); }}
      >
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none', borderRadius: 24, padding: 28, maxWidth: 400, width: '100%',
          animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{t('review.historyTitle2')}</h2>
            <button className="btn-icon" onClick={() => setShowHistory(false)} style={{ width: 36, height: 36 }}>
              <CloseIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button
              onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); } }}
              className="btn-icon"
              style={{ width: 32, height: 32 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{monthName}</span>
            <button
              onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); } }}
              className="btn-icon"
              style={{ width: 32, height: 32 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {dayHeaders}
            {cells}
          </div>
        </div>
      </div>
    );
  }

  if (saved) {
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
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{moodEmoji(mood)}</div>
          <h2 style={{ margin: '0 0 8px' }}>{t('review.saved')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
            {t('review.savedMessage')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-ghost" onClick={() => setShowHistory(true)} style={{ fontSize: '0.82rem' }}>
              {t('review.viewHistory')}
            </button>
            <button className="btn-primary" onClick={onClose} style={{ fontSize: '0.82rem', padding: '12px 24px' }}>
              {t('review.close')}
            </button>
          </div>
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
          border: 'none', borderRadius: 24, padding: 28, maxWidth: 400, width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
          animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('review.title')}</h2>
          <button className="btn-icon" onClick={onClose} style={{ width: 36, height: 36 }}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>
          {t('review.subtitle2')}
        </p>

        {alreadyDone ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: '1rem', color: 'white', fontWeight: 600, marginBottom: 16 }}>
              {t('review.alreadyDone2')}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn-ghost" onClick={() => setShowHistory(true)} style={{ fontSize: '0.82rem' }}>
                {t('review.viewHistory')}
              </button>
              <button className="btn-primary" onClick={onClose} style={{ fontSize: '0.82rem', padding: '12px 24px' }}>
                {t('review.close')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
              {t('review.moodQuestion')}
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    border: mood === m.value ? '2px solid var(--red-400)' : '1px solid var(--glass-border)',
                    background: mood === m.value ? 'var(--red-400)' : 'var(--glass-bg)',
                    backdropFilter: mood !== m.value ? 'blur(8px)' : 'none',
                    WebkitBackdropFilter: mood !== m.value ? 'blur(8px)' : 'none',
                    cursor: 'pointer', fontSize: '1.4rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: '0.2s',
                  }}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t('review.wentWellLabel')}</p>
                <textarea
                  value={wentWell}
                  onChange={e => setWentWell(e.target.value)}
                  placeholder={t('review.wentWellPlaceholder2')}
                  rows={2}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 12,
                    border: '1px solid var(--glass-border)', fontSize: '0.85rem',
                    resize: 'none', background: 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: 'var(--text)',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
                />
              </div>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t('review.improveLabel')}</p>
                <textarea
                  value={improve}
                  onChange={e => setImprove(e.target.value)}
                  placeholder={t('review.improvePlaceholder2')}
                  rows={2}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 12,
                    border: '1px solid var(--glass-border)', fontSize: '0.85rem',
                    resize: 'none', background: 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: 'var(--text)',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
                />
              </div>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t('review.gratitudeLabel')}</p>
                <textarea
                  value={gratitude}
                  onChange={e => setGratitude(e.target.value)}
                  placeholder={t('review.gratitudePlaceholder2')}
                  rows={2}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 12,
                    border: '1px solid var(--glass-border)', fontSize: '0.85rem',
                    resize: 'none', background: 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: 'var(--text)',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--red-400)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-ghost" onClick={() => setShowHistory(true)} style={{ fontSize: '0.82rem', flex: 1 }}>
                {t('review.history')}
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={mood === 0}
                style={{ fontSize: '0.82rem', flex: 1 }}
              >
                {t('review.saveReview')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
