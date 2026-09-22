import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Search, Sparkles, Cog, Flame, ShieldAlert, PackageCheck, Truck } from 'lucide-react';

export const ManufacturingStoryTimeline: React.FC = () => {
  const steps = [
    { title: 'Raw Material', desc: 'Direct farm sourcing of whole unground spices.', icon: Sprout },
    { title: 'Quality Inspection', desc: 'Physical inspection for moisture, aroma & purity.', icon: Search },
    { title: 'Cleaning', desc: 'Triple-stage destoning and magnetic metal separation.', icon: Sparkles },
    { title: 'Grinding', desc: 'Slow traditional stone milling to preserve essential oils.', icon: Cog },
    { title: 'Blending', desc: 'Precision formulated spice ratio blending.', icon: Flame },
    { title: 'Lab Testing', desc: 'NABL laboratory verification of purity & microbiology.', icon: ShieldAlert },
    { title: 'Packaging', desc: 'Aroma-lock multilayer food grade pouch seal.', icon: PackageCheck },
    { title: 'Distribution', desc: 'Fresh direct supply to retailers & doorstep orders.', icon: Truck }
  ];

  return (
    <section className="py-20 bg-spice-beige/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
            Purity In Every Grain
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
            The Subhadarshini Production Journey
          </h2>
          <p className="text-sm text-spice-brown/70 mt-3">
            From farm fields to your kitchen handi, follow how we transform pristine whole spices into aromatic masterpieces.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-spice-brown/10 shadow-sm relative group hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-spice-saffron/10 text-spice-saffron flex items-center justify-center font-bold group-hover:bg-spice-red group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-xs font-bold text-ink-500">0{idx + 1}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-spice-brown mb-1">{step.title}</h3>
                <p className="text-xs text-spice-brown/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
