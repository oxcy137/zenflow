import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BreathingCircleProps {
  type: 'inhale' | 'hold' | 'exhale' | 'rest' | 'instruction' | 'silence' | 'mantra';
  duration: number;
  isActive: boolean;
}

export function BreathingCircle({ type, duration, isActive }: BreathingCircleProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!circleRef.current || !ringRef.current || !isActive) return;

    const tl = gsap.timeline();

    switch (type) {
      case 'inhale':
        tl.to(circleRef.current, {
          scale: 1.15,
          duration: duration * 0.45,
          ease: 'power2.out',
        }).to(circleRef.current, {
          scale: 1.15,
          duration: duration * 0.1,
          ease: 'none',
        });
        gsap.to(ringRef.current, {
          scale: 1.35,
          opacity: 0.12,
          duration,
          ease: 'power2.inOut',
        });
        gsap.to(outerRingRef.current, {
          scale: 1.5,
          opacity: 0.05,
          duration: duration * 0.7,
          ease: 'power2.out',
        });
        break;
      case 'hold':
        tl.to(circleRef.current, {
          scale: 1.15,
          duration: 0.2,
          ease: 'power2.out',
        }).to(circleRef.current, {
          scale: 1.15,
          duration: duration - 0.4,
          ease: 'none',
        });
        gsap.to(ringRef.current, {
          scale: 1.35,
          opacity: 0.15,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;
      case 'exhale':
        tl.to(circleRef.current, {
          scale: 0.85,
          duration: duration * 0.45,
          ease: 'power2.in',
        }).to(circleRef.current, {
          scale: 0.85,
          duration: duration * 0.1,
          ease: 'none',
        });
        gsap.to(ringRef.current, {
          scale: 0.65,
          opacity: 0,
          duration,
          ease: 'power2.inOut',
        });
        gsap.to(outerRingRef.current, {
          scale: 0.6,
          opacity: 0,
          duration: duration * 0.7,
          ease: 'power2.in',
        });
        break;
      default:
        gsap.to(circleRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(circleRef.current);
      gsap.killTweensOf(ringRef.current);
      gsap.killTweensOf(outerRingRef.current);
    };
  }, [type, duration, isActive]);

  return (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      <div
        ref={outerRingRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1.5px solid var(--red-400)',
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          inset: 6,
          borderRadius: '50%',
          border: '2px solid var(--red-400)',
          opacity: 0,
        }}
      />
      <div
        ref={circleRef}
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--red-400), var(--red-600))',
          boxShadow: '0 0 40px rgba(204, 0, 0, 0.3), 0 0 80px rgba(204, 0, 0, 0.1), inset 0 0 30px rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isActive ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
