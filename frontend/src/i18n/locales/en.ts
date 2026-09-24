/**
 * English is the source of truth: it defines the key set every other locale is
 * checked against, and it is what a missing key falls back to.
 *
 * Only interface chrome belongs here. Product names, descriptions, founder
 * biographies and anything else that comes from the database stays exactly as
 * it was authored — see i18n/README.md.
 */
export const en = {
  'lang.label': 'Language',
  'lang.beta': 'Translation not yet reviewed',

  'topbar.tagline': '100% Pure Stone-Ground Odia Spices',
  'topbar.verifyBatch': 'Verify Batch Quality',

  'nav.home': 'Home',
  'nav.products': 'Products',
  'nav.recipes': 'Recipes',
  'nav.quality': 'Quality',
  'nav.about': 'Our Story',
  'nav.dealers': 'Dealers',
  'nav.contact': 'Contact',
  'nav.wholesale': 'Wholesale',
  'nav.careers': 'Careers',

  'action.search': 'Search',
  'action.searchPlaceholder': 'Search products...',
  'action.viewAll': 'View All Catalogue',
  'action.explore': 'Explore',
  'action.exploreProducts': 'Explore Products',
  'action.discoverRecipes': 'Discover Recipes',
  'action.retry': 'Try Again',
  'action.login': 'Sign In',
  'action.register': 'Create Account',
  'action.logout': 'Sign Out',
  'action.profile': 'My Profile',
  'action.wishlist': 'Wishlist',
  'action.menu': 'Menu',
  'action.close': 'Close',

  'home.collections': 'Curated Collections',
  'home.spiceRange': 'Explore Our Spice Range',
  'home.bestsellers': 'Bestsellers & Favorites',
  'home.handcrafted': 'Handcrafted Spice Selection',
  'home.kitchenInspiration': 'Kitchen Inspiration',
  'home.recipesCrafted': 'Recipes Crafted With Subhadarshini',
  'home.lovedBy': 'Loved By Home Cooks & Chefs',

  'state.loading': 'Loading...',
  'state.error': "We couldn't load the catalogue",
  'state.empty': 'No products found',

  'footer.quickLinks': 'Quick Links',
  'footer.company': 'Company',
  'footer.contactUs': 'Contact Us',
  'footer.followUs': 'Follow Us',
  'footer.rights': 'All rights reserved.'
};

/** Every locale file is checked against this shape. */
export type TranslationKey = keyof typeof en;
export type Dictionary = Partial<Record<TranslationKey, string>>;

export default en;
