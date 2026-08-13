import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface SectionBackground {
  type: 'image' | 'video';
  src: string;
  label: string;
}

const HIGH_SPEC_DEFAULTS: Record<string, SectionBackground> = {
  home: { type: 'video', src: './videos/zen-bg.mp4', label: 'Galaxia Vintage' },
  practicas: { type: 'video', src: './videos/practicas-bg.mp4', label: 'Amanecer' },
  music: { type: 'video', src: './videos/music-bg.mp4', label: 'Audio-reactivo' },
  stats: { type: 'image', src: '/bg-stats.jpg', label: 'Estadísticas' },
  misticismo: { type: 'video', src: './videos/misticismo-bg.mp4', label: 'Místico' },
};

const VIDEO_OPTIONS: SectionBackground[] = [
  { type: 'video', src: './videos/zen-bg.mp4', label: 'Galaxia Vintage' },
  { type: 'video', src: './videos/music-bg.mp4', label: 'Audio-reactivo' },
  { type: 'video', src: './videos/practicas-bg.mp4', label: 'Amanecer' },
  { type: 'video', src: './videos/misticismo-bg.mp4', label: 'Místico' },
];

const IMAGE_OPTIONS: SectionBackground[] = [
  { type: 'image', src: '/bg-home.jpg', label: 'Zen' },
  { type: 'image', src: '/bg-practicas.jpg', label: 'Prácticas' },
  { type: 'image', src: '/bg-music.jpg', label: 'Música' },
  { type: 'image', src: '/bg-stats.jpg', label: 'Estadísticas' },
  { type: 'image', src: '/bg-1.jpg', label: 'Galaxia Púrpura' },
  { type: 'image', src: '/bg-2.jpg', label: 'Nebulosa' },
  { type: 'image', src: '/bg-3.jpg', label: 'Espacio Profundo' },
  { type: 'image', src: '/bg-4.jpg', label: 'Vía Láctea' },
  { type: 'image', src: '/bg-5.jpg', label: 'Cielo Estrellado' },
  { type: 'image', src: '/bg-6.jpg', label: 'Atardecer Cósmico' },
  { type: 'image', src: '/bg-7.jpg', label: 'Universo Vintage' },
  { type: 'image', src: '/bg-8.jpg', label: 'Galaxia Azul' },
  { type: 'image', src: '/bg-9.jpg', label: 'Supernova' },
  { type: 'image', src: '/bg-10.jpg', label: 'Amanecer Espacial' },
];

interface BackgroundContextValue {
  backgrounds: Record<string, SectionBackground>;
  setBackground: (section: string, bg: SectionBackground) => void;
  allOptions: SectionBackground[];
}

const STORAGE_KEY = 'zenflow-backgrounds';
const STORAGE_VERSION = 4;

interface StoredData {
  version: number;
  backgrounds: Record<string, SectionBackground>;
}

function loadSaved(): Record<string, SectionBackground> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.version === STORAGE_VERSION) {
        const merged = { ...HIGH_SPEC_DEFAULTS };
        for (const key of Object.keys(HIGH_SPEC_DEFAULTS)) {
          const savedBg = parsed.backgrounds?.[key];
          if (savedBg) {
            merged[key] = savedBg;
          }
        }
        return merged;
      }
    }
  } catch {}
  return { ...HIGH_SPEC_DEFAULTS };
}

function getStored(backgrounds: Record<string, SectionBackground>): StoredData {
  return { version: STORAGE_VERSION, backgrounds };
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [backgrounds, setBackgrounds] = useState<Record<string, SectionBackground>>(loadSaved);

  useEffect(() => {
    const hasVideo = Object.values(backgrounds).some(b => b.type === 'video');
    document.body.style.background = hasVideo ? 'none' : '';
    document.body.style.backgroundColor = hasVideo ? 'transparent' : '';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getStored(backgrounds)));
  }, [backgrounds]);

  const setBackground = useCallback((section: string, bg: SectionBackground) => {
    setBackgrounds(prev => ({ ...prev, [section]: bg }));
  }, []);

  const allOptions = [...VIDEO_OPTIONS, ...IMAGE_OPTIONS];

  return (
    <BackgroundContext.Provider value={{ backgrounds, setBackground, allOptions }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackgrounds() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackgrounds must be inside BackgroundProvider');
  return ctx;
}
