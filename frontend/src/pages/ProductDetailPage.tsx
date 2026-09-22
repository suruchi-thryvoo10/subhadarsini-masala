import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, ShieldCheck, Heart, ShoppingBag, Truck, Check, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { getApiUrl } from '../config/api';
import { ProductGallery } from '../components/product/ProductGallery';
import { Reveal, StaggerGroup, StaggerItem } from '../components/ui/Reveal';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl(`/api/v1/products/${slug}`));
        const data = await res.json();
        if (data.success) {
          setProduct(data.data.product);
          setRelatedProducts(data.data.relatedProducts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-96 bg-white/60 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-spice-brown mb-4">Product Not Found</h2>
        <Link to="/products" className="px-6 py-2.5 bg-spice-red text-white text-xs font-bold rounded-full">
          Back to Products
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const inWishlist = isInWishlist(product._id);
  const isUnavailable = product.isUpcoming || selectedVariant.stock === 0;
  const discountPercent = selectedVariant.discountPrice
    ? Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100)
    : 0;

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/products" className="hover:underline">Products</Link> / 
          <span className="text-spice-brown font-bold">{product.name}</span>
        </nav>

        {/* Product Grid Layout */}
        <div className="bg-white rounded-3xl border border-spice-brown/10 p-6 md:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <ProductGallery
            images={product.images}
            productName={product.name}
            badge={
              product.isUpcoming ? (
                <span className="bg-spice-brown text-white font-bold text-[10px] px-2.5 py-1 rounded-full tracking-wider uppercase shadow">
                  Coming Soon
                </span>
              ) : discountPercent > 0 ? (
                <span className="bg-spice-red text-white font-bold text-[10px] px-2.5 py-1 rounded-full tracking-wider uppercase shadow">
                  {discountPercent}% Off
                </span>
              ) : null
            }
          />

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-brand-50 text-spice-red font-bold text-xs px-3 py-1 rounded-full uppercase">
                  {typeof product.category === 'object' ? product.category.name : 'Spice Blend'}
                </span>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 text-spice-brown hover:text-spice-red"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-spice-red text-spice-red' : ''}`} />
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown mt-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-spice-turmeric">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-spice-turmeric" />
                  ))}
                </div>
                <span className="text-xs font-bold text-spice-brown">{product.ratingAvg || 4.8}</span>
                <span className="text-xs text-ink-500">({product.ratingCount || 24} Verified Reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-spice-brown">
                  ₹{selectedVariant.discountPrice || selectedVariant.price}
                </span>
                {selectedVariant.discountPrice && (
                  <span className="text-base text-ink-500 line-through">
                    ₹{selectedVariant.price}
                  </span>
                )}
                <span className="text-xs font-bold text-spice-red bg-spice-red/10 px-2 py-0.5 rounded">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-sm text-spice-brown/80 mt-4 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Pack Size Selection */}
              <div className="mt-6">
                <label className="text-xs font-bold text-spice-brown uppercase tracking-wider block mb-2">
                  Select Pack Size:
                </label>
                <div className="flex items-center gap-3">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.sku || idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        idx === selectedVariantIndex
                          ? 'border-spice-red bg-spice-red text-white shadow-sm'
                          : 'border-spice-brown/20 bg-spice-cream text-spice-brown hover:border-spice-saffron'
                      }`}
                    >
                      {v.size} — ₹{v.discountPrice || v.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-spice-brown/20 rounded-xl bg-spice-cream overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-spice-brown font-bold hover:bg-spice-brown/10"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-xs text-spice-brown">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-spice-brown font-bold hover:bg-spice-brown/10"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, selectedVariant.size, quantity)}
                  disabled={isUnavailable}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-spice-brown hover:bg-spice-red disabled:bg-surface-300 disabled:text-ink-600 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.isUpcoming ? 'Coming Soon' : selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-spice-brown/10 grid grid-cols-2 gap-4 text-xs text-spice-brown/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-spice-saffron" />
                  <span>100% Pure Lab Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-spice-saffron" />
                  <span>Available at Dealer Stores & Wholesale</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional & Ingredients Specifications */}
        <Reveal className="bg-white rounded-3xl border border-spice-brown/10 p-6 md:p-10 shadow-sm mb-16">
          <h2 className="font-serif text-2xl font-bold text-spice-brown mb-6">
            Product Specifications & Nutrition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif font-bold text-base text-spice-red mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="bg-spice-beige text-spice-brown font-semibold text-xs px-3 py-1 rounded-full border border-spice-brown/10">
                    {ing}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-xs text-spice-brown/80">
                <p><strong>Shelf Life:</strong> {product.shelfLife}</p>
                <p><strong>Storage Instructions:</strong> {product.storageInstructions}</p>
                <p><strong>Manufacturer:</strong> {product.manufacturerInfo}</p>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-spice-red mb-3">Nutritional Information (per 100g)</h3>
              <table className="w-full text-xs text-left border border-spice-brown/15 rounded-xl overflow-hidden">
                <tbody className="divide-y divide-spice-brown/10">
                  <tr className="bg-spice-beige/40">
                    <td className="p-2.5 font-bold">Energy</td>
                    <td className="p-2.5">{product.nutritionalInfo.energy}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Protein</td>
                    <td className="p-2.5">{product.nutritionalInfo.protein}</td>
                  </tr>
                  <tr className="bg-spice-beige/40">
                    <td className="p-2.5 font-bold">Carbohydrates</td>
                    <td className="p-2.5">{product.nutritionalInfo.carbs}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Fat</td>
                    <td className="p-2.5">{product.nutritionalInfo.fat}</td>
                  </tr>
                  {product.nutritionalInfo.sodium && (
                    <tr className="bg-spice-beige/40">
                      <td className="p-2.5 font-bold">Sodium</td>
                      <td className="p-2.5">{product.nutritionalInfo.sodium}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-spice-brown mb-6">You Might Also Like</h2>
            <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <StaggerItem key={p._id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        )}
      </div>

      {/* Sticky add-to-cart bar — phones only, where the real button scrolls
          out of view long before the reader finishes the specs. */}
      <div className="lg:hidden sticky bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-spice-brown/15 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-ink-500 truncate">
              {selectedVariant.size} pack
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold text-spice-brown">
                ₹{selectedVariant.discountPrice || selectedVariant.price}
              </span>
              {selectedVariant.discountPrice && (
                <span className="text-[11px] text-ink-500 line-through">
                  ₹{selectedVariant.price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleWishlist(product)}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="w-11 h-11 shrink-0 rounded-xl border border-spice-brown/20 flex items-center justify-center text-spice-brown"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-spice-red text-spice-red' : ''}`} />
          </button>

          <button
            onClick={() => addToCart(product, selectedVariant.size, quantity)}
            disabled={isUnavailable}
            className="flex-1 max-w-[55%] py-3 px-4 rounded-xl bg-spice-brown disabled:bg-surface-300 disabled:text-ink-600 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            {product.isUpcoming ? 'Coming Soon' : selectedVariant.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
