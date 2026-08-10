import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations } from '@/i18n/translations';

const STORAGE_KEY = 'zenflow-lang';

type Lang = 'es' | 'en' | 'fr' | 'ko' | 'ja' | 'zh' | 'it' | 'pt-BR' | 'pt' | 'de' | 'ar' | 'nl' | 'hi' | 'pl' | 'sv' | 'tr' | 'zh-TW';

const ALL_LANGS: Lang[] = ['es', 'en', 'fr', 'ko', 'ja', 'zh', 'it', 'pt-BR', 'pt', 'de', 'ar', 'nl', 'hi', 'pl', 'sv', 'tr', 'zh-TW'];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  allLangs: Lang[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (ALL_LANGS.includes(saved as Lang)) return saved as Lang;
    } catch {}
    return 'es';
  });

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, allLangs: ALL_LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
