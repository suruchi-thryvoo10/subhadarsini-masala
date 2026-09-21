/**
 * Image helpers.
 *
 * Product images are stored in the database as root-relative paths
 * (e.g. `/images/products/turmeric-powder.webp`) and served from this app's own
 * `public/` directory, so they resolve identically in local development and in
 * production. Legacy absolute URLs from older seed data still pass through
 * unchanged.
 */

export const BRAND_LOGO = '/images/brand/logo.webp';
export const PRODUCT_IMAGE_FALLBACK = '/images/products/ground-spice-generic.webp';

export const resolveImageUrl = (src?: string | null, fallback = PRODUCT_IMAGE_FALLBACK): string => {
  if (!src) return fallback;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  return src.startsWith('/') ? src : `/${src}`;
};

export const productImageUrl = (product: { images?: string[] }): string =>
  resolveImageUrl(product?.images?.[0]);

/** Attach to <img onError> so a missing file degrades to the brand fallback once. */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback = PRODUCT_IMAGE_FALLBACK
) => {
  const el = event.currentTarget;
  if (el.dataset.fallbackApplied === 'true') return;
  el.dataset.fallbackApplied = 'true';
  el.src = fallback;
};
