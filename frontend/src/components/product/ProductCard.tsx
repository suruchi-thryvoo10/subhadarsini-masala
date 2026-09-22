import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productImageUrl, handleImageError } from '../../config/images';
import { useQuickView } from '../../context/QuickViewContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useQuickView();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIndex] || variants[0];

  const inWishlist = isInWishlist(product._id);
  const discountPercent = selectedVariant?.discountPrice
    ? Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100)
    : 0;
  const isOutOfStock = product.isUpcoming || !selectedVariant || selectedVariant.stock === 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant.size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-spice-brown/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Product Image Box */}
      <div className="relative aspect-[5/4] sm:aspect-square overflow-hidden bg-spice-cream p-4 flex items-center justify-center border-b border-spice-brown/5">
        <img
          src={productImageUrl(product)}
          onError={handleImageError}
          alt={`${product.name} packaging`}
          loading="lazy"
          decoding="async"
          width={900}
          height={900}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isUpcoming && (
            <span className="bg-spice-brown text-white font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase shadow">
              Coming Soon
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-spice-red text-white font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase shadow">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-white text-spice-red border border-spice-red/30 font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase shadow">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-spice-brown hover:text-spice-red transition-colors shadow z-10"
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-spice-red text-spice-red' : ''}`} />
        </button>

        {/* Quick View — keyboard reachable, and always visible on touch devices
            where there is no hover state to reveal it. */}
        <button
          onClick={() => openQuickView(product)}
          className="absolute inset-x-3 bottom-3 z-10 py-2 rounded-xl bg-spice-brown/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition-all duration-300 hover:bg-spice-red"
        >
          <Eye className="w-3.5 h-3.5" /> Quick View
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-spice-saffron font-medium mb-1">
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {typeof product.category === 'object' ? product.category.name : 'Pure Spice'}
            </span>
            <div className="flex items-center gap-1 text-spice-brown/80 font-bold">
              <Star className="w-3.5 h-3.5 fill-spice-turmeric text-spice-turmeric" />
              <span>{product.ratingAvg || 4.9}</span>
              <span className="text-ink-500 text-[10px]">({product.ratingCount || 45})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-serif font-bold text-base text-spice-brown group-hover:text-spice-red transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-spice-brown/70 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-spice-brown/10">
          {/* Variant Selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-spice-brown/70">Pack Size:</span>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {variants.map((v, idx) => (
                <button
                  key={v.sku || idx}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                    idx === selectedVariantIndex
                      ? 'bg-spice-red text-white shadow-sm'
                      : 'bg-spice-beige text-spice-brown/80 hover:bg-spice-saffron/20'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-spice-brown font-serif">
                  ₹{selectedVariant?.discountPrice || selectedVariant?.price || '—'}
                </span>
                {selectedVariant?.discountPrice && (
                  <span className="text-xs text-ink-500 line-through font-medium">
                    ₹{selectedVariant.price}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-surface-300 text-ink-600 cursor-not-allowed'
                  : justAdded
                  ? 'bg-spice-red'
                  : 'bg-spice-brown hover:bg-spice-red'
              }`}
            >
              {isOutOfStock ? (
                <>{product.isUpcoming ? 'Coming Soon' : 'Out of Stock'}</>
              ) : justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
