import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  playing: boolean;
}

export function VideoBackground({ src, playing }: VideoBackgroundProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const onCanPlay = () => {
      if (playing) v.play().catch(() => {});
    };

    v.pause();
    v.src = src;
    v.load();
    v.playbackRate = 0.6;
    v.muted = true;

    v.addEventListener('canplay', onCanPlay, { once: true });
    return () => {
      v.removeEventListener('canplay', onCanPlay);
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: -1,
      display: playing ? 'block' : 'none',
      background: '#000',
    }}>
      <video
        ref={ref}
        autoPlay
        loop
        playsInline
        muted
        preload="auto"
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.35)',
      }} />
    </div>
  );
}
