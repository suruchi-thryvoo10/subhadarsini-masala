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

/**
 * A product maps to either a single image or an ordered gallery. The first entry
 * is the card/thumbnail shot; add further angles (back-of-pack nutrition panel,
 * lifestyle) by turning the value into an array.
 */
export const PRODUCT_IMAGES: Record<string, string | string[]> = {
  // --- Ground Spices ---
  'subhadarshini-pure-turmeric-powder': img('turmeric-powder'),
  'subhadarshini-red-chilli-powder': img('red-chilli-powder'),
  'subhadarshini-coriander-powder': img('coriander-powder'),
  'subhadarshini-cumin-powder': img('cumin-powder'),
  'subhadarshini-kashmiri-chilli-powder': img('kashmiri-chilli-powder'),
  'subhadarshini-black-pepper-powder': img('black-pepper-powder'),
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
  'subhadarshini-shahi-reserve-garam-masala': FALLBACK_IMAGES.ground,

  // --- Whole Spices ---
  'subhadarshini-premium-cumin-seeds': img('cumin-seeds'),
  'subhadarshini-mustard-seeds': img('mustard-seeds'),
  'subhadarshini-whole-black-pepper': img('black-peppercorns'),
  'subhadarshini-green-cardamom': img('green-cardamom'),
  'subhadarshini-whole-cloves': img('whole-cloves'),
  'subhadarshini-tej-patta': img('tej-patta'),
  'subhadarshini-panch-phoran': img('panch-phoran'),
  'subhadarshini-whole-red-chilli': img('red-chilli-whole'),
  'subhadarshini-coriander-seeds': img('coriander-seeds'),

  // --- Gourmet Seasonings ---
  'subhadarshini-posto-poppy-seed': FALLBACK_IMAGES.ground,
  'subhadarshini-roasted-bhaja-jeera-lanka': FALLBACK_IMAGES.ground,
  'subhadarshini-heritage-odia-dalma-masala': img('dalma-masala'),
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

export const RECIPE_IMAGES: Record<string, string> = {
  'traditional-odia-mamsa-kasa': '/images/recipes/mamsa-kasa.webp',
  'heritage-odia-dalma': '/images/recipes/odia-dalma.webp',
  'machha-besara-odia-fish-curry': '/images/recipes/machha-besara.webp'
};

export const CATEGORY_IMAGES: Record<string, string> = {
  'ground-spices': img('turmeric-powder'),
  'blended-spices': img('chicken-masala'),
  'whole-spices': img('cumin-seeds'),
  'gourmet-seasonings': img('chaat-masala'),
  'premium-food-items': img('soya-chunks'),
  'upcoming-products': img('sattu-powder')
};

/** Full ordered gallery for a product. Always at least one entry. */
export const resolveProductImages = (slug: string, fallback = FALLBACK_IMAGES.ground): string[] => {
  const entry = PRODUCT_IMAGES[slug];
  if (!entry) return fallback ? [fallback] : [];
  return Array.isArray(entry) ? entry : [entry];
};

/** Primary (card) image for a product. */
export const resolveProductImage = (slug: string, fallback = FALLBACK_IMAGES.ground): string =>
  resolveProductImages(slug, fallback)[0] || fallback;
