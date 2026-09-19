import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const shippingFee = cartTotal > 499 || cartTotal === 0 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.05); // 5% GST
  const grandTotal = cartTotal + shippingFee + tax;

  if (cart.length === 0) {
    return (
      <div className="bg-spice-cream min-h-screen py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-spice-saffron/15 text-spice-saffron flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-spice-brown mb-3">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-spice-brown/70 mb-8">
            Explore our authentic Odia stone-ground spices and add pure flavour to your kitchen.
          </p>
          <Link
            to="/products"
            className="px-8 py-3.5 bg-spice-red text-white font-bold text-xs rounded-full shadow-lg hover:bg-spice-red-dark transition-all inline-block"
          >
            Explore Product Catalogue →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown mb-8">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.variantSize}`}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-spice-brown/10 shadow-sm flex items-center gap-4 justify-between"
              >
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80'}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-spice-beige/40 shrink-0"
                />

                <div className="flex-1">
                  <Link to={`/products/${item.product.slug}`} className="font-serif font-bold text-base text-spice-brown hover:text-spice-red transition-colors block">
                    {item.product.name}
                  </Link>
                  <span className="text-xs font-semibold text-spice-saffron block mt-0.5">
                    Pack Size: {item.variantSize}
                  </span>
                  <span className="text-sm font-bold text-spice-brown block mt-1">
                    ₹{item.unitPrice}
                  </span>
                </div>

                {/* Quantity modifier */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-spice-brown/20 rounded-lg bg-spice-cream overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantSize, item.quantity - 1)}
                      className="px-2.5 py-1 text-spice-brown font-bold hover:bg-spice-brown/10 text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs text-spice-brown">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantSize, item.quantity + 1)}
                      className="px-2.5 py-1 text-spice-brown font-bold hover:bg-spice-brown/10 text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId, item.variantSize)}
                    className="p-2 text-spice-brown/40 hover:text-spice-red transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-spice-brown/60 hover:text-spice-red font-semibold"
              >
                Clear Entire Cart
              </button>
              <Link to="/products" className="text-xs text-spice-red font-bold hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary Box */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm sticky top-28 space-y-6">
              <h2 className="font-serif font-bold text-xl text-spice-brown border-b border-spice-brown/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-spice-brown">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Tax (5%)</span>
                  <span className="font-bold">₹{tax}</span>
                </div>
                {shippingFee === 0 && (
                  <p className="text-[11px] text-spice-saffron font-semibold bg-spice-saffron/10 p-2 rounded-lg text-center">
                    🏬 Retail Dealer Pickup & Wholesale Order Available
                  </p>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-spice-brown border-t border-spice-brown/10 pt-3">
                  <span>Total Amount</span>
                  <span className="text-spice-red">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-spice-brown/60 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-spice-saffron" /> Secure 256-Bit Payment Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
