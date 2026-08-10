import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import type { Meditation } from '@/types';
import { BreathingCircle } from '@/components/BreathingCircle';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CommentSection } from '@/components/CommentSection';
import { Timer } from '@/components/Timer';
import { ArrowLeftIcon, CloseIcon, PlayIcon, PauseIcon, getMeditationIcon } from '@/components/Icons';
import { useLanguage } from '@/context/LanguageContext';
import { getMeditationVideo } from '@/utils/video';
import { useEdgeTTS } from '@/hooks/useEdgeTTS';
import { meditationText, getStepText } from '@/i18n/meditationTexts';

interface MeditationPlayerProps {
  meditation: Meditation;
  onComplete: () => void;
  onBack: () => void;
  autoStart?: boolean;
  inline?: boolean;
}

export function MeditationPlayer({ meditation, onComplete, onBack, autoStart, inline }: MeditationPlayerProps) {
  const { lang, t } = useLanguage();
  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart ?? false);
  const [isPaused, setIsPaused] = useState(autoStart ?? false);
  const [videoKey, setVideoKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textTimeline = useRef<gsap.core.Timeline | null>(null);
  const ttsDoneRef = useRef(true);
  const { speak, stop: stopTTS } = useEdgeTTS();

  const currentStep = meditation.steps[stepIndex];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advanceStep = useCallback(() => {
    const next = stepIndex + 1;
    if (next >= meditation.steps.length) {
      clearTimer();
      setIsRunning(false);
      onComplete();
      return;
    }
    setStepIndex(next);
    setStepElapsed(0);
  }, [stepIndex, meditation.steps.length, clearTimer, onComplete]);

  const goBackStep = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setStepElapsed(0);
    }
  }, [stepIndex]);

  useEffect(() => {
    if (!isRunning || isPaused || stepIndex >= meditation.steps.length) return;
    intervalRef.current = setInterval(() => {
      setStepElapsed(prev => {
        const newVal = prev + 1;
        setElapsed(e => e + 1);
        if (currentStep && newVal >= currentStep.duration) {
          const isSpeech = currentStep.type !== 'video' && currentStep.type !== 'silence';
          if (isSpeech && !ttsDoneRef.current) return newVal;
          advanceStep();
          return 0;
        }
        return newVal;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, isPaused, stepIndex, meditation.steps.length, currentStep, advanceStep, clearTimer]);

  useEffect(() => {
    if (textRef.current) {
      textTimeline.current?.kill();
      textTimeline.current = gsap.timeline();
      textTimeline.current
        .set(textRef.current, { opacity: 0, y: 12 })
        .to(textRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
    return () => { textTimeline.current?.kill(); };
  }, [stepIndex]);

  useEffect(() => {
    if (isPaused) return;
    if (!currentStep || currentStep.type === 'video' || currentStep.type === 'silence') {
      ttsDoneRef.current = true;
      return;
    }
    ttsDoneRef.current = false;
    stopTTS();
    const stepText = getStepText(currentStep, lang);
    speak(stepText, lang, () => { ttsDoneRef.current = true; });
    return stopTTS;
  }, [stepIndex, isPaused, currentStep]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(p => !p);
  }, []);

  if (!isRunning) {
    if (autoStart) return null;
    return (
      <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, textAlign: 'center', paddingTop: 40 }}>
        <button className="btn-icon" onClick={onBack} style={{ position: 'absolute', top: 24, left: 24 }}>
          <ArrowLeftIcon style={{ width: 20, height: 20 }} />
        </button>

        <div style={{ width: 64, height: 64, color: 'white', marginTop: 16, animation: 'float 3s ease-in-out infinite' }}>
          {getMeditationIcon(meditation.iconType, { style: { width: '100%', height: '100%' } })}
        </div>

        <div>
          <h1 style={{ marginBottom: 8 }}>{meditation.title}</h1>
          <p style={{ color: 'var(--gray-500)', maxWidth: 320, lineHeight: 1.7, fontSize: '0.95rem' }}>{meditationText(meditation.id, 'description', lang, meditation.description, meditation.descriptionEn)}</p>
        </div>

        <div
          style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 24,
            padding: '20px 36px',
            textAlign: 'center',
            boxShadow: '8px 8px 18px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            {Math.floor(meditation.duration / 60)}
            <span style={{ fontSize: '1rem', fontWeight: 600, marginLeft: 4 }}>{t('player.min')}</span>
          </div>
          <p className="muted" style={{ marginTop: 4, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            {meditation.steps.length} {t('player.guidedSteps')}
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <CommentSection meditationId={meditation.id} />
        </div>

        <button className="btn-primary" onClick={start} style={{ fontSize: '1.1rem', padding: '16px 56px', marginTop: 4, background: 'rgba(0,0,0,0.25)', border: 'none', boxShadow: '6px 6px 14px rgba(0,0,0,0.5), -4px -4px 10px rgba(255,255,255,0.04)' }}>
          {t('player.start')}
        </button>
      </div>
    );
  }

  const innerContent = (
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: inline ? 10 : 28, width: '100%', maxWidth: 420, paddingTop: inline ? 0 : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <button
            onClick={onBack}
            style={{
              background: 'linear-gradient(135deg, rgba(187,0,0,0.85), rgba(58,0,0,0.88))',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '6px 6px 16px rgba(0,0,0,0.55), -4px -4px 12px rgba(255,255,255,0.03)',
            }}
        >
          {inline ? <ArrowLeftIcon style={{ width: 18, height: 18 }} /> : <CloseIcon style={{ width: 18, height: 18 }} />}
        </button>
        <span style={{ color: inline ? 'white' : 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600, textShadow: inline ? 'none' : '0 1px 4px rgba(0,0,0,0.2)' }}>{meditationText(meditation.id, 'title', lang, meditation.title, meditation.titleEn)}</span>
      </div>

      {currentStep?.type === 'video' && meditation.youtubeId ? (
        (() => { const v = getMeditationVideo(meditation, lang); return <VideoPlayer key={videoKey} autoPlay={videoKey > 0} youtubeId={v.youtubeId!} videoStart={v.videoStart} localPath={`/videos/practices/${v.youtubeId}.mp4`} title={meditation.title} onHalfway={advanceStep} />; })()
      ) : (
        <BreathingCircle
          type={(currentStep?.type === 'video' ? 'silence' : currentStep?.type) ?? 'silence'}
          duration={currentStep?.duration ?? 10}
          isActive={!isPaused}
        />
      )}

      <div style={{ width: '100%', textAlign: 'center', minHeight: currentStep?.type === 'video' ? 'auto' : (inline ? 60 : 80) }}>
        <p
          ref={textRef}
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: '1.25rem',
            lineHeight: 1.7,
            maxWidth: 360,
            margin: '0 auto',
            fontWeight: 400,
            textShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
        >
          {currentStep ? getStepText(currentStep, lang) : ''}
        </p>
      </div>

      {currentStep?.type === 'inhale' && (
        <div style={{ color: 'rgba(255,255,255,0.5)', animation: 'countdown-pulse 1.5s ease-in-out infinite' }}>
          <span style={{ fontSize: '1rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('player.inhale').toUpperCase()}</span>
        </div>
      )}
      {currentStep?.type === 'hold' && (
        <div style={{ color: 'rgba(255,255,255,0.45)' }}>
          <span style={{ fontSize: '1rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('player.hold').toUpperCase()}</span>
        </div>
      )}
      {currentStep?.type === 'exhale' && (
        <div style={{ color: 'rgba(255,255,255,0.5)', animation: 'countdown-pulse 1.5s ease-in-out infinite' }}>
          <span style={{ fontSize: '1rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('player.exhale').toUpperCase()}</span>
        </div>
      )}
      {currentStep?.type === 'mantra' && (
        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '1.8rem',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '0.15em',
            animation: 'float 2.5s ease-in-out infinite',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}
        >
          ॐ
        </div>
      )}

      <div
        style={{
          width: '100%',
          padding: inline ? '12px' : '18px',
          background: 'rgba(0,0,0,0.15)',
          borderRadius: 'var(--radius)',
          border: 'none',
          boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(255,255,255,0.03)',
        }}
      >
        <Timer
          elapsed={elapsed}
          total={meditation.duration}
          stepElapsed={stepElapsed}
          stepDuration={currentStep?.duration ?? 10}
        />
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
        <button
          onClick={goBackStep}
          className="btn-neumorph skip-btn"
          style={{ padding: 0, width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={stepIndex === 0}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5-6v12z"/>
          </svg>
        </button>
        <button
          onClick={() => {
            if (currentStep?.type === 'video') {
              setVideoKey(k => k + 1);
              setIsPaused(false);
              return;
            }
            togglePause();
          }}
          className={currentStep?.type === 'video' ? 'btn-neumorph btn-neumorph-play' : 'btn-neumorph'}
          style={{
            padding: currentStep?.type === 'video' ? 0 : '13px 30px',
            borderRadius: currentStep?.type === 'video' ? '50%' : 50,
            fontSize: '0.95rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isPaused || currentStep?.type === 'video' ? <PlayIcon style={{ width: 20, height: 20 }} /> : <><PauseIcon style={{ width: 16, height: 16 }} /> {t('player.pause')}</>}
        </button>
        <button
          onClick={() => { if (stepIndex < meditation.steps.length - 1) advanceStep(); }}
          className="btn-neumorph skip-btn"
          style={{ padding: 0, width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={stepIndex >= meditation.steps.length - 1}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 5,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 360,
        }}
      >
        {meditation.steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: i === stepIndex ? 'rgba(255,255,255,0.7)' : i < stepIndex ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)',
              transition: 'var(--transition)',
              transform: i === stepIndex ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );

  if (inline) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 0 }}>
        {innerContent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 120px',
        background: meditation.gradient,
        transition: 'background 0.8s ease',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {innerContent}
    </div>
  );
}
