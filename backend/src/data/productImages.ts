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

/**
 * Shown when no authentic packaging photograph exists for a product yet. A
 * branded holding card is used in preference to generic stock, so a card never
 * implies the customer is buying something the photograph does not show.
 */
export const PLACEHOLDER_IMAGE = img('photo-coming-soon');

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
  'subhadarshini-black-pepper-powder': PLACEHOLDER_IMAGE,
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
  'subhadarshini-whole-black-pepper': PLACEHOLDER_IMAGE,
  'subhadarshini-green-cardamom': PLACEHOLDER_IMAGE,
  'subhadarshini-whole-cloves': PLACEHOLDER_IMAGE,
  'subhadarshini-tej-patta': img('tej-patta'),
  'subhadarshini-panch-phoran': img('panch-phoran'),
  'subhadarshini-whole-red-chilli': img('red-chilli-whole'),
  'subhadarshini-coriander-seeds': img('coriander-seeds'),

  // --- Gourmet Seasonings ---
  'subhadarshini-posto-poppy-seed': FALLBACK_IMAGES.ground,
  'subhadarshini-roasted-bhaja-jeera-lanka': FALLBACK_IMAGES.ground,
  'subhadarshini-heritage-odia-dalma-masala': PLACEHOLDER_IMAGE,
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
  'premium-food-items': img('hing'),
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

/**
 * Products withdrawn from the public catalogue.
 *
 * Subhadarshini's site is a showcase of its own range, so a product is only
 * listed when it has genuine Subhadarshini packaging photography and is a
 * masala or spice. Everything here fails one of those two tests:
 *
 *  - not a masala or spice (soya chunks, daliya, corn flour, edible soda, sattu)
 *  - no authentic pack photograph exists, so the card would show a placeholder
 *    or an unbranded stock bowl
 *  - the pack shot belongs to a different product, which would mislabel it
 *
 * These are unpublished rather than deleted: the records survive, and a product
 * returns to the site the moment real packaging photography exists for it.
 */
export const UNPUBLISHED_SLUGS = new Set<string>([
  // Not masalas or spices
  'subhadarshini-soya-chunks',
  'subhadarshini-crushed-wheat-daliya',
  'subhadarshini-corn-flour',
  'subhadarshini-edible-soda',
  'subhadarshini-sattu-powder',

  // No authentic pack photograph
  'subhadarshini-black-pepper-powder',
  'subhadarshini-whole-black-pepper',
  'subhadarshini-green-cardamom',
  'subhadarshini-whole-cloves',
  'subhadarshini-heritage-odia-dalma-masala',
  'subhadarshini-pure-amchur-powder',
  'subhadarshini-royal-garam-masala',
  'subhadarshini-mumbai-pav-bhaji-masala',
  'subhadarshini-shahi-reserve-garam-masala',
  'subhadarshini-posto-poppy-seed',
  'subhadarshini-roasted-bhaja-jeera-lanka',

  // The pack shot belongs to another product in the range
  'subhadarshini-kitchen-king-masala',   // pack reads "Curry Powder"
  'subhadarshini-punjabi-rajma-masala',  // pack reads "Punjabi Dal Tadka"
  'subhadarshini-coastal-fish-fry-masala' // pack reads "Fish Masala"
]);

export const isPublishedSlug = (slug: string): boolean => !UNPUBLISHED_SLUGS.has(slug);
