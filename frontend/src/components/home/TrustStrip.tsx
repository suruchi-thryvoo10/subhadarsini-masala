import React, { useEffect, useState } from 'react';
import { Sprout, ShieldCheck, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '../ui/Reveal';
import { CountUp } from '../ui/CountUp';
import { fetchApi } from '../../config/api';

interface PublicStats {
  products: number;
  categories: number;
  verifiedBatches: number;
  averageRating: number | null;
  totalReviews: number;
}

export const TrustStrip: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetchApi('/api/v1/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Stats unavailable:', err));
  }, []);

  const trustPillars = [
    { icon: Sprout, title: 'Farm Sourced Ingredients', desc: 'Directly from certified spice growers' },
    { icon: ShieldCheck, title: 'NABL Lab Tested', desc: 'Every batch carries a lab certificate' },
    { icon: Sparkles, title: 'Hygienically Processed', desc: 'Touchless automated stone grinding' },
    { icon: CheckCircle2, title: 'Quality Controlled', desc: 'No added colours or starch' },
    { icon: HeartHandshake, title: 'Authentic Indian Flavours', desc: 'Preserving age-old heritage recipes' }
  ];

  /**
   * Every figure below is counted from the catalogue by /api/v1/stats, so the
   * strip can never claim more than the shop actually holds. Anything the data
   * cannot support is simply not shown.
   */
  const figures = stats
    ? [
        { to: stats.products, suffix: '', label: 'Products in range' },
        { to: stats.categories, suffix: '', label: 'Spice categories' },
        { to: stats.verifiedBatches, suffix: '', label: 'Lab-verified batches' },
        {
          to: stats.averageRating ?? 0,
          suffix: ' / 5',
          decimals: 1,
          label: 'Average customer rating'
        }
      ].filter((f) => f.to > 0)
    : [];

  return (
    <section className="bg-spice-brown text-white py-10 border-y border-spice-saffron/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustPillars.map((item) => {
            const IconComponent = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="h-full flex flex-col items-center text-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-spice-saffron/20 text-spice-turmeric flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-spice-cream mb-1">{item.title}</h4>
                  <p className="text-[11px] text-spice-beige/80">{item.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {figures.length > 0 && (
          <div
            className={`mt-8 pt-8 border-t border-spice-cream/15 grid grid-cols-2 gap-6 ${
              figures.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
            }`}
          >
            {figures.map((figure) => (
              <div key={figure.label} className="text-center">
                <CountUp
                  to={figure.to}
                  suffix={figure.suffix}
                  decimals={figure.decimals ?? 0}
                  className="font-serif text-3xl sm:text-4xl font-bold text-spice-turmeric tabular-nums"
                />
                <p className="text-[11px] uppercase tracking-wider text-spice-beige/80 mt-1">
                  {figure.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
