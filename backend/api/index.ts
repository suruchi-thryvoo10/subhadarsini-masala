import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { autoSeedIfEmpty } from '../src/seed/autoSeed.js';

let isSeeded = false;

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (!isSeeded) {
      await autoSeedIfEmpty();
      isSeeded = true;
    }
  } catch (err: any) {
    console.error('[Vercel Serverless] DB connection error:', err.message);
  }
  return app(req, res);
}
