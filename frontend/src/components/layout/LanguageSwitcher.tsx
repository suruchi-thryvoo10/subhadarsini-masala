import React, { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { LANGUAGES, getLanguage } from '../../i18n/languages';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  /** `bar` suits the dark top strip; `panel` suits the mobile menu. */
  variant?: 'bar' | 'panel';
  className?: string;
}

export const LanguageSwitcher: React.FC<Props> = ({ variant = 'bar', className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = getLanguage(language);

  const trigger =
    variant === 'bar'
      ? 'flex items-center gap-1.5 text-spice-cream hover:text-spice-turmeric transition-colors font-semibold'
      : 'flex items-center justify-between w-full px-4 py-3 rounded-xl bg-spice-beige text-spice-brown font-bold text-sm';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.label')}
        className={trigger}
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>{current.nativeName}</span>
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('lang.label')}
          className={`absolute z-50 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl bg-white border border-spice-brown/15 shadow-xl py-1.5 ${
            variant === 'bar' ? 'right-0' : 'left-0'
          }`}
        >
          {LANGUAGES.map((lang) => {
            const selected = lang.code === language;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                dir={lang.dir}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-spice-beige transition-colors ${
                  selected ? 'bg-spice-beige' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-spice-brown truncate">
                    {lang.nativeName}
                  </span>
                  <span className="block text-[10px] text-ink-500 truncate">
                    {lang.englishName}
                    {/* Say plainly which languages have not been checked by a
                        speaker, so an unreviewed string is never mistaken for
                        approved brand copy. */}
                    {!lang.reviewed && ' · beta'}
                  </span>
                </span>
                {selected && <Check className="w-3.5 h-3.5 text-spice-red shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
