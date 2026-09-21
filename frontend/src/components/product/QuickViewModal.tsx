import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, ShoppingBag, Check, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductGallery } from './ProductGallery';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * Lightweight product preview so browsing a grid doesn't require a full page
 * navigation. Deliberately shows only what informs an add-to-cart decision —
 * specs and nutrition stay on the detail page.
 */
export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [variantIndex, setVariantIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setVariantIndex(0);
    setJustAdded(false);
  }, [product?._id]);

  // Close on Escape, and stop the page behind the overlay from scrolling.
  useEffect(() => {
    if (!product) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, onClose]);

  const variants = product?.variants || [];
  const variant = variants[variantIndex] || variants[0];
  const isUnavailable = !product || product.isUpcoming || !variant || variant.stock === 0;

  const handleAdd = () => {
    if (!product || !variant || isUnavailable) return;
    addToCart(product, variant.size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-spice-dark/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-spice-cream rounded-t-3xl sm:rounded-3xl shadow-2xl border border-spice-brown/10"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-spice-brown hover:text-spice-red transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 sm:p-7">
              <ProductGallery images={product.images} productName={product.name} />

              <div className="flex flex-col">
                <span className="text-spice-saffron font-bold text-[11px] uppercase tracking-wider">
                  {typeof product.category === 'object' ? product.category.name : 'Pure Spice'}
                </span>

                <h2 className="font-serif font-bold text-2xl text-spice-brown mt-1 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="w-3.5 h-3.5 fill-spice-turmeric text-spice-turmeric" />
                  <span className="text-xs font-bold text-spice-brown">{product.ratingAvg || 4.8}</span>
                  <span className="text-[11px] text-spice-brown/40">({product.ratingCount || 24})</span>
                </div>

                <p className="text-xs text-spice-brown/75 mt-3 leading-relaxed line-clamp-4">
                  {product.shortDescription}
                </p>

                {variants.length > 0 && (
                  <div className="mt-5">
                    <span className="text-[11px] font-bold text-spice-brown/70 uppercase tracking-wider block mb-2">
                      Pack Size
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {variants.map((v, idx) => (
                        <button
                          key={v.sku || idx}
                          onClick={() => setVariantIndex(idx)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            idx === variantIndex
                              ? 'border-spice-red bg-spice-red text-white'
                              : 'border-spice-brown/20 bg-white text-spice-brown hover:border-spice-saffron'
                          }`}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-spice-brown">
                    ₹{variant?.discountPrice || variant?.price || '—'}
                  </span>
                  {variant?.discountPrice && (
                    <span className="text-sm text-spice-brown/40 line-through">₹{variant.price}</span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={isUnavailable}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                      isUnavailable
                        ? 'bg-spice-brown/30 cursor-not-allowed'
                        : justAdded
                        ? 'bg-green-600'
                        : 'bg-spice-brown hover:bg-spice-red'
                    }`}
                  >
                    {isUnavailable ? (
                      product.isUpcoming ? 'Coming Soon' : 'Out of Stock'
                    ) : justAdded ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="w-11 h-11 shrink-0 rounded-xl border border-spice-brown/20 bg-white flex items-center justify-center text-spice-brown hover:text-spice-red transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-spice-red text-spice-red' : ''}`}
                    />
                  </button>
                </div>

                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="mt-4 text-xs font-bold text-spice-red hover:underline inline-flex items-center gap-1"
                >
                  View full details & nutrition <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
