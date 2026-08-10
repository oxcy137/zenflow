import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { meditations } from '@/data/meditations';
import { MeditationCard } from '@/components/MeditationCard';
import { MeditateIcon, PlayIcon } from '@/components/Icons';
import type { Meditation } from '@/types';

const YOGA_IDS = ['yoga-exito', 'yoga-espalda', 'explorar-interior', 'isha-upa-yoga'];

interface Study {
  id: string;
  title: string;
  meditation: string;
  institutions: string;
  description: string;
  url: string;
}

const studies: Study[] = [
  {
    id: 'isha-anxiety',
    title: 'Isha Kriya — Anxiety & Depression',
    meditation: 'Isha Kriya',
    institutions: 'Harvard Medical School, Indiana University, University of Pittsburgh',
    description: 'Online guided meditation training (Isha Kriya) significantly improves anxiety and depression symptoms. A randomized controlled trial demonstrating the efficacy of a 4-week Isha Kriya intervention.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36213913/',
  },
  {
    id: 'isha-stress',
    title: '15-Min Isha Kriya — Stress & Mood',
    meditation: 'Isha Kriya',
    institutions: 'Harvard Medical School, Rutgers University, Indiana University',
    description: 'A single 15-minute guided Isha Kriya session reduces stress and mood disturbances among operating room professionals. Demonstrates acute effects of brief meditation.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32665843/',
  },
  {
    id: 'shambhavi-stress',
    title: 'Shambhavi — Stress & Well-being',
    meditation: 'Shambhavi Mahamudra Kriya',
    institutions: 'UCSD, Indiana University School of Medicine',
    description: 'Effects of Shambhavi Mahamudra Kriya on perceived stress and general well-being. Shows significant reductions in stress and improvements in overall well-being.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29228793/',
  },
  {
    id: 'advanced-brain',
    title: 'Advanced Meditation — Brain Connectivity',
    meditation: 'Advanced Meditation (Inner Engineering)',
    institutions: 'Harvard Medical School, Massachusetts General Hospital',
    description: 'Advanced meditation alters resting-state brain network connectivity, correlating with improved mindfulness. fMRI study showing neural plasticity from long-term practice.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/34777312/',
  },
  {
    id: 'isha-hrv',
    title: 'Isha Yoga — Heart Rate Variability',
    meditation: 'Isha Yoga',
    institutions: 'Peer-reviewed biomedical journal (PubMed indexed)',
    description: 'Measurement of Isha Yoga effect on cardiac autonomic nervous system using Heart Rate Variability. Demonstrates parasympathetic activation during practice.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22869999/',
  },
  {
    id: 'inner-engineering-genomic',
    title: 'Inner Engineering — Immune System',
    meditation: 'Inner Engineering',
    institutions: 'University of Florida and collaborators',
    description: 'Large-scale genomic study reveals robust activation of the immune system following advanced Inner Engineering meditation retreat. Shows gene expression changes.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/34907015/',
  },
  {
    id: 'sadhguru-center',
    title: 'Sadhguru Center Research Portal',
    meditation: 'Various',
    institutions: 'Beth Israel Deaconess Medical Center, Harvard Medical School',
    description: 'Research portal dedicated to studying the effects of Isha yoga practices on health, well-being, and consciousness through clinical trials and neuroimaging studies.',
    url: 'https://www.sadhgurucenter.org/research/',
  },
  {
    id: 'isha-repository',
    title: 'Isha Research Repository',
    meditation: 'Isha Kriya, Shambhavi, Upa Yoga, Inner Engineering',
    institutions: 'Isha Foundation',
    description: 'Official repository of all research conducted on Isha practices including Isha Kriya, Shambhavi Mahamudra, Simha Kriya, Upa Yoga, and Inner Engineering.',
    url: 'https://isha.sadhguru.org/en/wisdom/research',
  },
];

