import React, { useState } from 'react';
import { CONTACT } from '../config/contact';
import { Building2, CheckCircle2, Send, ShieldCheck, PhoneCall } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { useSeo } from '../hooks/useSeo';

export const WholesalePage: React.FC = () => {
  useSeo({
    title: 'Wholesale & Bulk Supply',
    description:
      'Institutional and bulk supply of Subhadarshini stone-ground masalas and spices for retailers, distributors and food businesses.',
    path: '/wholesale'
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    city: '',
    state: 'Odisha',
    expectedVolume: '100 kg - 500 kg / month',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'WHOLESALE' })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Text */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 bg-brand-50 text-spice-red text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Institutional & Bulk Distribution
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-brown leading-tight">
              Partner With Subhadarshini For B2B Wholesale
            </h1>
            <p className="text-sm text-spice-brown/80 leading-relaxed">
              We supply pure stone-ground spices in bulk packaging to hotel chains, restaurants, caterers, food processors, and retail supermarket distributors across India.
            </p>

            <div className="space-y-4 pt-4">
              {[
                'Direct factory wholesale pricing with zero middleman markup',
                'Customized bulk bag sizes (5kg, 10kg, 25kg vacuum sealed packs)',
                'Guaranteed NABL batch purity certificate with every shipment',
                'Dedicated account manager & fast logistics dispatch'
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-spice-saffron shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-spice-brown">{point}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-spice-brown/10 flex items-center gap-4">
              <PhoneCall className="w-8 h-8 text-spice-red" />
              <div>
                <span className="text-xs text-ink-500 block">Direct Wholesale Desk</span>
                <span className="font-serif font-bold text-lg text-spice-brown">{CONTACT.phoneDisplay} · {CONTACT.email}</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-spice-brown/10 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-spice-red mx-auto" />
                <h2 className="font-serif text-2xl font-bold text-spice-brown">Enquiry Submitted!</h2>
                <p className="text-xs text-spice-brown/70">
                  Thank you for your interest. Our institutional sales lead will reach out to you within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-spice-brown text-white font-bold text-xs rounded-full"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif font-bold text-2xl text-spice-brown border-b border-spice-brown/10 pb-3">
                  Wholesale Trade Enquiry
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-spice-brown uppercase block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-spice-brown uppercase block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Expected Monthly Volume</label>
                  <select
                    value={formData.expectedVolume}
                    onChange={(e) => setFormData({ ...formData, expectedVolume: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                  >
                    <option value="50 kg - 100 kg / month">50 kg - 100 kg / month</option>
                    <option value="100 kg - 500 kg / month">100 kg - 500 kg / month</option>
                    <option value="500 kg - 2 Tons / month">500 kg - 2 Tons / month</option>
                    <option value="Above 2 Tons / month">Above 2 Tons / month</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Message & Specific Products Required *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  {submitting ? 'Submitting Enquiry...' : 'Submit B2B Bulk Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
