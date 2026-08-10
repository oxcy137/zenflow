import { useRef, useCallback, useState } from 'react';

export function useEdgeTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string, onEnd?: () => void) => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang !== 'es' ? 'en-US' : 'es-ES';
    u.rate = 0.85;
    u.pitch = 1;
    u.volume = 1;

    const voices = window.speechSynthesis?.getVoices() ?? [];
    const preferred = voices.find(v => v.lang.startsWith(lang !== 'es' ? 'en' : 'es'));
    if (preferred) u.voice = preferred;

    u.onstart = () => setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); onEnd?.(); };
    u.onerror = () => { setIsSpeaking(false); onEnd?.(); };

    utteranceRef.current = u;
    window.speechSynthesis?.speak(u);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
