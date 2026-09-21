import app from '../src/app.js';
import { connectDB, getDbStatus } from '../src/config/db.js';
import { autoSeedIfEmpty } from '../src/seed/autoSeed.js';

let isSeeded = false;

/**
 * Vercel serverless entry point.
 *
 * The database connection is established (and awaited) before Express handles the
 * request. If it fails the request is answered with an explicit, actionable error
 * rather than being allowed to fall through and fail later as a Mongoose
 * "buffering timed out" error that hides the real cause.
 */
export default async function handler(req: any, res: any) {
  // Diagnostics must stay reachable even when the database is down.
  if (req.url && req.url.split('?')[0] === '/api/v1/health/db') {
    return app(req, res);
  }

  try {
    await connectDB();
  } catch (err: any) {
    console.error('[Vercel Serverless] DB connection error:', err.message);
    return res.status(503).json({
      success: false,
      message: err.message,
      errorCode: err.code === 'MONGODB_URI_MISSING' ? 'MONGODB_URI_MISSING' : 'DATABASE_CONNECTION_ERROR',
      db: getDbStatus()
    });
  }

  if (!isSeeded) {
    try {
      await autoSeedIfEmpty();
      isSeeded = true;
    } catch (seedErr: any) {
      console.warn('[Vercel Serverless] Non-fatal autoSeed error:', seedErr.message);
    }
  }

  return app(req, res);
}
