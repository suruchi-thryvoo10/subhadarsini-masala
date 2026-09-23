import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types';
import { resolveImageUrl, handleImageError } from '../../config/images';

interface CategoryRailProps {
  categories: Category[];
  loading?: boolean;
}

/**
 * Full-bleed category carousel.
 *
 * Cards are sized so roughly four sit in a desktop viewport at once. The track
 * renders the set twice and moves exactly -50%, so the second copy arrives where
 * the first began — a seamless loop. Motion is CSS, paused on hover and on
 * keyboard focus, and switched off entirely for reduced-motion users.
 */
export const CategoryRail: React.FC<CategoryRailProps> = ({ categories, loading }) => {
  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden px-4 sm:px-6 lg:px-8">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="w-[min(78vw,320px)] lg:w-[24vw] aspect-[4/5] shrink-0 rounded-2xl bg-white/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  const track = [...categories, ...categories];

  return (
    <div className="marquee group relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-spice-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-spice-cream to-transparent" />

      <div className="marquee-track flex gap-6 w-max py-2">
        {track.map((cat, idx) => (
          <Link
            key={`${cat._id}-${idx}`}
            to={`/category/${cat.slug}`}
            aria-hidden={idx >= categories.length}
            tabIndex={idx >= categories.length ? -1 : 0}
            className="group/card relative w-[min(78vw,320px)] lg:w-[24vw] shrink-0 rounded-2xl overflow-hidden shadow-md aspect-[4/5] flex flex-col justify-end border border-spice-brown/10 hover:shadow-xl transition-shadow bg-spice-beige"
          >
            <img
              src={resolveImageUrl(cat.image)}
              onError={handleImageError}
              alt={cat.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain p-6 pb-28 group-hover/card:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 bg-spice-dark px-5 py-4">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-spice-cream group-hover/card:text-spice-turmeric transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-spice-turmeric mt-2">
                Explore
                <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
