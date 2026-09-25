import { Product } from '../types';

/**
 * Guest (signed-out) data kept in localStorage.
 *
 * Only public, non-sensitive data lives here: product cards a visitor saved
 * before signing in. Nothing about who the visitor is. It survives refreshes
 * and browser restarts, is never sent anywhere while the visitor is a guest,
 * and is folded into their account and then cleared once they sign in
 * (see WishlistContext).
 *
 * Keys are namespaced and versioned (`subhadarshini.guest.v1.<name>`) so the
 * shape can change later without misreading old data.
 */

export const GUEST_WISHLIST_KEY = 'subhadarshini.guest.v1.wishlist';

/** Key used before the guest store existed; migrated on first read. */
const LEGACY_WISHLIST_KEY = 'subhadarshini_wishlist';

interface GuestWishlist {
  version: 1;
  updatedAt: string;
  items: Product[];
}

/** The card fields a saved product needs to render; nothing else is kept. */
const toCard = (p: Product): Product =>
  ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    shortDescription: p.shortDescription,
    images: p.images,
    variants: p.variants,
    isFeatured: p.isFeatured,
    isUpcoming: p.isUpcoming,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount
  }) as Product;

const isProduct = (v: any): v is Product =>
  !!v && typeof v === 'object' && typeof v._id === 'string' && typeof v.slug === 'string';

const safeGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // storage blocked (private mode, disabled cookies)
  }
};

const safeSet = (key: string, value: string | null): void => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage full or blocked: guest data just won't persist */
  }
};

const dedupe = (items: Product[]): Product[] => {
  const seen = new Set<string>();
  return items.filter((p) => (seen.has(p._id) ? false : (seen.add(p._id), true)));
};

export const readGuestWishlist = (): Product[] => {
  const raw = safeGet(GUEST_WISHLIST_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<GuestWishlist>;
      if (parsed?.version === 1 && Array.isArray(parsed.items)) {
        return dedupe(parsed.items.filter(isProduct));
      }
    } catch {
      /* corrupt entry: treat as empty and let the next write replace it */
    }
    return [];
  }

  // One-time move from the old flat key.
  const legacy = safeGet(LEGACY_WISHLIST_KEY);
  if (!legacy) return [];
  safeSet(LEGACY_WISHLIST_KEY, null);
  try {
    const items = JSON.parse(legacy);
    const migrated = Array.isArray(items) ? dedupe(items.filter(isProduct)) : [];
    writeGuestWishlist(migrated);
    return migrated;
  } catch {
    return [];
  }
};

export const writeGuestWishlist = (items: Product[]): void => {
  if (items.length === 0) {
    safeSet(GUEST_WISHLIST_KEY, null);
    return;
  }
  const value: GuestWishlist = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: dedupe(items).map(toCard)
  };
  safeSet(GUEST_WISHLIST_KEY, JSON.stringify(value));
};

/**
 * Removes only the given products from the guest list. Used after a merge so
 * anything saved in another tab while the merge was in flight is kept for the
 * next sync rather than silently dropped.
 */
export const removeFromGuestWishlist = (productIds: string[]): void => {
  const drop = new Set(productIds);
  writeGuestWishlist(readGuestWishlist().filter((p) => !drop.has(p._id)));
};
