/**
 * Build-time sitemap + robots.
 *
 * Pulls the live catalogue so product, category and recipe URLs are listed, and
 * falls back to the static routes alone if the API is unreachable during the
 * build rather than failing the deploy.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = process.env.VITE_SITE_URL || 'https://subhadarsini-masala.vercel.app';
const API = process.env.VITE_API_URL || 'https://subhadarsini-masala-xs82-beta.vercel.app';
const OUT = path.resolve('public');

const STATIC_ROUTES = [
  ['/', 1.0, 'weekly'],
  ['/products', 0.9, 'weekly'],
  ['/recipes', 0.8, 'weekly'],
  ['/about', 0.7, 'monthly'],
  ['/dealers', 0.7, 'monthly'],
  ['/wholesale', 0.6, 'monthly'],
  ['/quality', 0.6, 'monthly'],
  ['/contact', 0.6, 'monthly'],
  ['/careers', 0.4, 'monthly']
];

const get = async (endpoint) => {
  try {
    const res = await fetch(`${API}${endpoint}`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const body = await res.json();
    return body?.data ?? [];
  } catch {
    console.warn(`[sitemap] ${endpoint} unavailable — continuing without it.`);
    return [];
  }
};

const urlEntry = ([loc, priority, changefreq]) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const [products, categories] = await Promise.all([
  get('/api/v1/products?limit=200'),
  get('/api/v1/categories')
]);

const routes = [
  ...STATIC_ROUTES,
  ...categories.map((c) => [`/category/${c.slug}`, 0.8, 'weekly']),
  ...products.map((p) => [`/products/${p.slug}`, 0.7, 'weekly'])
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(urlEntry).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /profile
Disallow: /login
Disallow: /register

Sitemap: ${SITE}/sitemap.xml
`;

await fs.mkdir(OUT, { recursive: true });
await fs.writeFile(path.join(OUT, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(OUT, 'robots.txt'), robots);
console.log(`[sitemap] ${routes.length} URLs (${products.length} products, ${categories.length} categories)`);
