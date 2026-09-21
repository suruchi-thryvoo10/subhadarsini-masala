import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB, describeMongoTarget } from '../config/db.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { autoSeedIfEmpty } from '../seed/autoSeed.js';

/**
 * One-shot maintenance script.
 *
 * Runs the catalogue sync against whatever MONGODB_URI points at and then prints
 * a verification report. Safe to re-run: it only writes documents that differ.
 *
 *   npm run fix:images
 */
const run = async () => {
  console.log(`[Sync] Target: ${describeMongoTarget()}`);
  await connectDB();

  await autoSeedIfEmpty();

  const categories = await Category.find({}).sort({ sortOrder: 1 });
  const products = await Product.find({}).populate('category', 'name slug');

  console.log(`\n[Sync] ${categories.length} categories, ${products.length} products\n`);

  const broken = products.filter((p) => !p.images?.[0]);
  const remote = products.filter((p) => /^https?:\/\//.test(p.images?.[0] || ''));

  for (const cat of categories) {
    const inCat = products.filter((p) => (p.category as any)?.slug === cat.slug);
    console.log(`  ${cat.name} (${cat.slug}) — ${inCat.length} products`);
    for (const p of inCat) {
      console.log(`      ${p.images?.[0] || '!! NO IMAGE'}  ${p.name}`);
    }
  }

  console.log(`\n[Sync] Products without an image: ${broken.length}`);
  console.log(`[Sync] Products still using a remote URL: ${remote.length}`);

  await mongoose.disconnect();
  process.exit(broken.length === 0 && remote.length === 0 ? 0 : 1);
};

run().catch((err) => {
  console.error('[Sync] Failed:', err.message);
  process.exit(1);
});
