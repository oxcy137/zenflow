import { useRef, useEffect } from 'react';

export function useFlipOnEnter(index: number = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          const wrapper = el.closest('.flip-card-wrapper') as HTMLElement;
          if (wrapper) wrapper.style.opacity = '1';
          el.classList.add(`card-deal-${index}`);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    );

    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          addShimmerActive();
          visibleObserver.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    function handleAnimEnd() {
      el.classList.remove(`card-deal-${index}`);
      el.style.transform = 'rotateY(180deg)';
      el.dataset['flipped'] = 'true';
      visibleObserver.observe(el);
      el.removeEventListener('animationend', handleAnimEnd);
    }
    el.addEventListener('animationend', handleAnimEnd);

    function addShimmerActive() {
      const wrapper = el.closest('.flip-card-wrapper');
      if (wrapper && !wrapper.classList.contains('card-shimmer-active')) {
        wrapper.classList.add('card-shimmer-active');
        el.classList.add('card-shimmer-active');
      }
    }

    setTimeout(() => observer.observe(el), 50);

    return () => {
      observer.disconnect();
      visibleObserver.disconnect();
      el.removeEventListener('animationend', handleAnimEnd);
    };
  }, [index]);

  return ref;
}
