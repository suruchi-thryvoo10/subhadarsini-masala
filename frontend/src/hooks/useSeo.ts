import { useEffect } from 'react';

export const SITE_NAME = 'Subhadarshini Spices';
export const SITE_URL = 'https://subhadarsini-masala.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/brand/logo.webp`;

export interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/products". Combined with SITE_URL for the canonical. */
  path?: string;
  image?: string;
  /** og:type — "website" for listings, "article" for a recipe, "product" for a SKU. */
  type?: string;
  /** JSON-LD document(s) describing the page for search engines. */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  /** Keep a page out of the index (admin, profile, auth). */
  noIndex?: boolean;
}

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const STRUCTURED_DATA_ID = 'seo-structured-data';

/**
 * Per-route document metadata.
 *
 * The app is a single HTML document, so without this every route shared one
 * title, description and canonical — search engines saw the whole site as one
 * page. Each public page now declares its own, plus Open Graph, Twitter and
 * JSON-LD for rich results.
 */
export const useSeo = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData,
  noIndex
}: SeoOptions) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const canonical = `${SITE_URL}${path ?? window.location.pathname}`;
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    });
    upsertLink('canonical', canonical);

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage });

    document.getElementById(STRUCTURED_DATA_ID)?.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.id = STRUCTURED_DATA_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(
        Array.isArray(structuredData) ? structuredData : [structuredData]
      );
      document.head.appendChild(script);
    }
  }, [title, description, path, image, type, noIndex, JSON.stringify(structuredData ?? null)]);
};

/** The organisation block, reused on the homepage and About. */
export const organisationSchema = (contact: {
  addressFull: string;
  phoneDisplay: string;
  email: string;
  social: { instagram: string; facebook: string };
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Subhadarshini Spices',
  legalName: 'Subhadarshini Agro Pvt Ltd',
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'N3/394, IRC Village, Nayapalli',
    addressLocality: 'Bhubaneswar',
    postalCode: '751015',
    addressRegion: 'Odisha',
    addressCountry: 'IN'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: contact.phoneDisplay,
    email: contact.email,
    contactType: 'customer service',
    areaServed: 'IN'
  },
  sameAs: [contact.social.instagram, contact.social.facebook]
});

export const breadcrumbSchema = (trail: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`
  }))
});
