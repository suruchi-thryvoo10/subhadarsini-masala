import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, CheckCircle2, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LabAuthenticitySection: React.FC = () => {
  const [batchQuery, setBatchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchQuery.trim()) {
      navigate(`/quality?batch=${encodeURIComponent(batchQuery.trim())}`);
    } else {
      navigate('/quality');
    }
  };

  return (
    <section className="relative overflow-hidden text-white border-y border-spice-saffron/20 min-h-[min(92svh,720px)] sm:min-h-[560px] lg:min-h-[520px] flex items-end lg:items-center">
      {/* Full-bleed facility photo — crop shifts per breakpoint so the building, cars, and sign stay visible */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/brand/company-facility.jpg"
          alt="Subhadarshini Private Limited Central Manufacturing Facility"
          className="facility-cover-img filter brightness-[1.1] contrast-[1.05]"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-spice-dark via-spice-dark/55 to-black/15 lg:hidden" />
        <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-r from-spice-dark/95 via-spice-dark/30 to-transparent" />
        <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-t from-spice-dark/80 via-transparent to-spice-dark/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-36 pb-10 sm:pt-28 sm:pb-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Verification Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spice-turmeric/20 border border-spice-turmeric/40 text-spice-turmeric text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-spice-turmeric" /> 100% NABL Lab Tested & Certified
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
              Verify Your Spice Package Authenticity & Lab Reports
            </h2>

            <p className="text-spice-cream/90 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Every Subhadarshini spice pack comes with a batch number printed on the rear seal. Search your batch ID to inspect NABL lab analysis reports confirming curcumin levels, moisture content, and zero pesticide residues.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-spice-cream bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-spice-turmeric shrink-0" /> Zero Chemical Adulteration
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-spice-cream bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-spice-turmeric shrink-0" /> Essential Oils Intact
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-spice-cream bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-spice-turmeric shrink-0" /> 100% Traceable Sourcing
              </div>
            </div>

            {/* Verification Form Box */}
            <form onSubmit={handleSearch} className="pt-4 space-y-3 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={batchQuery}
                  onChange={(e) => setBatchQuery(e.target.value)}
                  placeholder="Enter Batch Code (e.g. SD2026-SP01)"
                  className="w-full px-5 py-4 pl-12 rounded-2xl bg-white text-spice-brown placeholder-spice-brown/50 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-spice-turmeric shadow-2xl"
                />
                <Search className="w-4 h-4 text-spice-brown/60 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-spice-red hover:bg-spice-red-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Verify Batch Report <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/quality"
                  className="text-xs font-bold text-spice-turmeric hover:text-white underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1"
                >
                  Quality Control Lab →
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: Shifted compact card overlay at bottom-right corner so it does NOT cover SUBHADARSINI name */}
          <div className="lg:col-span-5 flex justify-end items-end self-end pt-6 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl space-y-2.5 max-w-xs sm:max-w-sm hover:border-spice-turmeric/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-spice-turmeric text-[10px] font-extrabold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" /> Subhadarshini Private Limited
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Central Manufacturing Facility
              </h3>
              <p className="text-[11px] text-spice-cream/80 leading-snug">
                State-of-the-Art Automated Stone Grinding Plant & NABL Certified Quality Control Laboratory.
              </p>
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-spice-turmeric font-bold">
                <span>📍 Sandhapur, Cuttack, Odisha</span>
                <span className="text-white font-normal text-[10px]">Fully Automated</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
