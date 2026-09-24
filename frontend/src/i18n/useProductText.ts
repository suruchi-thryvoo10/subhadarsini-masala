import { useLanguage } from './LanguageContext';

interface Localisable {
  slug?: string;
  name?: string;
  shortDescription?: string;
}

/**
 * Localises a product's name and one-line description, falling back to
 * whatever the API returned. The fallback matters twice over: a product added
 * after these files were written still renders, and the chunk carrying the
 * translations arrives a moment after the first paint, so the English is what
 * shows in between rather than an empty card.
 */
export const useProductText = () => {
  const { products } = useLanguage();

  return {
    name: (product: Localisable | undefined, fallback = ''): string => {
      if (!product) return fallback;
      const base = product.name ?? fallback;
      return (product.slug && products[product.slug]?.name) || base;
    },
    shortDescription: (product: Localisable | undefined): string => {
      if (!product) return '';
      const base = product.shortDescription ?? '';
      return (product.slug && products[product.slug]?.shortDescription) || base;
    }
  };
};
