import React from 'react';
import { Sprout, ShieldCheck, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustPillars = [
    { icon: Sprout, title: 'Farm Sourced Ingredients', desc: 'Directly from certified spice growers' },
    { icon: ShieldCheck, title: 'NABL Lab Tested', desc: '42 quality & purity checks per batch' },
    { icon: Sparkles, title: 'Hygienically Processed', desc: 'Touchless automated stone grinding' },
    { icon: CheckCircle2, title: 'Quality Controlled', desc: 'Zero added colors or starch' },
    { icon: HeartHandshake, title: 'Authentic Indian Flavours', desc: 'Preserving age-old heritage recipes' }
  ];

  return (
    <section className="bg-spice-brown text-white py-10 border-y border-spice-saffron/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustPillars.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-spice-saffron/20 text-spice-turmeric flex items-center justify-center mb-3">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-sm text-spice-cream mb-1">{item.title}</h4>
                <p className="text-[11px] text-spice-beige/70">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
