import { useState, useRef, useCallback, useEffect } from 'react';
import type { Meditation } from '@/types';

interface IntroPageProps {
  onStartMeditation: (m: Meditation) => void;
  meditation: Meditation;
}

export function IntroPage({ onStartMeditation, meditation }: IntroPageProps) {
  const [swiped, setSwiped] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const dragStart = useRef(0);

  useEffect(() => {
    if (!swiped) return;
    const t = setTimeout(() => setShowPlay(true), 600);
    return () => clearTimeout(t);
  }, [swiped]);

  const handleDragStart = useCallback((y: number) => {
    dragStart.current = y;
  }, []);

  const handleDragEnd = useCallback((y: number) => {
    const dy = dragStart.current - y;
    if (dy > 60) {
      setSwiped(true);
    }
  }, []);

  return (
    <div
      style={{
        height: '100dvh', width: '100%',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}
      onTouchStart={e => handleDragStart(e.touches[0]!.clientY)}
      onTouchEnd={e => handleDragEnd(e.changedTouches[0]!.clientY)}
      onMouseDown={e => handleDragStart(e.clientY)}
      onMouseUp={e => handleDragEnd(e.clientY)}
    >
      <iframe
        src="https://assets.pinterest.com/ext/embed.html?id=680536193738020826"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          border: 'none', zIndex: 0,
          transform: swiped ? 'scale(1)' : 'scale(0.85)',
          opacity: swiped ? 1 : 0.3,
          transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease',
          pointerEvents: swiped ? 'auto' : 'none',
        }}
        scrolling="no"
        title="Intro"
      />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: swiped ? 'transparent' : 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)',
        pointerEvents: 'none',
        transition: 'background 1s ease',
      }} />

      {!swiped && (
        <div style={{
          position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'float 2.5s ease-in-out infinite',
        }}>
          <span style={{
            color: 'white', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            Desliza hacia arriba
          </span>
          <svg width="32" height="48" viewBox="0 0 24 40" fill="none" style={{ opacity: 0.8 }}>
            <path d="M12 38V2M12 2L3 11M12 2L21 11"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {showPlay && (
        <div style={{
          position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          animation: 'fadeIn 0.5s ease',
        }}>
          <button
            onClick={() => onStartMeditation(meditation)}
            style={{
              padding: '14px 36px', borderRadius: 50,
              background: 'var(--red-400)', color: 'white',
              fontSize: '1rem', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(204,0,0,0.4)',
            }}
          >
            Comenzar meditación
          </button>
        </div>
      )}
    </div>
  );
}
