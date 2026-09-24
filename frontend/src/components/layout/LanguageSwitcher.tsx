import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Check, ChevronDown, X } from 'lucide-react';
import { LANGUAGES, getLanguage } from '../../i18n/languages';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  className?: string;
}

const MOBILE_BREAKPOINT = 640;

/**
 * The list is rendered through a portal on document.body rather than inside
 * the header. The header sets `overflow-x-clip`, which cut the panel off on a
 * narrow screen, and its `backdrop-blur` makes it the containing block for any
 * `position: fixed` child, so neither absolute nor fixed positioning could
 * escape it from inside. A portal sidesteps both.
 *
 * Below 640px the panel is a bottom sheet: twelve languages do not fit in a
 * dropdown on a 307px screen without spilling or needing a scroll the reader
 * cannot see the end of.
 */
export const LanguageSwitcher: React.FC<Props> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const measure = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    if (!mobile && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setAnchor({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
  }, []);

  useLayoutEffect(() => {
    if (open) measure();
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) {
        // The panel stops propagation itself, so anything reaching here is
        // outside both the trigger and the list.
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);

    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, measure]);

  const current = getLanguage(language);

  const options = (
    <ul role="listbox" aria-label={t('lang.label')} className="py-1">
      {LANGUAGES.map((lang) => {
        const selected = lang.code === language;
        return (
          <li key={lang.code}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              dir={lang.dir}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 sm:py-2 text-left hover:bg-spice-beige active:bg-spice-beige transition-colors ${
                selected ? 'bg-spice-beige' : ''
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-spice-brown truncate">
                  {lang.nativeName}
                </span>
                <span className="block text-[10px] text-ink-500 truncate">
                  {lang.englishName}
                  {/* Say plainly which languages a speaker has not checked. */}
                  {!lang.reviewed && ' · beta'}
                </span>
              </span>
              {selected && <Check className="w-4 h-4 text-spice-red shrink-0" />}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.label')}
        className="flex items-center gap-1.5 text-spice-cream hover:text-spice-turmeric transition-colors font-semibold"
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span>{current.nativeName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open &&
        createPortal(
          isMobile ? (
            <div className="fixed inset-0 z-[100] flex items-end" role="dialog" aria-modal="true">
              <div className="absolute inset-0 bg-spice-dark/50" aria-hidden="true" />
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="relative w-full max-h-[70vh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl"
              >
                <div className="sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b border-spice-brown/10">
                  <span className="font-serif font-bold text-spice-brown">{t('lang.label')}</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t('action.close')}
                    className="p-1 text-spice-brown/60 hover:text-spice-brown"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {options}
              </div>
            </div>
          ) : (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              style={{ top: anchor?.top ?? 0, right: anchor?.right ?? 0 }}
              className="fixed z-[100] w-56 max-h-80 overflow-y-auto rounded-2xl bg-white border border-spice-brown/15 shadow-xl"
            >
              {options}
            </div>
          ),
          document.body
        )}
    </div>
  );
};
