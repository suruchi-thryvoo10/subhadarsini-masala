import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { fetchApi } from '../../config/api';
import { useT } from '../../i18n/LanguageContext';

// ─── Slide data ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'saree-lady',
    image: '/images/brand/hero-saree-lady.png',
    alt: 'Subhadarshini Garam Masala – Lady in Saree',
    tag: 'GARAM MASALA — RICH AROMA & AUTHENTIC BLEND',
    headline: (
      <>
        "Enhance the{' '}
        <span className="text-spice-turmeric block sm:inline">
          TASTE OF EVERY DISH"
        </span>
      </>
    ),
    subtext:
      'Formulated with whole handpicked spices slow-milled on granite stone mills in Odisha to keep natural volatile oils & aroma locked in.',
  },
  {
    id: 'ambassador',
    image: '/images/brand/hero-ambassador.jpg',
    alt: 'Subhadarshini Masala Brand Ambassador',
    tag: 'SUBHADARSHINI MASALA — 100% PURE & STONE GROUND',
    headline: (
      <>
        "Pure Spices from the{' '}
        <span className="text-spice-turmeric block sm:inline">
          Heart of Odisha"
        </span>
      </>
    ),
    subtext:
      'Stone-ground on traditional granite mills to preserve the volatile oils that give every dish its authentic, deep-rooted flavour.',
  },
  {
    id: 'man-turmeric',
    image: '/images/brand/hero-man-turmeric.png',
    alt: 'Subhadarshini Turmeric Powder',
    tag: 'TURMERIC POWDER — 100% NATURAL & CHEMICAL-FREE',
    headline: (
      <>
        "The Golden Spice{' '}
        <span className="text-spice-turmeric block sm:inline">
          of Health & Flavour"
        </span>
      </>
    ),
    subtext:
      'Pure sun-dried turmeric stone-ground without additives, preserving the natural curcumin, colour and earthy warmth of every pinch.',
  },
];

const SLIDE_DURATION = 5000; // ms between auto-advances

// ─── Slide transition variants ────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export const HeroSection: React.FC = () => {
  const t = useT();
  const prefersReducedMotion = useReducedMotion();
  const [productCount, setProductCount] = useState<number | null>(null);

  // Carousel state
  const [[current, direction], setCurrent] = useState([0, 1]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse 3D Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const bgTranslateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const bgTranslateY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);
  const bgRotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const bgRotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);

  useEffect(() => {
    fetchApi('/api/v1/stats')
      .then((res) => setProductCount(res.data?.products ?? 34))
      .catch(() => setProductCount(34));
  }, []);

  // Auto-advance carousel
  const advance = useCallback(
    (dir: number) => {
      setCurrent(([prev]) => [
        (prev + dir + SLIDES.length) % SLIDES.length,
        dir,
      ]);
    },
    []
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => advance(1), SLIDE_DURATION);
  }, [advance]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    startTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, startTimer, prefersReducedMotion]);

  const goTo = (index: number) => {
    const dir = index > current ? 1 : -1;
    setCurrent([index, dir]);
    startTimer();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[min(88svh,640px)] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[660px] overflow-hidden bg-spice-dark text-white border-b border-spice-brown/10 flex flex-col justify-between [perspective:1200px]"
    >

      {/* ── SLIDING BACKGROUND IMAGES ─────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={prefersReducedMotion ? {} : slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Parallax wrapper */}
          <motion.div
            className="w-full h-full overflow-hidden"
            style={
              !prefersReducedMotion
                ? {
                    x: bgTranslateX,
                    y: bgTranslateY,
                    rotateX: bgRotateX,
                    rotateY: bgRotateY,
                    transformStyle: 'preserve-3d',
                  }
                : undefined
            }
          >
            <motion.img
              src={slide.image}
              alt={slide.alt}
              data-slide={slide.id}
              className="hero-cover-img filter contrast-[1.04] brightness-[1.02]"
              animate={
                prefersReducedMotion
                  ? { scale: 1 }
                  : { scale: [1, 1.04, 1], rotate: [0, 0.2, 0] }
              }
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Mobile/tablet: fade from the bottom so the photo stays visible above the copy.
              Laptop: left-to-right wash so the subject on the right stays bright. */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-spice-dark via-spice-dark/55 to-black/20 lg:hidden" />
          <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-r from-spice-dark/95 via-spice-dark/35 to-transparent" />
          <div className="absolute inset-0 z-10 hidden lg:block bg-gradient-to-t from-spice-dark/80 via-transparent to-spice-dark/30" />
        </motion.div>
      </AnimatePresence>

      {/* ── SPICE PARTICLES ───────────────────────────────────────────────── */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3.5 h-3.5 rounded-full bg-spice-turmeric/40 blur-[0.5px] shadow-sm"
              style={{
                top: `${(i * 14 + 10) % 85}%`,
                left: `${(i * 11 + 6) % 60}%`,
              }}
              animate={{
                y: [0, -35, 0],
                x: [0, i % 2 === 0 ? 18 : -18, 0],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.7, 1.3, 0.7],
              }}
              transition={{ duration: 5 + i * 1.3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* ── HERO CONTENT OVERLAY ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-16 sm:pb-20 lg:py-16 relative z-20 w-full mt-auto lg:my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Side: Headline & Actions */}
          <motion.div
            key={`content-${slide.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="lg:col-span-7 space-y-6 max-w-2xl"
          >
            {/* Brand Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spice-saffron/20 border border-spice-saffron/40 text-spice-turmeric text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {slide.tag}
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {slide.headline}
            </h1>

            <p className="text-spice-cream/90 text-base sm:text-lg leading-relaxed font-medium drop-shadow-sm">
              {slide.subtext}
            </p>

            {/* Sourcing Chain Pill */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-spice-cream flex flex-wrap items-center gap-2 max-w-xl shadow-lg">
              <span className="text-spice-turmeric font-serif font-extrabold">Subhadarshini</span>
              <ChevronRight className="w-3.5 h-3.5 text-spice-turmeric" />
              <span>Farm Spices</span>
              <ChevronRight className="w-3.5 h-3.5 text-spice-turmeric" />
              <span>Stone Grinding</span>
              <ChevronRight className="w-3.5 h-3.5 text-spice-turmeric" />
              <span className="text-white font-serif font-extrabold">Delicious Odia Meals</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-stretch gap-3 sm:gap-4 pt-2">
              <Link
                to="/products"
                className="px-8 py-4 rounded-full bg-spice-red hover:bg-spice-red-dark text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                {t('action.exploreProducts')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/recipes"
                className="px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center"
              >
                {t('action.discoverRecipes')}
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-turmeric block">100%</span>
                <span className="text-xs text-spice-beige/80 font-medium">Stone Ground</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-white block">ZERO</span>
                <span className="text-xs text-spice-beige/80 font-medium">Added Dyes</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-cream block">
                  {productCount !== null ? productCount : 34}+
                </span>
                <span className="text-xs text-spice-beige/80 font-medium">Masalas Range</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── CAROUSEL CONTROLS ─────────────────────────────────────────────── */}
      {/* Prev / Next arrows */}
      <button
        onClick={() => { advance(-1); startTimer(); }}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/55 border border-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => { advance(1); startTimer(); }}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/55 border border-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-400 rounded-full ${
              i === current
                ? 'w-6 h-2 bg-spice-turmeric'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!prefersReducedMotion && (
        <motion.div
          key={`progress-${slide.id}`}
          className="absolute bottom-0 left-0 h-[2px] bg-spice-turmeric/70 z-30"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
        />
      )}
    </section>
  );
};

