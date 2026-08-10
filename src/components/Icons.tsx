import type { SVGProps } from 'react';

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} />
  );
}

function SvgBig(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props} />
  );
}

export function OmIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgBig viewBox="0 0 28 28" {...props}>
      <path d="M14 4C10 4 6 7 6 12c0 5 8 12 8 12s8-7 8-12c0-5-4-8-8-8z" />
      <path d="M14 8c-2 0-4 1.5-4 4 0 3 4 7 4 7s4-4 4-7c0-2.5-2-4-4-4z" />
      <circle cx="14" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </SvgBig>
  );
}

export function MeditateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 22v-6l-3-3" />
      <path d="M12 16l3-3" />
      <path d="M21 12c-3 2-6 4-9 4s-6-2-9-4" />
    </Svg>
  );
}

export function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <rect x="4" y="14" width="4" height="6" rx="1" />
      <rect x="10" y="10" width="4" height="10" rx="1" />
      <rect x="16" y="6" width="4" height="14" rx="1" />
    </Svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </Svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </Svg>
  );
}

export function HeartOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
    </Svg>
  );
}

export function HeartFilledIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function TipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M12 18v-6" />
      <path d="M12 9h.01" />
      <circle cx="12" cy="12" r="10" />
    </Svg>
  );
}

export function VideoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <rect x="2" y="4" width="16" height="16" rx="2" />
      <polygon points="22 8 18 12 22 16 22 8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </Svg>
  );
}

export function WindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
    </Svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function PrayerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M12 2a4 4 0 00-4 4c0 2 4 6 4 6s4-4 4-6a4 4 0 00-4-4z" />
      <path d="M7 22h10" />
      <path d="M12 22v-6" />
    </Svg>
  );
}

export function CosmosIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </Svg>
  );
}

export function CandleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M12 2a3 3 0 00-3 3c0 2 3 5 3 5s3-3 3-5a3 3 0 00-3-3z" />
      <rect x="9" y="10" width="6" height="8" rx="1" />
      <path d="M7 18h10" />
      <rect x="10" y="20" width="4" height="2" rx="1" />
    </Svg>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </Svg>
  );
}

export function SunriseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="10" r="4" />
      <path d="M12 2v4" />
      <path d="M4.93 10.93l2.83-2.83" />
      <path d="M19.07 10.93l-2.83-2.83" />
      <path d="M2 18h20" />
      <path d="M6 22h12" />
    </Svg>
  );
}

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </Svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </Svg>
  );
}

export function CrownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402" />
      <path d="m20 9-3 9" />
      <path d="m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34" />
      <path d="M7 18 4 9" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="20" cy="7" r="2" />
      <circle cx="4" cy="7" r="2" />
    </Svg>
  );
}

export function ImageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function MusicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </Svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M17.5 12.5a5.5 5.5 0 1 1-5-5.5" />
      <path d="M17.5 9.5V12.5H14.5" />
    </svg>
  );
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function BodyScanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5v5" />
      <path d="M9 10 5.5 14" />
      <path d="M15 10 18.5 14" />
      <path d="M12 12.5 8 18" />
      <path d="M12 12.5 16 18" />
      <path d="M4 12h5" strokeWidth="1" opacity="0.5" />
      <path d="M15 12h5" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function WaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h1" />
      <path d="M6 8v8" />
      <path d="M10 4v16" />
      <path d="M14 6v12" />
      <path d="M18 10v4" />
      <path d="M22 12h-1" />
    </svg>
  );
}

export function VolumeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export function TuningForkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5" r="3" />
      <path d="M18 8v11" />
      <path d="M4 15c0 2.5 2 4 4 4s4-1.5 4-4-2-4-4-4-4 1.5-4 4z" />
      <path d="M12 11v5" />
      <path d="M8 7v8" />
    </svg>
  );
}

export function PotionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
      <path d="M6.453 15h11.094" />
      <path d="M8.5 2h7" />
    </Svg>
  );
}

export type MeditationIconType = 'wind' | 'meditate' | 'om' | 'eye' | 'prayer' | 'cosmos' | 'candle' | 'bell' | 'sunrise';

export function getMeditationIcon(type: string, props: SVGProps<SVGSVGElement> = {}) {
  switch (type) {
    case 'wind': return <WindIcon {...props} />;
    case 'meditate': return <MeditateIcon {...props} />;
    case 'om': return <OmIcon {...props} />;
    case 'eye': return <EyeIcon {...props} />;
    case 'prayer': return <PrayerIcon {...props} />;
    case 'cosmos': return <CosmosIcon {...props} />;
    case 'candle': return <CandleIcon {...props} />;
    case 'bell': return <BellIcon {...props} />;
    case 'sunrise': return <SunriseIcon {...props} />;
    default: return <MeditateIcon {...props} />;
  }
}
