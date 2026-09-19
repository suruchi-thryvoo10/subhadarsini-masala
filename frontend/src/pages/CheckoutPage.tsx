import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, CreditCard, Truck, User } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Odisha');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');

  const shippingFee = cartTotal > 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + shippingFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderPayload = {
        items: cart.map((c) => ({
          productId: c.productId,
          variantSize: c.variantSize,
          unitPrice: c.unitPrice,
          quantity: c.quantity,
          name: c.product.name,
          sku: c.product.variants.find((v) => v.size === c.variantSize)?.sku || 'SKU-UNKNOWN'
        })),
        shippingAddress: { name, phone, street, city, state, pincode },
        paymentMethod,
        guestEmail: email
      };

      const res = await fetch('/api/v1/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        navigate(`/orders/track/${data.data.orderNumber}`);
      } else {
        alert(data.message || 'Error creating order');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-spice-brown mb-8 text-center">
          Secure Multi-Step Checkout
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-10 text-xs font-bold text-spice-brown">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-spice-red' : 'opacity-40'}`}>
            <span className="w-6 h-6 rounded-full bg-spice-red text-white flex items-center justify-center text-xs">1</span>
            <span>Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-spice-brown/20" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-spice-red' : 'opacity-40'}`}>
            <span className="w-6 h-6 rounded-full bg-spice-red text-white flex items-center justify-center text-xs">2</span>
            <span>Payment</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 md:p-10 border border-spice-brown/10 shadow-sm">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-xl text-spice-brown flex items-center gap-2 border-b border-spice-brown/10 pb-4">
                <Truck className="w-5 h-5 text-spice-saffron" /> 1. Customer & Shipping Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House/Flat No., Road, Landmark"
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-spice-red text-white font-bold text-xs rounded-full shadow-md"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-xl text-spice-brown flex items-center gap-2 border-b border-spice-brown/10 pb-4">
                <CreditCard className="w-5 h-5 text-spice-saffron" /> 2. Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  { id: 'UPI', label: 'Razorpay UPI (Google Pay, PhonePe, Paytm)', desc: 'Instant 1-click payment' },
                  { id: 'CARD', label: 'Credit / Debit Cards', desc: 'Visa, MasterCard, RuPay' },
                  { id: 'NETBANKING', label: 'Net Banking', desc: 'All major Indian banks supported' },
                  { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay when delivered to your door' }
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'border-spice-red bg-spice-red/5'
                        : 'border-spice-brown/15 bg-spice-cream hover:border-spice-saffron'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id as any)}
                        className="accent-spice-red"
                      />
                      <div>
                        <span className="font-bold text-xs text-spice-brown block">{m.label}</span>
                        <span className="text-[11px] text-spice-brown/60">{m.desc}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Order total confirmation */}
              <div className="bg-spice-cream p-4 rounded-2xl border border-spice-brown/10 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Tax</span>
                  <span>₹{shippingFee + tax}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-spice-brown pt-2 border-t border-spice-brown/10">
                  <span>Total Payable</span>
                  <span className="text-spice-red">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-spice-brown/60 hover:underline font-bold"
                >
                  ← Back to Address
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-spice-red text-white font-bold text-xs rounded-full shadow-lg hover:bg-spice-red-dark transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing Order...' : `Pay & Complete Order (₹${grandTotal})`}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
