import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, ShieldCheck, Heart, ShoppingBag, Truck, Check, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';

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
        const res = await fetch(`/api/v1/products/${slug}`);
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

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-spice-brown/60 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:underline">Home</Link> / 
          <Link to="/products" className="hover:underline">Products</Link> / 
          <span className="text-spice-brown font-bold">{product.name}</span>
        </nav>

        {/* Product Grid Layout */}
        <div className="bg-white rounded-3xl border border-spice-brown/10 p-6 md:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-spice-beige/40 border border-spice-brown/10">
              <img
                src={product.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-spice-saffron/15 text-spice-saffron font-bold text-xs px-3 py-1 rounded-full uppercase">
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
                <span className="text-xs text-spice-brown/40">({product.ratingCount || 24} Verified Reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-spice-brown">
                  ₹{selectedVariant.discountPrice || selectedVariant.price}
                </span>
                {selectedVariant.discountPrice && (
                  <span className="text-base text-spice-brown/40 line-through">
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
                  className="flex-1 py-3.5 px-6 rounded-xl bg-spice-brown hover:bg-spice-red text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
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
        <div className="bg-white rounded-3xl border border-spice-brown/10 p-6 md:p-10 shadow-sm mb-16">
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
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-spice-brown mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
