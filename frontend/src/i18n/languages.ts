/**
 * The languages the site can be read in.
 *
 * `reviewed` records whether a human who speaks the language has checked the
 * strings. Unreviewed locales are still selectable, but the switcher labels
 * them so nobody mistakes an unchecked translation for approved brand copy.
 */
export interface Language {
  code: string;
  /** Endonym — shown in the switcher, so it reads in the reader's own script. */
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  reviewed: boolean;
}

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGES: Language[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', reviewed: true },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', reviewed: false },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', dir: 'ltr', reviewed: false },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', dir: 'ltr', reviewed: false },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', dir: 'ltr', reviewed: false },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', dir: 'ltr', reviewed: false },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', dir: 'ltr', reviewed: false },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', dir: 'ltr', reviewed: false },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', dir: 'ltr', reviewed: false },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', dir: 'ltr', reviewed: false },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', dir: 'ltr', reviewed: false },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', dir: 'rtl', reviewed: false }
];

export const isSupported = (code: string | null | undefined): code is string =>
  !!code && LANGUAGES.some((l) => l.code === code);

export const getLanguage = (code: string): Language =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
