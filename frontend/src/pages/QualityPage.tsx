import React, { useState } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, FileCheck, Sprout, Building2, AlertCircle } from 'lucide-react';
import { BatchVerification } from '../types';
import { getApiUrl } from '../config/api';

export const QualityPage: React.FC = () => {
  const [batchInput, setBatchInput] = useState('SD2026-SP01');
  const [batchResult, setBatchResult] = useState<BatchVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setBatchResult(null);

    try {
      const res = await fetch(getApiUrl(`/api/v1/quality/verify/${encodeURIComponent(batchInput.trim())}`));
      const data = await res.json();
      if (data.success) {
        setBatchResult(data.data);
      } else {
        setErrorMsg(data.message || 'Batch verification failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to verify batch. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spice-saffron/15 text-spice-saffron text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Uncompromising Quality & Traceability
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-brown">
            Quality Verification & Batch Authenticity
          </h1>
          <p className="text-sm text-spice-brown/80 mt-4 leading-relaxed">
            At Subhadarshini Spices, every production run undergoes 42 stringent NABL laboratory tests. Enter your package batch number below to inspect verified lab certificates and purity metrics.
          </p>
        </div>

        {/* Batch Lookup Box */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-spice-brown/15 shadow-xl mb-16">
          <h2 className="font-serif font-bold text-xl text-spice-brown mb-2 text-center">
            Inspect Package Batch Number
          </h2>
          <p className="text-xs text-spice-brown/60 text-center mb-6">
            Located near the manufacturing date on your Subhadarshini spice pouch (e.g. <code className="bg-spice-beige px-2 py-0.5 rounded font-mono font-bold text-spice-red">SD2026-SP01</code> or <code className="bg-spice-beige px-2 py-0.5 rounded font-mono font-bold text-spice-red">SD2026-TURMERIC-05</code>)
          </p>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="Enter Batch Number (e.g. SD2026-SP01)"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-spice-cream border border-spice-brown/20 text-xs font-mono font-bold text-spice-brown uppercase focus:outline-none focus:border-spice-saffron"
              />
              <Search className="w-4 h-4 text-spice-brown/40 absolute left-3.5 top-4" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>

          {/* Error display */}
          {errorMsg && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Verified Batch Result Card */}
          {batchResult && (
            <div className="mt-8 pt-8 border-t border-spice-brown/15 space-y-6">
              <div className="flex items-center justify-between bg-green-50 p-4 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <span className="font-serif font-bold text-sm text-green-900 block">
                      Authentic & Lab Verified Batch
                    </span>
                    <span className="text-[11px] text-green-700">
                      Certificate #{batchResult.qualityReport.certificateNumber}
                    </span>
                  </div>
                </div>
                <span className="bg-green-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-spice-brown">
                <div className="p-3 bg-spice-beige/40 rounded-xl border border-spice-brown/10">
                  <span className="text-spice-brown/60 block text-[10px]">Product Name</span>
                  <span className="font-serif font-bold text-sm">{batchResult.productName}</span>
                </div>
                <div className="p-3 bg-spice-beige/40 rounded-xl border border-spice-brown/10">
                  <span className="text-spice-brown/60 block text-[10px]">Batch Number</span>
                  <span className="font-mono font-bold text-sm text-spice-red">{batchResult.batchNumber}</span>
                </div>
                <div className="p-3 bg-spice-beige/40 rounded-xl border border-spice-brown/10">
                  <span className="text-spice-brown/60 block text-[10px]">Manufacturing Date</span>
                  <span className="font-bold">{new Date(batchResult.mfgDate).toLocaleDateString()}</span>
                </div>
                <div className="p-3 bg-spice-beige/40 rounded-xl border border-spice-brown/10">
                  <span className="text-spice-brown/60 block text-[10px]">Expiry Date</span>
                  <span className="font-bold">{new Date(batchResult.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Detailed Lab Report Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-spice-brown/15 space-y-3">
                <h4 className="font-serif font-bold text-sm text-spice-brown flex items-center gap-2 border-b border-spice-brown/10 pb-2">
                  <FileCheck className="w-4 h-4 text-spice-saffron" /> Certified Laboratory Test Results
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-spice-cream rounded-xl">
                    <span className="text-spice-brown/60 text-[10px] block">Purity & Curcumin</span>
                    <span className="font-bold text-spice-brown">{batchResult.qualityReport.purityScore}</span>
                  </div>
                  <div className="p-3 bg-spice-cream rounded-xl">
                    <span className="text-spice-brown/60 text-[10px] block">Moisture Content</span>
                    <span className="font-bold text-spice-brown">{batchResult.qualityReport.moistureLevel}</span>
                  </div>
                  <div className="p-3 bg-spice-cream rounded-xl">
                    <span className="text-spice-brown/60 text-[10px] block">Microbial Safety</span>
                    <span className="font-bold text-spice-brown">{batchResult.qualityReport.microbialCheck}</span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-spice-brown/70 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-spice-saffron" />
                  <span>Tested By: <strong>{batchResult.qualityReport.labCertifiedBy}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quality Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Farm Sourcing Standards',
              desc: 'We source exclusively from certified spice cultivators adhering to Good Agricultural Practices (GAP).',
              icon: Sprout
            },
            {
              title: 'Hygienic Stone Milling',
              desc: 'Cold stone-grinding technology operates below 40°C to preserve volatile essential aroma oils.',
              icon: Award
            },
            {
              title: 'Aroma-Lock Packaging',
              desc: 'Multi-layer aluminum moisture-barrier seal shields spices against oxygen degradation.',
              icon: ShieldCheck
            }
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-3xl border border-spice-brown/10 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-spice-saffron/15 text-spice-saffron flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-lg text-spice-brown mb-2">{item.title}</h3>
                <p className="text-xs text-spice-brown/70 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
