import React from 'react';
import { Sprout, ShieldCheck, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '../ui/Reveal';
import { CountUp } from '../ui/CountUp';

export const TrustStrip: React.FC = () => {
  const trustPillars = [
    { icon: Sprout, title: 'Farm Sourced Ingredients', desc: 'Directly from certified spice growers' },
    { icon: ShieldCheck, title: 'NABL Lab Tested', desc: '42 quality & purity checks per batch' },
    { icon: Sparkles, title: 'Hygienically Processed', desc: 'Touchless automated stone grinding' },
    { icon: CheckCircle2, title: 'Quality Controlled', desc: 'Zero added colors or starch' },
    { icon: HeartHandshake, title: 'Authentic Indian Flavours', desc: 'Preserving age-old heritage recipes' }
  ];

  const stats = [
    { to: 100, suffix: '%', label: 'Natural & pure' },
    { to: 42, suffix: '', label: 'Checks per batch' },
    { to: 44, suffix: '+', label: 'Products in range' },
    { to: 30, suffix: '+', label: 'Years of milling' }
  ];

  return (
    <section className="bg-spice-brown text-white py-10 border-y border-spice-saffron/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustPillars.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <StaggerItem key={idx}>
                <div className="h-full flex flex-col items-center text-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-spice-saffron/20 text-spice-turmeric flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-spice-cream mb-1">{item.title}</h4>
                  <p className="text-[11px] text-spice-beige/70">{item.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Numbers count up the first time the strip scrolls into view */}
        <div className="mt-8 pt-8 border-t border-spice-cream/15 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <CountUp
                to={stat.to}
                suffix={stat.suffix}
                className="font-serif text-3xl sm:text-4xl font-bold text-spice-turmeric tabular-nums"
              />
              <p className="text-[11px] uppercase tracking-wider text-spice-beige/70 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
