import { Request, Response, NextFunction } from 'express';

/**
 * Lets Vercel's CDN answer repeat reads of the public catalogue without
 * invoking the function at all.
 *
 * Redis still shortens the origin query; this shortens the journey to the
 * origin, which is the larger of the two costs — a reader in Odisha reaches
 * the Mumbai edge in ~15ms, so an edge hit is roughly an order of magnitude
 * faster than any origin response.
 *
 * `stale-while-revalidate` means an expired entry is still served instantly
 * while the edge refreshes it behind the reader, so nobody waits for a
 * revalidation.
 */

/** Seconds at the edge, then how long a stale copy may still be served. */
const PUBLIC_MAX_AGE = 300;
const STALE_WHILE_REVALIDATE = 3600;

/** Only these prefixes are ever cacheable; everything else is left alone. */
const CACHEABLE_PREFIXES = [
  '/api/v1/products',
  '/api/v1/categories',
  '/api/v1/recipes',
  '/api/v1/dealers',
  '/api/v1/stats',
  '/api/v1/quality'
];

/**
 * A response that depended on who was asking must never be stored by a shared
 * cache, or one reader's data is served to the next. Anything carrying
 * credentials is therefore excluded outright, whatever path it is on.
 */
const isAnonymous = (req: Request): boolean =>
  !req.headers.authorization && !req.headers.cookie;

export const edgeCache = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return next();
  }

  const cacheable =
    isAnonymous(req) && CACHEABLE_PREFIXES.some((p) => req.path.startsWith(p));

  if (!cacheable) {
    res.setHeader('Cache-Control', 'no-store');
    return next();
  }

  // Applied as the response goes out so a handler that failed, or that decided
  // to send private data, is never stored at the edge.
  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = function patched(this: Response, ...args: any[]) {
    const status = typeof args[0] === 'number' ? args[0] : res.statusCode;
    if (status === 200 && !res.getHeader('Set-Cookie')) {
      res.setHeader(
        'Cache-Control',
        `public, max-age=0, s-maxage=${PUBLIC_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`
      );
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
    return originalWriteHead(...(args as [number]));
  } as typeof res.writeHead;

  next();
};
