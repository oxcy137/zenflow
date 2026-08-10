import { useState, useRef, useEffect } from 'react';
import { CrownIcon, ChartIcon, MusicIcon, SparklesIcon, LeafIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';
import type { Page } from '@/types';

interface FloatingMenuProps {
  onPremium: () => void;
  onNavigate?: (page: Page) => void;
}

const MAIN_CIRCLE = 260;
const INNER_DIVIDER = 140;

const BASE_ANGLES = [-70, -95, -120, -145, -170];
const RADIUS = 105;

export function FloatingMenu({ onPremium, onNavigate }: FloatingMenuProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [angleOffsets, setAngleOffsets] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('zenflow-menu-offsets') || '[0,0,0,0,0]'); }
    catch { return [0,0,0,0,0]; }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const v = localStorage.getItem('zenflow-menu-offsets');
        if (v) setAngleOffsets(JSON.parse(v));
      } catch {}
    };
    window.addEventListener('zenflow:menu-offsets', handler);
    return () => window.removeEventListener('zenflow:menu-offsets', handler);
  }, []);

  function getItemPos(i: number): { x: number; y: number } {
    const angle = (BASE_ANGLES[i] ?? -120) + (angleOffsets[i] ?? 0);
    const angleRad = angle * Math.PI / 180;
    return {
      x: Math.round(RADIUS * Math.cos(angleRad)),
      y: Math.round(RADIUS * Math.sin(angleRad)),
    };
  }

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
    { id: 'nav-stats', label: t('fab.stats'), icon: ChartIcon },
    { id: 'premium', label: t('fab.premium'), icon: CrownIcon },
  ];

  return (
    <>
      <div ref={menuRef} className={`menu-container${open ? ' open' : ''}`}>
        {open && (
          <div style={{ position: 'absolute', right: 28, bottom: 28 }}>
            <div style={{
              position: 'absolute', left: -MAIN_CIRCLE / 2, top: -MAIN_CIRCLE / 2,
              width: MAIN_CIRCLE, height: MAIN_CIRCLE, borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', left: -MAIN_CIRCLE / 2, top: -MAIN_CIRCLE / 2,
              width: MAIN_CIRCLE, height: MAIN_CIRCLE, borderRadius: '50%',
              pointerEvents: 'none',
              border: '2px solid #FFFFFF',
              overflow: 'hidden',
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', left: '50%', bottom: '50%',
                  width: 2, height: MAIN_CIRCLE / 2,
                  background: '#FFFFFF',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${i * 30}deg)`,
                }} />
              ))}
            </div>
            <div style={{
              position: 'absolute', left: -INNER_DIVIDER / 2, top: -INNER_DIVIDER / 2,
              width: INNER_DIVIDER, height: INNER_DIVIDER, borderRadius: '50%',
              border: '2px solid #FFFFFF',
              pointerEvents: 'none',
            }} />
          </div>
        )}
        {items.map((item, i) => {
          const Icon = item.icon;
          const pos = getItemPos(i);
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="menu-item"
              title={item.label}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.9)',
                border: 'none',
                boxShadow: 'none',
                backdropFilter: 'none',
                transitionDelay: `${i * 0.04}s`,
                ...(open ? { transform: `translate(${pos.x + (i === 0 ? 2 : i === 4 ? 2 : 0)}px, ${pos.y + (i === 0 ? 2 : 0)}px) scale(1)`, opacity: 1 } : {}),
              }}
            >
              <Icon style={{ width: 22, height: 22 }} />
            </button>
          );
        })}
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
