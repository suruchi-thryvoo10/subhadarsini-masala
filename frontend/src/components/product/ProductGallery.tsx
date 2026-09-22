import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageUrl, handleImageError, PRODUCT_IMAGE_FALLBACK } from '../../config/images';

interface ProductGalleryProps {
  images?: string[];
  productName: string;
  /** Optional ribbon rendered over the top-left of the main image. */
  badge?: React.ReactNode;
}

/**
 * Product image gallery: a large main image with cursor-tracking zoom, plus a
 * thumbnail rail that only appears once a product actually has more than one
 * photograph. Arrow keys move between images when the gallery has focus.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, badge }) => {
  const gallery = images?.length ? images : [PRODUCT_IMAGE_FALLBACK];
  const hasMultiple = gallery.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // A different product may have fewer images than the one before it.
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const step = (delta: number) =>
    setActiveIndex((i) => (i + delta + gallery.length) % gallery.length);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={frameRef}
        role="group"
        aria-label={`${productName} images`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => !reduceMotion && setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handlePointerMove}
        className="group relative aspect-square rounded-2xl overflow-hidden bg-spice-cream border border-spice-brown/10 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-spice-saffron"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={gallery[activeIndex]}
            src={resolveImageUrl(gallery[activeIndex])}
            onError={handleImageError}
            alt={`${productName} — image ${activeIndex + 1} of ${gallery.length}`}
            width={900}
            height={900}
            decoding="async"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transform: isZooming ? 'scale(1.9)' : 'scale(1)'
            }}
            className="absolute inset-0 w-full h-full object-contain p-6 drop-shadow-md transition-transform duration-200 ease-out"
          />
        </AnimatePresence>

        {badge && <div className="absolute top-4 left-4 z-10">{badge}</div>}

        {/* Zoom affordance — hidden while actually zooming so it never covers the pack */}
        {!isZooming && (
          <span className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/85 backdrop-blur-sm text-spice-brown text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3 h-3" /> Hover to zoom
          </span>
        )}

        {hasMultiple && (
          <>
            <button
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-spice-brown hover:text-spice-red opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-spice-brown hover:text-spice-red opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">
          {gallery.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show image ${idx + 1}`}
              aria-current={idx === activeIndex}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-white transition-all ${
                idx === activeIndex
                  ? 'border-spice-red shadow-sm'
                  : 'border-spice-brown/10 hover:border-spice-saffron opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={resolveImageUrl(src)}
                onError={handleImageError}
                alt=""
                loading="lazy"
                className="w-full h-full object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
