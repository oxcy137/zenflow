import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoIcon, CloseIcon } from '@/components/Icons';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  onHalfway?: () => void;
  videoStart?: number;
  autoPlay?: boolean;
  localPath?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

export function VideoPlayer({ youtubeId, title, onHalfway, videoStart, autoPlay, localPath }: VideoPlayerProps) {
  const [fullscreen, setFullscreen] = useState(!!autoPlay);
  const isOffline = typeof window !== 'undefined' && localStorage.getItem('zenflow-offline-mode') === 'true';
  const [useLocal, setUseLocal] = useState(() => isOffline && !!localPath);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const halfwayRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ytPlayedRef = useRef(false);

  const shouldSkipYT = isOffline || useLocal;

  const startTracking = useCallback(() => {
    halfwayRef.current = false;
    intervalRef.current = setInterval(() => {
      if (useLocal) {
        const v = videoRef.current;
        if (!v?.duration) return;
        if (v.currentTime / v.duration >= 0.5 && !halfwayRef.current) {
          halfwayRef.current = true;
          onHalfway?.();
        }
      } else {
        const p = playerRef.current;
        if (!p?.getCurrentTime || !p?.getDuration) return;
        const current = p.getCurrentTime();
        const duration = p.getDuration();
        if (duration && current / duration >= 0.5 && !halfwayRef.current) {
          halfwayRef.current = true;
          onHalfway?.();
        }
      }
    }, 1000);
  }, [onHalfway, useLocal]);

  useEffect(() => {
    if (!fullscreen) {
      halfwayRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
      return;
    }

    if (shouldSkipYT) {
      if (useLocal) {
        const v = videoRef.current;
        if (v) v.play().catch(() => {});
        startTracking();
      }
      return;
    }

    const useLocalFallback = () => {
      if (localPath) {
        playerRef.current?.destroy();
        playerRef.current = null;
        setUseLocal(true);
      }
    };

    if (!navigator.onLine && localPath) {
      useLocalFallback();
      return;
    }

    let cancelled = false;
    let safeTimer: ReturnType<typeof setTimeout> | null = null;

    const createPlayer = () => {
      if (!containerRef.current || cancelled) return;
      ytPlayedRef.current = false;
      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: youtubeId,
          width: '100%',
          height: '100%',
          playerVars: { autoplay: 1, rel: 0, ...(videoStart ? { start: videoStart } : {}) },
          events: {
            onReady: () => {
              const iframe = containerRef.current?.querySelector('iframe');
              if (iframe) { iframe.style.width = '100%'; iframe.style.height = '100%'; }
            },
            onStateChange: (e: any) => {
              if (e.data === window.YT.PlayerState.PLAYING) {
                ytPlayedRef.current = true;
                if (safeTimer) { clearTimeout(safeTimer); safeTimer = null; }
                startTracking();
              }
            },
            onError: () => { if (!cancelled) useLocalFallback(); },
          },
        });
      } catch { if (!cancelled) useLocalFallback(); }
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onerror = useLocalFallback;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);
      window.onYouTubeIframeAPIReady = () => { if (!cancelled) createPlayer(); };
    }

    safeTimer = setTimeout(() => {
      if (!cancelled && !ytPlayedRef.current && localPath) useLocalFallback();
    }, 2000);

    return () => {
      cancelled = true;
      if (safeTimer) clearTimeout(safeTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [fullscreen, youtubeId, videoStart, localPath, shouldSkipYT, useLocal, startTracking]);

  useEffect(() => {
    if (!useLocal || !fullscreen) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    startTracking();
  }, [useLocal, fullscreen, startTracking]);

  return (
    <>
      <div
        onClick={() => setFullscreen(true)}
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          background: '#000',
        }}
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.25)',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(204, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.3s',
            }}
          >
            <VideoIcon style={{ width: 28, height: 28, color: 'white', marginLeft: 4 }} />
          </div>
        </div>
      </div>

      {fullscreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1,
            }}
          >
            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>{title}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
              {useLocal ? 'Offline' : ''}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <CloseIcon style={{ width: 24, height: 24 }} />
            </button>
          </div>
          {useLocal && localPath ? (
            <video
              ref={videoRef}
              src={localPath}
              controls
              autoPlay
              muted
              playsInline
              style={{ flex: 1, width: '100%', alignSelf: 'stretch' }}
            />
          ) : (
            <div ref={containerRef} style={{ flex: 1, width: '100%', alignSelf: 'stretch' }} />
          )}
        </div>
      )}
    </>
  );
}