function YogaCard({ m, expanded, onClick }: { m: Meditation; expanded: boolean; onClick: () => void }) {
  const offline = typeof window !== 'undefined' && localStorage.getItem('zenflow-offline-mode') === 'true';
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.25) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
        {expanded ? (
          offline ? (
            <video
              src={`/videos/practices/${m.youtubeId}.mp4`}
              autoPlay
              muted
              loop
              controls
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${m.youtubeId}?autoplay=1&playsinline=1&rel=0`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )
        ) : (
          <>
            {offline ? (
              <video
                src={`/videos/practices/${m.youtubeId}.mp4`}
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <img
                src={`https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg`}
                alt={m.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.15)', cursor: 'pointer',
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'rgba(255,77,77,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(204,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}>
                <PlayIcon style={{ width: 22, height: 22, color: 'rgba(255,77,77,0.85)' }} />
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.2 }}>{m.title}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</div>
        {expanded && (
          <div onClick={e => { e.stopPropagation(); onClick(); }} style={{ marginTop: 8, fontSize: '0.72rem', color: '#ff0000', cursor: 'pointer' }}>Cerrar video</div>
        )}
      </div>
    </div>
  );
}

interface PracticasPageProps {
  onSelect: (meditation: Meditation) => void;
  user: { username: string } | null;
  onAuthClick: () => void;
  onLogout: () => void;
  totalPoints: number;
}

export function PracticasPage({ onSelect, totalPoints }: PracticasPageProps) {
  const { t, lang } = useLanguage();
  const others = meditations.filter(m => m.id !== 'miracle-of-mind');
  const yogaMeds = meditations.filter(m => YOGA_IDS.includes(m.id));
  const textRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'practicas' | 'yoga'>('practicas');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [textExpanded, setTextExpanded] = useState(false);
  const [studyModal, setStudyModal] = useState<Study | null>(null);
  

  useEffect(() => {
    setTextExpanded(false);
  }, [tab]);

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      scrollSnapType: 'y mandatory',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        height: '100dvh',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        padding: '56px 24px 90px',
        position: 'relative',
      }}>
        <div className="practicas-pill" style={{
          padding: '12px 20px 12px 16px',
          borderRadius: 50,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.18) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          width: 'auto',
          alignSelf: 'flex-start',
          boxShadow: '0 0 16px 1px rgba(255,255,255,0.03), 0 0 8px 3px rgba(255,255,255,0.05), 0 0 4px 7px rgba(255,255,255,0.08)',
        }}>
          <MeditateIcon className="shimmer-breathe" style={{ width: 44, height: 44, color: '#aaaaaa' }} />
          <h1 className="shimmer" data-text="ZenFlow" style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
            ZenFlow
          </h1>
        </div>
        <div ref={textRef} onClick={() => setTextExpanded(prev => !prev)} className="benefit-card" style={{
          marginTop: 12,
          padding: '16px 18px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 8,
          maxHeight: textExpanded ? 600 : 148,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'max-height 0.4s ease',
          position: 'relative',
        }}>
          <h2 key={lang} className="shimmer" data-text={t('practicas.quote1')} style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {t('practicas.quote1')}
          </h2>
          <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: 0, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)' }}>
            {t('practicas.quote2')}
          </p>
          <p style={{ fontSize: '0.82rem', fontWeight: 400, margin: 0, lineHeight: 1.4, color: 'rgba(255,255,255,0.6)' }}>
            {t('practicas.quote3')}
          </p>
          <p style={{ fontSize: '0.82rem', fontWeight: 400, margin: 0, lineHeight: 1.4, color: 'rgba(255,255,255,0.55)' }}>
            {t('practicas.quote4')}
          </p>
          <div style={{ marginTop: 4, fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
            Estudios científicos
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            {studies.map(s => {
              const labels: Record<string, string> = {
                'isha-anxiety': 'Harvard · Anxiety & Depression',
                'isha-stress': 'Harvard · Stress & Mood',
                'shambhavi-stress': 'UCSD · Shambhavi Kriya',
                'advanced-brain': 'Harvard · Brain Connectivity',
                'isha-hrv': 'PubMed · Isha Yoga',
                'inner-engineering-genomic': 'Florida · Immune System',
                'sadhguru-center': 'Harvard · Sadhguru Center',
                'isha-repository': 'Isha Foundation',
              };
              return (
                <button
                  key={s.id}
                  onClick={(e) => { e.stopPropagation(); setStudyModal(s); }}
                  style={{
                    background: 'rgba(180,180,180,0.15)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 999,
                    padding: '7px 16px',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(120,20,20,0.35)';
                    e.currentTarget.style.borderColor = 'rgba(150,30,30,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(120,20,20,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(180,180,180,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {labels[s.id] || s.title}
                </button>
              );
            })}
          </div>
          {!textExpanded && (
            <div style={{
              position: 'absolute', bottom: 8, right: 8,
              pointerEvents: 'none', opacity: 0.5,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.4 }}>
          <svg className="shimmer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
          <span className="shimmer" data-text={t('practicas.swipe')}>{t('practicas.swipe')}</span>
        </div>
      </div>

      <div style={{
        minHeight: '100dvh',
        scrollSnapAlign: 'start',
        padding: '100px 24px 100px',
      }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div className={`tab-border-wrap ${tab !== 'practicas' ? 'tab-border-wrap-fade' : ''}`}>
            <button
              className="tab-btn"
              onClick={() => setTab('practicas')}
            >
              <span className="shimmer" data-text="Prácticas">Prácticas</span>
            </button>
          </div>
          <div className={`tab-border-wrap ${tab !== 'yoga' ? 'tab-border-wrap-fade' : ''}`}>
            <button
              className="tab-btn"
              onClick={() => setTab('yoga')}
            >
              <span className="shimmer" data-text="Yoga & Meditación">Yoga & Meditación</span>
            </button>
          </div>
        </div>

        {tab === 'practicas' ? (
          <div className="card-grid" style={{ position: 'relative' }}>
            {others.map((m, i) => (
              <div key={m.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <MeditationCard meditation={m} totalPoints={totalPoints} onClick={() => onSelect(m)} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {yogaMeds.map(m => (
              <YogaCard key={m.id} m={m} expanded={expandedVideo === m.id} onClick={() => setExpandedVideo(expandedVideo === m.id ? null : m.id)} />
            ))}
          </div>
        )}
      </div>

      {studyModal && (
        <div
          onClick={() => setStudyModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            padding: 24,
          }}
        >
          <div
            className="study-modal-scroll"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 400, width: '100%', maxHeight: '60vh', overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent',
              background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.95) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '24px 32px 24px 24px',
              boxShadow: '0 0 16px 1px rgba(255,255,255,0.02), 0 0 8px 3px rgba(255,255,255,0.04), 0 0 4px 7px rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--red-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              {studyModal.meditation}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0', lineHeight: 1.2, color: 'white' }}>
              {studyModal.title}
            </h3>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginBottom: 12, fontStyle: 'italic' }}>
              {studyModal.institutions}
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.75)', margin: '0 0 16px 0' }}>
              {studyModal.description}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href={studyModal.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 18px',
                  background: 'var(--red-400)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: '0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Ver estudio
              </a>
              <button
                onClick={() => setStudyModal(null)}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
