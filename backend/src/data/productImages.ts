/**
 * Canonical product image catalogue.
 *
 * The files live in `frontend/public/images/products/` and are served by the
 * frontend origin, so the stored value is a root-relative path. That keeps the
 * same value working in local development (Vite dev server) and in production
 * (Vercel static hosting) without depending on any local filesystem path or on
 * hot-linking a third-party server.
 *
 * Source: official Subhadarshini packaging artwork, re-encoded to WebP at 900px.
 */

export const PRODUCT_IMAGE_BASE = '/images/products';

const img = (name: string) => `${PRODUCT_IMAGE_BASE}/${name}.webp`;

/** Neutral brand imagery used where no packaging shot exists yet. */
export const FALLBACK_IMAGES = {
  ground: img('ground-spice-generic'),
  blend: img('herb-blend-generic'),
  whole: img('kitchen-king')
};

export const PRODUCT_IMAGES: Record<string, string> = {
  // --- Ground Spices ---
  'subhadarshini-pure-turmeric-powder': img('turmeric-powder'),
  'subhadarshini-red-chilli-powder': img('red-chilli-powder'),
  'subhadarshini-coriander-powder': img('coriander-powder'),
  'subhadarshini-cumin-powder': img('cumin-powder'),
  'subhadarshini-kashmiri-chilli-powder': img('kashmiri-chilli-powder'),
  'subhadarshini-black-pepper-powder': FALLBACK_IMAGES.whole,
  'subhadarshini-pure-amchur-powder': FALLBACK_IMAGES.ground,

  // --- Blended Spices ---
  'subhadarshini-royal-garam-masala': FALLBACK_IMAGES.ground,
  'subhadarshini-special-chicken-curry-masala': img('chicken-masala'),
  'subhadarshini-mutton-meat-masala': img('meat-masala'),
  'subhadarshini-royal-dum-biryani-masala': img('biryani-masala'),
  'subhadarshini-kitchen-king-masala': img('curry-powder'),
  'subhadarshini-paneer-butter-masala': img('paneer-masala'),
  'subhadarshini-mumbai-pav-bhaji-masala': FALLBACK_IMAGES.ground,
  'subhadarshini-punjabi-rajma-masala': img('dal-tadka-mix'),
  'subhadarshini-dal-tadka-masala': img('dal-tadka-mix'),
  'subhadarshini-coastal-fish-fry-masala': img('fish-masala'),
  'subhadarshini-fish-curry-masala': img('fish-masala'),
  'subhadarshini-sambar-masala': img('sambar-masala'),
  'subhadarshini-sabji-masala': img('curry-powder'),
  'subhadarshini-chana-masala': img('chana-masala'),
  'subhadarshini-egg-curry-masala': img('egg-curry-masala'),
  'subhadarshini-shahi-reserve-garam-masala': img('sambar-masala-box'),

  // --- Whole Spices ---
  'subhadarshini-premium-cumin-seeds': img('cumin-seeds'),
  'subhadarshini-mustard-seeds': img('mustard-seeds'),
  'subhadarshini-whole-black-pepper': FALLBACK_IMAGES.whole,
  'subhadarshini-green-cardamom': FALLBACK_IMAGES.whole,
  'subhadarshini-whole-cloves': FALLBACK_IMAGES.whole,
  'subhadarshini-tej-patta': img('tej-patta'),
  'subhadarshini-panch-phoran': img('panch-phoran'),
  'subhadarshini-whole-red-chilli': img('red-chilli-whole'),
  'subhadarshini-coriander-seeds': img('coriander-seeds'),

  // --- Gourmet Seasonings ---
  'subhadarshini-posto-poppy-seed': FALLBACK_IMAGES.ground,
  'subhadarshini-roasted-bhaja-jeera-lanka': FALLBACK_IMAGES.ground,
  'subhadarshini-heritage-odia-dalma-masala': FALLBACK_IMAGES.blend,
  'subhadarshini-tangy-special-chaat-masala': img('chaat-masala'),
  'subhadarshini-kasuri-methi': img('kasuri-methi'),

  // --- Premium Food Items ---
  'subhadarshini-soya-chunks': img('soya-chunks'),
  'subhadarshini-hing-asafoetida': img('hing'),
  'subhadarshini-crushed-wheat-daliya': img('daliya'),
  'subhadarshini-black-salt': img('black-salt'),
  'subhadarshini-edible-soda': img('edible-soda'),
  'subhadarshini-corn-flour': img('corn-flour'),

  // --- Upcoming Products ---
  'subhadarshini-sattu-powder': img('sattu-powder')
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'ground-spices': img('turmeric-powder'),
  'blended-spices': img('chicken-masala'),
  'whole-spices': img('cumin-seeds'),
  'gourmet-seasonings': img('chaat-masala'),
  'premium-food-items': img('soya-chunks'),
  'upcoming-products': img('sattu-powder')
};

export const resolveProductImage = (slug: string, fallback = FALLBACK_IMAGES.ground): string =>
  PRODUCT_IMAGES[slug] || fallback;
