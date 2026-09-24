import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, CheckCircle2, Send } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { CONTACT } from '../config/contact';
import { useSeo } from '../hooks/useSeo';

export const ContactPage: React.FC = () => {
  useSeo({
    title: 'Contact Us',
    description:
      'Get in touch with Subhadarshini Spices in Bhubaneswar, Odisha — phone, email, WhatsApp and trade enquiries.',
    path: '/contact'
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(getApiUrl('/api/v1/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'GENERAL',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit enquiry. Please check your inputs.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-brown">
            Contact Subhadarshini Spices
          </h1>
          <p className="text-sm text-spice-brown/80 mt-3">
            Have questions about our products, orders, or dealership opportunities? We’d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information & WhatsApp */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-spice-brown/10 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-spice-brown">Headquarters & Factory</h3>
              <div className="space-y-4 text-xs text-spice-brown/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-spice-saffron shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-spice-brown">Subhadarshini Spices & Foods Pvt. Ltd.</strong>
                    <span>{CONTACT.addressFull}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-spice-saffron shrink-0" />
                  <a href={CONTACT.phoneHref} className="hover:text-spice-red">{CONTACT.phoneDisplay}</a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-spice-saffron shrink-0" />
                  <a href={CONTACT.emailHref} className="hover:text-spice-red">{CONTACT.email}</a>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="bg-spice-brown hover:bg-spice-red text-white p-6 rounded-3xl shadow-lg flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                <div>
                  <span className="font-serif font-bold text-lg block">Instant WhatsApp Support</span>
                  <span className="text-xs text-white/80">Chat directly with our customer care desk</span>
                </div>
              </div>
              <span className="font-bold text-xs bg-white/20 px-4 py-2 rounded-full uppercase">Chat Now →</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-spice-brown/10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-spice-red mx-auto" />
                <h3 className="font-serif font-bold text-2xl text-spice-brown">Message Sent!</h3>
                <p className="text-xs text-spice-brown/70">We have received your enquiry and our team will get back to you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-spice-brown text-white font-bold text-xs rounded-full"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif font-bold text-2xl text-spice-brown mb-4 border-b border-spice-brown/10 pb-3">
                  Send Us A Message
                </h3>

                {errorMsg && (
                  <div className="p-3 bg-brand-50 text-spice-red text-xs rounded-xl border border-brand-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-spice-brown uppercase block mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-spice-brown/20 text-xs bg-spice-cream focus:outline-none focus:border-spice-saffron"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
