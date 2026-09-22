/** Shared display formatting, so every surface renders the same value the same way. */

const BRAND_PREFIX = /^subhadarshini\s+/i;

/**
 * Product titles are stored with the brand name in front ("Subhadarshini Royal
 * Garam Masala"). The brand is already established by the logo and the page
 * chrome, so cards and headings show only the product itself.
 */
export const displayProductName = (name?: string): string =>
  (name || '').replace(BRAND_PREFIX, '').trim() || (name || '');

/**
 * Ratings are stored at varying precision (4.7, 4.82, 5) and rendered raw they
 * came out as "4.7", "4.82" and "5" side by side. Always one decimal place.
 */
export const formatRating = (value?: number | null): string | null =>
  typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : null;

/** Whole-number counts, grouped for readability. */
export const formatCount = (value?: number | null): string =>
  typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-IN') : '0';
