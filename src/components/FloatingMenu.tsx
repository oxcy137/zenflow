import { useState, useRef, useEffect } from 'react';
import { CrownIcon, MusicIcon, SparklesIcon, LeafIcon, PotionIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';
import { useMenuRotation } from '@/hooks/useMenuRotation';
import type { Page } from '@/types';

interface FloatingMenuProps {
  onPremium: () => void;
  onNavigate?: (page: Page) => void;
}

const MAIN_CIRCLE = 260;
const INNER_DIVIDER = 140;

const BASE_ANGLES = [-45, -75, -105, -135, -165];
const RADIUS = 97;

export function FloatingMenu({ onPremium, onNavigate }: FloatingMenuProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { rotation } = useMenuRotation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node) &&
          menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  const handleClick = (id: string) => {
    close();
    if (id === 'premium') { onPremium(); }
    if (id.startsWith('nav-') && onNavigate) {
      onNavigate(id.replace('nav-', '') as Page);
    }
  };

  const items = [
    { id: 'nav-home', label: t('fab.home'), icon: LeafIcon },
    { id: 'nav-practicas', label: t('fab.practicas'), icon: SparklesIcon },
    { id: 'nav-music', label: t('fab.music'), icon: MusicIcon },
    { id: 'nav-misticismo', label: 'Mystic', icon: PotionIcon },
    { id: 'premium', label: t('fab.premium'), icon: CrownIcon },
  ];

  return (
    <>
      <div ref={menuRef} className={`menu-container${open ? ' open' : ''}`}>
        <div
          className="menu-rotation-wrapper"
            style={{
              position: 'absolute', right: 28, bottom: 28,
              transform: `scale(${open ? 1 : 0})`,
              transformOrigin: '0 0',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
            }}
        >
          <div style={{
            position: 'absolute', left: -MAIN_CIRCLE / 2, top: -MAIN_CIRCLE / 2,
            width: MAIN_CIRCLE, height: MAIN_CIRCLE, borderRadius: '50%',
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            WebkitMask: `radial-gradient(circle, transparent ${INNER_DIVIDER / 2}px, black ${INNER_DIVIDER / 2 + 1}px)`,
            mask: `radial-gradient(circle, transparent ${INNER_DIVIDER / 2}px, black ${INNER_DIVIDER / 2 + 1}px)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', left: 0, top: 0,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '0 0',
          }}>
          <svg
            viewBox="0 0 260 260"
            style={{
              position: 'absolute', left: -MAIN_CIRCLE / 2, top: -MAIN_CIRCLE / 2,
              width: MAIN_CIRCLE, height: MAIN_CIRCLE,
              pointerEvents: 'none',
            }}
          >
            <circle cx="130" cy="130" r="129" fill="none" stroke="none" />
            <circle cx="130" cy="130" r="70" fill="none" stroke="none" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              const x1 = 130 + 70 * Math.cos(angle);
              const y1 = 130 + 70 * Math.sin(angle);
              const x2 = 130 + 129 * Math.cos(angle);
              const y2 = 130 + 129 * Math.sin(angle);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeWidth="1.5" />
              );
            })}
          </svg>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            {items.map((item, i) => {
              const Icon = item.icon;
              const angleRad = (BASE_ANGLES[i] ?? -120) * Math.PI / 180;
              const x = Math.round(RADIUS * Math.cos(angleRad));
              const y = Math.round(RADIUS * Math.sin(angleRad));
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className="menu-item"
                  title={item.label}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) scale(${open ? 1 : 0})`,
                    opacity: open ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.04}s`,
                  }}
                >
                  <span style={{ display: 'inline-block', transform: `rotate(${-rotation}deg)` }}>
                    <Icon style={{ width: 22, height: 22 }} />
                  </span>
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className={`fab-btn${open ? ' open' : ''}`}
      >
        <div className="fab-squares">
          <div className="fab-square s1" />
          <div className="fab-square s2" />
        </div>
      </button>
    </>
  );
}
