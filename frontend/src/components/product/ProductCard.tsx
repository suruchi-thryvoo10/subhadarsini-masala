import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const inWishlist = isInWishlist(product._id);
  const discountPercent = selectedVariant.discountPrice
    ? Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-spice-brown/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Product Image Box */}
      <div className="relative aspect-square overflow-hidden bg-spice-beige/40">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-spice-red text-white font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase shadow">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-spice-saffron text-white font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase shadow">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-spice-brown hover:text-spice-red transition-colors shadow"
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-spice-red text-spice-red' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-spice-saffron font-medium mb-1">
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {typeof product.category === 'object' ? product.category.name : 'Spice Blend'}
            </span>
            <div className="flex items-center gap-1 text-spice-brown/80 font-bold">
              <Star className="w-3.5 h-3.5 fill-spice-turmeric text-spice-turmeric" />
              <span>{product.ratingAvg || 4.8}</span>
              <span className="text-spice-brown/40 text-[10px]">({product.ratingCount || 12})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-serif font-bold text-lg text-spice-brown group-hover:text-spice-red transition-colors line-clamp-1">
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
            <div className="flex items-center gap-1.5">
              {product.variants.map((v, idx) => (
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
                  ₹{selectedVariant.discountPrice || selectedVariant.price}
                </span>
                {selectedVariant.discountPrice && (
                  <span className="text-xs text-spice-brown/40 line-through font-medium">
                    ₹{selectedVariant.price}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product, selectedVariant.size)}
              className="px-3.5 py-2 rounded-xl bg-spice-brown hover:bg-spice-red text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
