/**
 * English is the source of truth: it defines the key set every other locale is
 * checked against, and it is what a missing key falls back to.
 *
 * This covers the interface — navigation, headings, labels, buttons, marketing
 * lines, form fields and status messages. Text that comes from the database
 * (product names and descriptions, recipe steps, the founder biographies,
 * dealer records) is translated separately per record; see i18n/README.md.
 */
export const en = {
  'lang.label': 'Language',
  'lang.beta': 'Translation not yet reviewed',

  // ---- Top bar & navigation ----
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

  // ---- Shared actions ----
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
  'action.submit': 'Submit',
  'action.sending': 'Sending...',
  'action.viewDetails': 'View Details',
  'action.resetFilters': 'Reset Filters',
  'action.verifyBatch': 'Verify Package Batch',

  // ---- Hero ----
  'hero.badge': '100% Traditional Stone-Ground Purity',
  'hero.titleLead': 'Authentic Indian Flavours,',
  'hero.titleAccent': 'Crafted With Purity.',
  'hero.subtitle':
    'Experience handpicked farm-fresh spices, slow-ground using traditional stone mills to retain natural essential oils, vibrant colour, and rich aromatic heritage.',
  'hero.zero': 'Zero',
  'hero.statStoneGround': 'Stone Ground',
  'hero.statNoDyes': 'Artificial Dyes',
  'hero.statRange': 'Products In Range',
  'hero.badgeCertified': 'NABL Lab Certified',
  'hero.badgeCertifiedSub': 'Batch verification enabled',
  'hero.badgeHeritage': 'Heritage Recipe',
  'hero.badgeHeritageSub': 'Formulated since 1994',

  // ---- Trust strip ----
  'trust.farmTitle': 'Farm Sourced Ingredients',
  'trust.farmText': 'Directly from certified spice growers',
  'trust.labTitle': 'NABL Lab Tested',
  'trust.labText': 'Every batch carries a lab certificate',
  'trust.hygieneTitle': 'Hygienically Processed',
  'trust.hygieneText': 'Touchless automated stone grinding',
  'trust.qualityTitle': 'Quality Controlled',
  'trust.qualityText': 'No added colours or starch',
  'trust.flavourTitle': 'Authentic Indian Flavours',
  'trust.flavourText': 'Preserving age-old heritage recipes',
  'trust.statProducts': 'Products in range',
  'trust.statCategories': 'Spice categories',
  'trust.statBatches': 'Lab-verified batches',
  'trust.statRating': 'Average customer rating',

  // ---- Home sections ----
  'home.collections': 'Curated Collections',
  'home.spiceRange': 'Explore Our Spice Range',
  'home.bestsellers': 'Bestsellers & Favorites',
  'home.handcrafted': 'Handcrafted Spice Selection',
  'home.kitchenInspiration': 'Kitchen Inspiration',
  'home.recipesCrafted': 'Recipes Crafted With Subhadarshini',
  'home.lovedBy': 'Loved By Home Cooks & Chefs',
  'home.traceBadge': 'Digital Batch Traceability',
  'home.traceTitle': 'Verify Your Spice Package Authenticity & Lab Reports',
  'home.traceText':
    'Every Subhadarshini product package carries a unique batch number. Check purity scores, active curcumin levels, and lab test certificates in real-time.',
  'home.openAssistant': 'Open AI Recipe Assistant',
  'home.viewRecipeSteps': 'View Ingredients & Step-by-Step',

  // ---- Products ----
  'products.heading': 'Product Catalogue',
  'products.intro':
    'Browse our range of pure stone-ground spices, traditional blends, and specialty foods.',
  'products.available': 'products available.',
  'products.all': 'All Spices',
  'products.sortFeatured': 'Sort: Featured',
  'products.sortPriceLow': 'Price: Low to High',
  'products.sortPriceHigh': 'Price: High to Low',
  'products.sortRating': 'Top Rated',
  'products.sortNewest': 'New Arrivals',
  'products.packSize': 'Pack Size',
  'products.mainMasala': 'Main Masala',

  // ---- Recipes ----
  'recipes.heading': 'Signature Heritage Recipes',
  'recipes.assistantBadge': 'AI Recipe Assistant',
  'recipes.assistantTitle': "What's In Your Kitchen Today?",
  'recipes.launchAssistant': 'Launch AI Assistant',
  'recipes.ingredients': 'Ingredients',
  'recipes.method': 'Method',
  'recipes.shareTitle': 'Share Your Recipe',
  'recipes.minutes': 'mins',

  // ---- About ----
  'about.heritage': 'Our Heritage & Purity Philosophy',
  'about.missionTitle': 'Our Mission',
  'about.visionTitle': 'Our Vision',
  'about.farmersTitle': 'Farmer Relationships',
  'about.peopleBehind': 'The People Behind The Brand',
  'about.founders': 'Founder & Co-Founder',
  'about.founder': 'Founder',
  'about.coFounder': 'Co-Founder',

  // ---- Quality ----
  'quality.batchPlaceholder': 'Enter Batch Number (e.g. SD2026-SP01)',
  'quality.productName': 'Product Name',
  'quality.batchNumber': 'Batch Number',
  'quality.mfgDate': 'Manufacturing Date',
  'quality.expDate': 'Expiry Date',
  'quality.purity': 'Purity & Curcumin',
  'quality.moisture': 'Moisture Content',
  'quality.microbial': 'Microbial Safety',

  // ---- Dealers, contact, wholesale, careers ----
  'dealers.searchPlaceholder': 'Search by city, pincode, or dealer name...',
  'contact.headquarters': 'Headquarters & Factory',
  'contact.whatsappTitle': 'Instant WhatsApp Support',
  'contact.whatsappText': 'Chat directly with our customer care desk',
  'contact.sent': 'Message Sent!',
  'wholesale.desk': 'Direct Wholesale Desk',
  'wholesale.submitted': 'Enquiry Submitted!',
  'wholesale.volume': 'Expected Monthly Volume',
  'form.fullName': 'Full Name',
  'form.email': 'Email',
  'form.phone': 'Phone',
  'form.message': 'Message',
  'form.city': 'City',

  // ---- States ----
  'state.loading': 'Loading...',
  'state.error': "We couldn't load the catalogue",
  'state.empty': 'No products found',
  'state.emptyHint': 'Try clearing search keywords or selecting a different category.',

  // ---- Footer ----
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
