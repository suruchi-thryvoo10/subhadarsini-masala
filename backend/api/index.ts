import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { autoSeedIfEmpty } from '../src/seed/autoSeed.js';

let isInitialized = false;

export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    try {
      await connectDB();
      await autoSeedIfEmpty();
      isInitialized = true;
    } catch (err) {
      console.error('[Vercel Serverless] DB connection error:', err);
    }
  }
  return app(req, res);
}
