/**
 * Product names and one-line descriptions per language, keyed by slug.
 *
 * These sit in the front end rather than the database for the same reason the
 * category names do: the API — and so the single CDN cache entry in front of
 * it — stays identical for every reader, instead of needing a separate cached
 * copy of the catalogue per language.
 *
 * Names are transliterated rather than reinvented. Most of these are Indian
 * words already ("Panch Phoran", "Kala Namak", "Kasuri Methi"), so writing
 * them in the reader's own script is what the packet itself would do; the
 * brand word stays recognisably Subhadarshini throughout.
 *
 * Anything without an entry falls back to the English the API returned, so a
 * product added later shows up in English rather than blank.
 */
export interface ProductText {
  name: string;
  shortDescription?: string;
}

export type ProductDictionary = Record<string, ProductText>;

export const PRODUCT_LOADERS: Record<string, () => Promise<{ default: ProductDictionary }>> = {
  hi: () => import('./hi'),
  or: () => import('./or'),
  bn: () => import('./bn'),
  te: () => import('./te'),
  mr: () => import('./mr'),
  ta: () => import('./ta'),
  gu: () => import('./gu'),
  kn: () => import('./kn'),
  ml: () => import('./ml'),
  pa: () => import('./pa'),
  ur: () => import('./ur')
};
