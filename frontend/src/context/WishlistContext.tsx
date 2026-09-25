import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { ApiError, fetchApi } from '../config/api';
import {
  GUEST_WISHLIST_KEY,
  readGuestWishlist,
  writeGuestWishlist,
  removeFromGuestWishlist
} from '../utils/guestStore';

/**
 * Wishlist state, with two sources of truth depending on who is browsing.
 *
 *  Guest:          toggle → localStorage (nothing is sent to the server)
 *  Signing in:     localStorage → POST /wishlist/merge → MongoDB → clear local
 *  Signed in:      toggle → PUT/DELETE /wishlist/:id → MongoDB
 *  Signing out:    back to whatever guest list is on this device (normally
 *                  empty, since a successful sign-in cleared it)
 *
 * The merge is idempotent on the server ($addToSet), so a retry after a
 * timeout never duplicates anything. Local guest data is only removed after
 * the server has confirmed the merge; if it fails the data stays put and the
 * merge is retried with backoff and whenever the browser comes back online.
 */

type SyncState = 'guest' | 'loading' | 'synced' | 'error';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  /** 'error' means the account copy could not be loaded or guest data is still waiting to sync. */
  syncState: SyncState;
}

interface WishlistResponse {
  data: Product[];
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const RETRY_DELAYS_MS = [2_000, 5_000, 15_000, 30_000, 60_000];

/** The session is no longer valid: expired token, or the account is gone. */
const isAuthFailure = (err: unknown) => {
  const e = err as ApiError;
  return e?.status === 401 || e?.errorCode === 'USER_NOT_FOUND';
};

const unionById = (a: Product[], b: Product[]) => {
  const ids = new Set(a.map((p) => p._id));
  return [...a, ...b.filter((p) => !ids.has(p._id))];
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => (token ? [] : readGuestWishlist()));
  const [syncState, setSyncState] = useState<SyncState>(token ? 'loading' : 'guest');

  // Bumped on every signed-in toggle. A server snapshot requested before the
  // latest toggle is stale and must not overwrite the optimistic state.
  const mutationSeq = useRef(0);

  const authHeaders = useCallback(
    (json = false): HeadersInit => ({
      Authorization: `Bearer ${token}`,
      ...(json ? { 'Content-Type': 'application/json' } : {})
    }),
    [token]
  );

  // ── Load / migrate whenever the signed-in identity changes ──────────────
  useEffect(() => {
    if (!token) {
      // Signed out (or never signed in): only ever show this device's guest
      // list, never data left over from an account session.
      setWishlist(readGuestWishlist());
      setSyncState('guest');
      return;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    setSyncState('loading');

    const sync = async () => {
      clearTimeout(retryTimer);
      const pending = readGuestWishlist();
      const pendingIds = pending.map((p) => p._id);
      const seqAtStart = mutationSeq.current;

      try {
        const res = pendingIds.length
          ? await fetchApi<WishlistResponse>('/api/v1/wishlist/merge', {
              method: 'POST',
              headers: authHeaders(true),
              body: JSON.stringify({ productIds: pendingIds })
            })
          : await fetchApi<WishlistResponse>('/api/v1/wishlist', { headers: authHeaders() });

        // The server has the data now, so the local copy can go, even if this
        // component has since unmounted. Only the ids that were sent are
        // removed, in case another tab saved more meanwhile.
        if (pendingIds.length) removeFromGuestWishlist(pendingIds);
        if (cancelled) return;

        attempt = 0;
        setSyncState('synced');
        if (mutationSeq.current === seqAtStart) {
          setWishlist(res.data);
        } else {
          // A toggle happened while this was in flight; fetch the settled state.
          const fresh = await fetchApi<WishlistResponse>('/api/v1/wishlist', { headers: authHeaders() });
          if (!cancelled) setWishlist(fresh.data);
        }
      } catch (err) {
        if (cancelled) return;
        if (isAuthFailure(err)) {
          // Guest data is still in localStorage untouched; it will show again
          // as the guest list and sync on the next sign-in.
          logout();
          return;
        }
        // Keep the guest data and show it alongside whatever we already have,
        // so nothing the visitor saved appears to vanish while we retry.
        setSyncState('error');
        setWishlist((current) => unionById(current, pending));
        const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
        attempt += 1;
        retryTimer = setTimeout(sync, delay);
      }
    };

    const onOnline = () => {
      attempt = 0;
      sync();
    };

    sync();
    window.addEventListener('online', onOnline);
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      window.removeEventListener('online', onOnline);
    };
  }, [token, authHeaders, logout]);

  // ── Guest mode: persist locally and follow other tabs ───────────────────
  useEffect(() => {
    if (token) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === GUEST_WISHLIST_KEY || e.key === null) setWishlist(readGuestWishlist());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [token]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      const exists = wishlist.some((p) => p._id === product._id);

      if (!token) {
        const next = exists ? wishlist.filter((p) => p._id !== product._id) : [...wishlist, product];
        setWishlist(next);
        writeGuestWishlist(next);
        return;
      }

      // Signed in: the server is the source of truth. Update optimistically,
      // then settle on the server's answer or roll back on failure.
      const seq = ++mutationSeq.current;
      setWishlist((prev) =>
        exists ? prev.filter((p) => p._id !== product._id) : unionById(prev, [product])
      );
      // If this product is also still waiting in an unsynced guest list, drop
      // it there too, or the next merge retry would quietly add it back.
      if (exists) removeFromGuestWishlist([product._id]);

      fetchApi<WishlistResponse>(`/api/v1/wishlist/${product._id}`, {
        method: exists ? 'DELETE' : 'PUT',
        headers: authHeaders()
      })
        .then((res) => {
          if (seq === mutationSeq.current) setWishlist(res.data);
        })
        .catch((err) => {
          if (isAuthFailure(err)) {
            logout();
            return;
          }
          console.error('Wishlist update failed:', err);
          setWishlist((prev) =>
            exists ? unionById(prev, [product]) : prev.filter((p) => p._id !== product._id)
          );
        });
    },
    [wishlist, token, authHeaders, logout]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p._id === productId),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, syncState }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
