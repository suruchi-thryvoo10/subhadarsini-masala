import React, { useState } from 'react';
import { Store, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../config/api';

type Values = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessType: string;
  message: string;
};

const EMPTY: Values = {
  name: '',
  businessName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  businessType: 'Retail Store',
  message: ''
};

const BUSINESS_TYPES = [
  'Retail Store',
  'Wholesale / Distribution',
  'Supermarket Chain',
  'Hotel / Restaurant / Catering',
  'Online Seller',
  'Other'
];

/** Client-side checks that mirror the server's zod rules, so the user gets told first. */
const validate = (v: Values): Partial<Record<keyof Values, string>> => {
  const e: Partial<Record<keyof Values, string>> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name';
  if (v.businessName.trim().length < 2) e.businessName = 'Business or shop name is required';
  if (!/^[+]?[\d\s-]{10,15}$/.test(v.phone.trim())) e.phone = 'Enter a valid phone number';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter a valid email address';
  if (v.address.trim().length < 5) e.address = 'Please enter your address';
  if (v.city.trim().length < 2) e.city = 'City is required';
  if (v.state.trim().length < 2) e.state = 'State is required';
  if (!/^\d{6}$/.test(v.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
  if (v.message.trim().length < 5) e.message = 'Tell us briefly what you need';
  return e;
};

export const BecomeDealerForm: React.FC = () => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    setServerError(null);
    try {
      await fetchApi('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, type: 'DEALER' })
      });
      setStatus('sent');
      setValues(EMPTY);
    } catch (err: any) {
      setStatus('error');
      setServerError(err?.message || 'We could not send your enquiry. Please try again.');
    }
  };

  const field =
    'w-full px-4 py-2.5 text-sm rounded-xl bg-spice-cream border focus:outline-none transition-colors';
  const label = 'text-xs font-bold text-spice-brown uppercase tracking-wider block mb-1.5';

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-3xl border border-spice-brown/10 shadow-sm p-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-spice-red mx-auto" />
        <h3 className="font-serif font-bold text-2xl text-spice-brown mt-4">Enquiry received</h3>
        <p className="text-sm text-spice-brown/75 mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for your interest in stocking Subhadarshini. Our distribution desk will review your
          details and get in touch shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 px-6 py-2.5 border border-spice-brown/20 text-spice-brown font-bold text-xs rounded-full hover:border-spice-red transition-colors"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-spice-brown/10 shadow-sm p-6 md:p-10">
      <div className="flex items-center gap-3 mb-2">
        <Store className="w-6 h-6 text-spice-red" />
        <h2 className="font-serif font-bold text-2xl text-spice-brown">Become a Dealer</h2>
      </div>
      <p className="text-sm text-spice-brown/70 mb-8 max-w-2xl leading-relaxed">
        Stock Subhadarshini in your shop or territory. Share your details and our distribution team
        will get back to you.
      </p>

      {status === 'error' && serverError && (
        <div className="mb-6 p-3 rounded-xl bg-brand-50 border border-brand-200 text-spice-red text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {([
          ['name', 'Full Name *', 'text', 'Your name'],
          ['businessName', 'Business / Shop Name *', 'text', 'Shop or firm name'],
          ['phone', 'Phone Number *', 'tel', '+91 00000 00000'],
          ['email', 'Email *', 'email', 'you@example.com'],
          ['city', 'City *', 'text', 'City'],
          ['state', 'State *', 'text', 'State'],
          ['pincode', 'Pincode *', 'text', '751015']
        ] as const).map(([key, labelText, type, placeholder]) => (
          <div key={key} className={key === 'pincode' ? '' : undefined}>
            <label className={label} htmlFor={`dealer-${key}`}>{labelText}</label>
            <input
              id={`dealer-${key}`}
              type={type}
              value={values[key]}
              onChange={set(key)}
              placeholder={placeholder}
              aria-invalid={Boolean(errors[key])}
              className={`${field} ${errors[key] ? 'border-spice-red' : 'border-spice-brown/15 focus:border-spice-saffron'}`}
            />
            {errors[key] && <p className="text-[11px] text-spice-red mt-1">{errors[key]}</p>}
          </div>
        ))}

        <div>
          <label className={label} htmlFor="dealer-businessType">Type of Business *</label>
          <select
            id="dealer-businessType"
            value={values.businessType}
            onChange={set('businessType')}
            className={`${field} border-spice-brown/15 focus:border-spice-saffron cursor-pointer`}
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="dealer-address">Address *</label>
          <input
            id="dealer-address"
            type="text"
            value={values.address}
            onChange={set('address')}
            placeholder="Street, area, landmark"
            aria-invalid={Boolean(errors.address)}
            className={`${field} ${errors.address ? 'border-spice-red' : 'border-spice-brown/15 focus:border-spice-saffron'}`}
          />
          {errors.address && <p className="text-[11px] text-spice-red mt-1">{errors.address}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="dealer-message">Message / Requirement *</label>
          <textarea
            id="dealer-message"
            rows={4}
            value={values.message}
            onChange={set('message')}
            placeholder="Which products are you interested in, and what volumes?"
            aria-invalid={Boolean(errors.message)}
            className={`${field} resize-none ${errors.message ? 'border-spice-red' : 'border-spice-brown/15 focus:border-spice-saffron'}`}
          />
          {errors.message && <p className="text-[11px] text-spice-red mt-1">{errors.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-spice-brown hover:bg-spice-red disabled:bg-surface-300 disabled:text-ink-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending…' : 'Submit Dealer Enquiry'}
          </button>
        </div>
      </form>
    </div>
  );
};
