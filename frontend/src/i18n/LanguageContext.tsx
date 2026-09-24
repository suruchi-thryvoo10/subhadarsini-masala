import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en, { Dictionary, TranslationKey } from './locales/en';
import { DEFAULT_LANGUAGE, isSupported } from './languages';

const STORAGE_KEY = 'subhadarshini.language';

/**
 * Static map so Vite can split each dictionary into its own chunk — only the
 * language the reader actually picks is ever downloaded. English is imported
 * eagerly above because it is the fallback for every missing key.
 */
const LOADERS: Record<string, () => Promise<{ default: Dictionary }>> = {
  hi: () => import('./locales/hi'),
  or: () => import('./locales/or'),
  bn: () => import('./locales/bn'),
  te: () => import('./locales/te'),
  mr: () => import('./locales/mr'),
  ta: () => import('./locales/ta'),
  gu: () => import('./locales/gu'),
  kn: () => import('./locales/kn'),
  ml: () => import('./locales/ml'),
  pa: () => import('./locales/pa'),
  ur: () => import('./locales/ur')
};

interface LanguageContextValue {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Reads the stored choice without throwing where storage is unavailable. */
const readStored = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupported(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);
  const [dictionary, setDictionary] = useState<Dictionary>(en);

  // The stored choice is applied after mount rather than in the initial state
  // so the first render matches what a prerender or a storage-less browser
  // would produce, and so a stale value can never break hydration.
  useEffect(() => {
    const stored = readStored();
    if (stored !== DEFAULT_LANGUAGE) setLanguageState(stored);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (language === DEFAULT_LANGUAGE) {
      setDictionary(en);
    } else {
      LOADERS[language]?.()
        .then((mod) => {
          if (!cancelled) setDictionary(mod.default);
        })
        .catch(() => {
          // A chunk that fails to load leaves the reader on English rather
          // than on a page of blank labels.
          if (!cancelled) setDictionary(en);
        });
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      // Deliberately not mirroring the document for right-to-left languages.
      // Only the chrome is translated; product copy, the founder biographies
      // and the recipes are still English, and an RTL document right-aligns
      // all of that and moves its full stops to the wrong end. A short RTL
      // run inside an LTR document already renders correctly on its own, so
      // the Urdu labels read properly as they are. Set dir from
      // getLanguage(language).dir here once the content itself is translated.
    }

    return () => {
      cancelled = true;
    };
  }, [language]);

  const setLanguage = useCallback((code: string) => {
    if (!isSupported(code)) return;
    setLanguageState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // A reader with storage blocked still gets the language for this visit.
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionary[key] ?? en[key] ?? key,
    [dictionary]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside a LanguageProvider');
  return ctx;
};

/** Shorthand for the common case of only needing the translate function. */
export const useT = () => useLanguage().t;
