import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchApi } from '../../config/api';
import { useT } from '../../i18n/LanguageContext';

export const HeroSection: React.FC = () => {
  const t = useT();
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    fetchApi('/api/v1/stats')
      .then((res) => setProductCount(res.data?.products ?? null))
      .catch(() => setProductCount(null));
  }, []);

  return (
    <section className="relative overflow-hidden bg-spice-cream py-16 md:py-24">
      {/* Background Subtle Shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-spice-saffron/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-spice-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spice-saffron/10 border border-spice-saffron/20 text-spice-saffron text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {t('hero.badge')}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-spice-brown leading-[1.15]">
              {t('hero.titleLead')} <span className="text-spice-red underline decoration-spice-turmeric/60 underline-offset-8">{t('hero.titleAccent')}</span>
            </h1>

            <p className="text-spice-brown/80 text-base sm:text-lg leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>

            {/* One row at every width; wraps only if a very narrow screen
                (or a long translation) genuinely can't fit both. */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
              <Link
                to="/products"
                className="px-4 sm:px-7 py-3.5 whitespace-nowrap rounded-full bg-spice-red hover:bg-spice-red-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                {t('action.exploreProducts')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/recipes"
                className="px-4 sm:px-7 py-3.5 whitespace-nowrap rounded-full bg-white border border-spice-brown/20 text-spice-brown font-bold text-sm hover:bg-spice-beige transition-colors"
              >
                {t('action.discoverRecipes')}
              </Link>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-6 border-t border-spice-brown/10 grid grid-cols-3 gap-4">
              <div>
                <span className="font-serif text-2xl font-bold text-spice-red block break-words">100%</span>
                <span className="text-xs text-spice-brown/70 font-medium">{t('hero.statStoneGround')}</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-spice-saffron block break-words">{t('hero.zero')}</span>
                <span className="text-xs text-spice-brown/70 font-medium">{t('hero.statNoDyes')}</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-spice-brown block break-words">
                  {productCount !== null ? productCount : '—'}
                </span>
                <span className="text-xs text-spice-brown/70 font-medium">{t('hero.statRange')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Image Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
                  alt="Subhadarshini Spices"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quality badge. On a phone it sits below the photo as a
                  normal block: floating it on a negative offset pushed it past
                  the viewport edge and laid it over the image, which cramped
                  both. From sm up there is room for the overlap again. */}
              <div className="mt-4 w-full sm:mt-0 sm:w-auto sm:absolute sm:-bottom-6 sm:-left-6 bg-white p-4 rounded-2xl shadow-lg sm:shadow-xl border border-spice-brown/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-spice-saffron/15 flex items-center justify-center text-spice-saffron">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-serif font-bold text-spice-brown text-sm block">{t('hero.badgeCertified')}</span>
                  <span className="text-xs text-ink-500">{t('hero.badgeCertifiedSub')}</span>
                </div>
              </div>

              {/* Floating Award Badge */}
              <div className="absolute -top-6 -right-6 bg-spice-brown text-white p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-full bg-spice-turmeric/20 flex items-center justify-center text-spice-turmeric">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif font-bold text-xs block text-spice-cream">{t('hero.badgeHeritage')}</span>
                  <span className="text-[10px] text-spice-beige/70">{t('hero.badgeHeritageSub')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
