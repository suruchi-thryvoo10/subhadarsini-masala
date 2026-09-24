/**
 * Writes a real HTML file per route, with the title, description, canonical,
 * Open Graph, Twitter and JSON-LD already in the <head>.
 *
 * Why this and not server rendering: the crawlers that matter most here do not
 * run JavaScript at all. WhatsApp, Facebook and LinkedIn read the <head> of
 * the response and nothing else, so a shared link to any page of a
 * single-page app shows whatever the one index.html happened to say. Baking
 * the tags per route fixes that with no new dependency and no SSR-safety pass
 * over the component tree.
 *
 * The body still hydrates normally, and useSeo rewrites the same tags on
 * mount, so a browser and a crawler end up seeing the same thing.
 *
 * Runs after `vite build`, reading dist/index.html as the shell.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PAGES = join(ROOT, 'src', 'pages');

const SITE_URL = 'https://subhadarsini-masala.vercel.app';
const SITE_NAME = 'Subhadarshini Spices';
const API =
  process.env.VITE_API_URL || 'https://subhadarsini-masala-xs82-beta.vercel.app';

const escape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Static pages carry their metadata in their own useSeo call. Reading it back
 * out of the source keeps this script from drifting into a second, silently
 * wrong copy of the same strings.
 */
const readPageSeo = (file) => {
  const path = join(PAGES, file);
  if (!existsSync(path)) return null;
  const src = readFileSync(path, 'utf8');
  const call = src.match(/useSeo\(\{([\s\S]*?)\n  \}\);/);
  if (!call) return null;
  const field = (name) => {
    const m = call[1].match(new RegExp(`${name}:\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    return m ? m[1].replace(/\\'/g, "'") : null;
  };
  const title = field('title');
  const routePath = field('path');
  if (!title || !routePath) return null;
  return { title, description: field('description'), path: routePath };
};

const STATIC_PAGES = [
  'HomePage.tsx',
  'ProductsPage.tsx',
  'RecipesPage.tsx',
  'AboutPage.tsx',
  'QualityPage.tsx',
  'DealersPage.tsx',
  'ContactPage.tsx',
  'WholesalePage.tsx',
  'CareersPage.tsx'
];

const get = async (path) => {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return (await res.json()).data ?? [];
};

/** Builds the <head> block for one route. */
const head = ({ title, description, path, image, structuredData, noindex }) => {
  const full = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/brand/logo.webp`;

  const tags = [
    `<title>${escape(full)}</title>`,
    description && `<meta name="description" content="${escape(description)}"/>`,
    `<link rel="canonical" href="${escape(url)}"/>`,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:site_name" content="${escape(SITE_NAME)}"/>`,
    `<meta property="og:title" content="${escape(full)}"/>`,
    description && `<meta property="og:description" content="${escape(description)}"/>`,
    `<meta property="og:url" content="${escape(url)}"/>`,
    `<meta property="og:image" content="${escape(img)}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${escape(full)}"/>`,
    description && `<meta name="twitter:description" content="${escape(description)}"/>`,
    `<meta name="twitter:image" content="${escape(img)}"/>`
  ].filter(Boolean);

  if (structuredData) {
    tags.push(
      `<script type="application/ld+json" id="seo-structured-data">${JSON.stringify(
        structuredData
      ).replace(/</g, '\\u003c')}</script>`
    );
  }
  return tags.join('\n    ');
};

/**
 * The shell carries a generic title, description and social card for the whole
 * site. Leaving them in place would give every page two of each, and a crawler
 * that takes the first would show the generic one — the exact problem this
 * script exists to fix. So they are stripped before the per-route block goes
 * in. Everything else in the head (charset, viewport, icon, fonts, the bundle
 * tags) is left untouched.
 */
const stripShellSeo = (shell) =>
  shell
    .replace(/[ \t]*<title>[\s\S]*?<\/title>\r?\n?/i, '')
    .replace(/[ \t]*<meta\s+name="description"[^>]*>\r?\n?/gi, '')
    .replace(/[ \t]*<meta\s+name="robots"[^>]*>\r?\n?/gi, '')
    .replace(/[ \t]*<meta\s+property="og:[^"]*"[^>]*>\r?\n?/gi, '')
    .replace(/[ \t]*<meta\s+name="twitter:[^"]*"[^>]*>\r?\n?/gi, '')
    .replace(/[ \t]*<link\s+rel="canonical"[^>]*>\r?\n?/gi, '');

const write = (routePath, headHtml, shell) => {
  const html = stripShellSeo(shell).replace('</head>', `  ${headHtml}\n  </head>`);

  const dir = routePath === '/' ? DIST : join(DIST, routePath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
};

const run = async () => {
  const shellPath = join(DIST, 'index.html');
  if (!existsSync(shellPath)) {
    console.error('prerender: dist/index.html is missing — run vite build first.');
    process.exit(1);
  }
  const shell = readFileSync(shellPath, 'utf8');

  const routes = [];

  for (const file of STATIC_PAGES) {
    const seo = readPageSeo(file);
    if (seo) routes.push(seo);
    else console.warn(`prerender: could not read useSeo from ${file} — skipped.`);
  }

  // Auth pages exist so a shared link is not indexed by accident.
  routes.push({ title: 'Sign In', path: '/login', noindex: true });
  routes.push({ title: 'Create Account', path: '/register', noindex: true });

  let products = [];
  let categories = [];
  try {
    [products, categories] = await Promise.all([
      get('/api/v1/products?limit=200'),
      get('/api/v1/categories')
    ]);
  } catch (err) {
    // A failed fetch must not ship a build with wrong metadata; the static
    // routes above are still written, and the SPA continues to work for the
    // rest, exactly as it did before this script existed.
    console.warn(`prerender: catalogue unavailable (${err.message}) — detail pages skipped.`);
  }

  for (const c of categories) {
    routes.push({
      title: c.name,
      description:
        c.description ||
        `Browse Subhadarshini ${c.name.toLowerCase()} — 100% pure, lab tested, stone-ground in Odisha.`,
      path: `/category/${c.slug}`,
      image: typeof c.image === 'string' ? c.image : undefined,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: c.name,
        url: `${SITE_URL}/category/${c.slug}`
      }
    });
  }

  for (const p of products) {
    const image = Array.isArray(p.images) ? p.images[0] : p.images;
    routes.push({
      title: p.name,
      description:
        p.shortDescription ||
        `${p.name} from Subhadarshini Spices — 100% pure and lab tested.`,
      path: `/product/${p.slug}`,
      image: typeof image === 'string' ? image : undefined,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.shortDescription || undefined,
        brand: { '@type': 'Brand', name: SITE_NAME },
        url: `${SITE_URL}/product/${p.slug}`
      }
    });
  }

  for (const r of routes) write(r.path, head(r), shell);

  console.log(
    `prerender: wrote ${routes.length} pages (${categories.length} categories, ${products.length} products).`
  );
};

run().catch((err) => {
  console.error('prerender failed:', err.message);
  process.exit(1);
});
