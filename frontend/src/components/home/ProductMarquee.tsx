import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { productImageUrl, handleImageError } from '../../config/images';
import { displayProductName } from '../../utils/format';
import { useCategoryName } from '../../i18n/categories';
import { useProductText } from '../../i18n/useProductText';
import { useT } from '../../i18n/LanguageContext';
import { useAutoScrollRail } from '../../hooks/useAutoScrollRail';

interface ProductMarqueeProps {
  products: Product[];
}

/**
 * Continuous horizontal rail of feature products. It drifts slowly by itself
 * and can be swiped, trackpad-scrolled or mouse-dragged; see useAutoScrollRail.
 */
export const ProductMarquee: React.FC<ProductMarqueeProps> = ({ products }) => {
  const t = useT();
  const categoryName = useCategoryName();
  const productText = useProductText();
  const { scrollerRef, trackRef } = useAutoScrollRail(products.length);

  if (products.length === 0) return null;

  const track = [...products, ...products];

  return (
    <div className="relative">
      {/* Soft edges so cards enter and leave rather than being cut off */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-10 bg-gradient-to-r from-spice-beige to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-10 bg-gradient-to-l from-spice-beige to-transparent" />

      <div
        ref={scrollerRef}
        className="rail-scroller overflow-x-auto overflow-y-hidden scrollbar-none"
      >
        <div ref={trackRef} className="flex gap-5 sm:gap-8 w-max py-2">
          {track.map((product, idx) => (
            <Link
              key={`${product._id}-${idx}`}
              to={`/products/${product.slug}`}
              aria-hidden={idx >= products.length}
              tabIndex={idx >= products.length ? -1 : 0}
              draggable={false}
              className="group/card w-[210px] sm:w-[300px] lg:w-[360px] shrink-0 bg-white rounded-2xl border border-spice-brown/10 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-spice-cream flex items-center justify-center p-6 border-b border-spice-brown/5">
                <img
                  src={productImageUrl(product)}
                  onError={handleImageError}
                  alt={`${displayProductName(product.name)} pack`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 sm:p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-spice-red">
                  {typeof product.category === 'object'
                  ? categoryName(product.category.slug, product.category.name)
                  : 'Subhadarshini'}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-spice-brown mt-1 leading-tight line-clamp-2">
                  {displayProductName(productText.name(product, product.name))}
                </h3>
                <p className="text-xs text-spice-brown/70 mt-2 line-clamp-2 leading-relaxed">
                  {productText.shortDescription(product)}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-spice-red mt-4">
                  {t('action.viewDetails')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
