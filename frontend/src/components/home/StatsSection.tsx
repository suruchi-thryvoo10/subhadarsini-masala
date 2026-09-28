import React, { useEffect, useState } from 'react';
import { CountUp } from '../ui/CountUp';
import { fetchApi } from '../../config/api';
import { Package, Layers, ShieldCheck } from 'lucide-react';

interface PublicStats {
  products: number;
  categories: number;
  verifiedBatches: number;
}

export const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<PublicStats>({
    products: 34,
    categories: 6,
    verifiedBatches: 120
  });

  useEffect(() => {
    fetchApi('/api/v1/stats')
      .then((res) => {
        if (res.data) {
          setStats({
            products: res.data.products || 34,
            categories: res.data.categories || 6,
            verifiedBatches: res.data.verifiedBatches || 120
          });
        }
      })
      .catch(() => {
        // Fallback to default authentic numbers
      });
  }, []);

  const items = [
    {
      label: 'Products in Range',
      value: stats.products,
      suffix: '+',
      icon: Package,
      desc: '100% Pure & Authentic Spices'
    },
    {
      label: 'Spice Categories',
      value: stats.categories,
      suffix: '',
      icon: Layers,
      desc: 'Ground, Blended & Heritage Blends'
    },
    {
      label: 'Lab Verified Batches',
      value: stats.verifiedBatches,
      suffix: '+',
      icon: ShieldCheck,
      desc: 'Tested for Zero Adulteration & Purity'
    }
  ];

  return (
    <section className="bg-spice-cream py-16 border-y border-spice-brown/10 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-spice-saffron/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-spice-brown/10 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-spice-saffron/10 text-spice-red flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-spice-brown tracking-tight">
                  <CountUp to={item.value} suffix={item.suffix} durationMs={1600} />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-spice-brown mb-1">
                    {item.label}
                  </h3>
                  <p className="text-xs text-spice-brown/70 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
