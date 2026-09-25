import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { productImageUrl, handleImageError } from '../../config/images';
import { displayProductName } from '../../utils/format';
import { useCategoryName } from '../../i18n/categories';
import { useProductText } from '../../i18n/useProductText';
import { useT } from '../../i18n/LanguageContext';

interface ProductMarqueeProps {
  products: Product[];
}

/** Auto-scroll speed in px/s. Slow enough to read a card as it passes. */
const SPEED_DESKTOP = 40;
const SPEED_MOBILE = 28;
/** How long the rail waits after the last touch, drag or wheel before moving again. */
const RESUME_DELAY_MS = 2500;
/** Time to ease from standstill back to full speed, so resuming never lurches. */
const RAMP_MS = 900;
/** Pointer travel beyond which a mouse press counts as a drag, not a click. */
const DRAG_THRESHOLD = 6;

/**
 * Continuous horizontal rail of feature products.
 *
 * It is a real scroll container, so people can swipe it on a phone, use a
 * trackpad or shift+wheel on desktop, or grab and drag it with the mouse. On
 * top of that a requestAnimationFrame loop advances `scrollLeft` slowly so the
 * products drift by themselves.
 *
 * The set is rendered twice; once the scroll position passes the start of the
 * second copy it is wound back by exactly one copy's width, which looks
 * identical, so the loop never runs out in either the auto or manual case.
 *
 * Auto-scroll pauses while the mouse is over the rail or a card has keyboard
 * focus, and for a moment after any touch, drag or wheel, then eases back up
 * to speed. It stays off entirely for reduced-motion users, and idles while
 * the rail is off screen or the tab is hidden.
 */
export const ProductMarquee: React.FC<ProductMarqueeProps> = ({ products }) => {
  const t = useT();
  const categoryName = useCategoryName();
  const productText = useProductText();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track || products.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let loopWidth = 0; // width of one copy of the set, including the gap after it
    let pos = scroller.scrollLeft; // fractional position; scrollLeft may round
    let lastWrite = pos;
    let hovering = false;
    let focused = false;
    let visible = true;
    let pausedUntil = 0;
    let resumedAt = 0;
    let wasRunning = false;
    let lastFrame = 0;
    let raf = 0;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const mirror = track.children[products.length] as HTMLElement | undefined;
      loopWidth = first && mirror ? mirror.offsetLeft - first.offsetLeft : 0;
    };

    const wrap = () => {
      if (loopWidth > 0 && scroller.scrollLeft >= loopWidth) {
        scroller.scrollLeft -= loopWidth;
        pos = scroller.scrollLeft;
        lastWrite = pos;
      }
    };

    const pause = () => {
      pausedUntil = performance.now() + RESUME_DELAY_MS;
    };

    const tick = (now: number) => {
      const dt = lastFrame ? Math.min(now - lastFrame, 64) : 0;
      lastFrame = now;

      const running =
        !reducedMotion.matches &&
        visible &&
        !document.hidden &&
        !hovering &&
        !focused &&
        now >= pausedUntil &&
        loopWidth > 0;

      if (running) {
        if (!wasRunning) {
          // Pick up from wherever the user left the rail.
          pos = scroller.scrollLeft;
          resumedAt = now;
        }
        const ramp = Math.min((now - resumedAt) / RAMP_MS, 1);
        const eased = ramp * ramp * (3 - 2 * ramp); // smoothstep
        const speed = window.innerWidth < 640 ? SPEED_MOBILE : SPEED_DESKTOP;
        pos += (speed * eased * dt) / 1000;
        if (pos >= loopWidth) pos -= loopWidth;
        scroller.scrollLeft = pos;
        lastWrite = scroller.scrollLeft;
      }
      wasRunning = running;
      raf = requestAnimationFrame(tick);
    };

    // A scroll we did not cause (momentum after a swipe, keyboard, scrollbar)
    // counts as interaction and holds the rail still.
    const onScroll = () => {
      if (Math.abs(scroller.scrollLeft - lastWrite) > 2) pause();
      wrap();
    };

    // Mouse drag-to-scroll. Touch and pen keep the browser's native panning,
    // which already gives momentum and leaves vertical page scrolling alone.
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragging = false;
    let dragMoved = false;

    const onPointerDown = (e: PointerEvent) => {
      pause();
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartScroll = scroller.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      if (!dragMoved && Math.abs(dx) > DRAG_THRESHOLD) {
        dragMoved = true;
        scroller.setPointerCapture(e.pointerId);
        scroller.classList.add('is-dragging');
      }
      if (dragMoved) {
        scroller.scrollLeft = dragStartScroll - dx;
        // Keep the loop endless while dragging right-to-left.
        if (loopWidth > 0 && scroller.scrollLeft >= loopWidth) {
          scroller.scrollLeft -= loopWidth;
          dragStartScroll -= loopWidth;
        }
        pause();
      }
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (scroller.hasPointerCapture(e.pointerId)) scroller.releasePointerCapture(e.pointerId);
      scroller.classList.remove('is-dragging');
      pause();
    };
    // A drag that ends over a card must not also open that card.
    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    };
    const onDragStart = (e: DragEvent) => e.preventDefault(); // no native image/link ghost drag

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovering = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      hovering = false;
      pausedUntil = Math.max(pausedUntil, performance.now() + 400);
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!scroller.contains(e.relatedTarget as Node | null)) focused = false;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(scroller);

    const ro = new ResizeObserver(() => {
      measure();
      wrap();
    });
    ro.observe(track);

    measure();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('wheel', pause, { passive: true });
    scroller.addEventListener('touchstart', pause, { passive: true });
    scroller.addEventListener('pointerdown', onPointerDown);
    scroller.addEventListener('pointermove', onPointerMove);
    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);
    scroller.addEventListener('pointerenter', onEnter);
    scroller.addEventListener('pointerleave', onLeave);
    scroller.addEventListener('click', onClickCapture, true);
    scroller.addEventListener('dragstart', onDragStart);
    scroller.addEventListener('focusin', onFocusIn);
    scroller.addEventListener('focusout', onFocusOut);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('wheel', pause);
      scroller.removeEventListener('touchstart', pause);
      scroller.removeEventListener('pointerdown', onPointerDown);
      scroller.removeEventListener('pointermove', onPointerMove);
      scroller.removeEventListener('pointerup', endDrag);
      scroller.removeEventListener('pointercancel', endDrag);
      scroller.removeEventListener('pointerenter', onEnter);
      scroller.removeEventListener('pointerleave', onLeave);
      scroller.removeEventListener('click', onClickCapture, true);
      scroller.removeEventListener('dragstart', onDragStart);
      scroller.removeEventListener('focusin', onFocusIn);
      scroller.removeEventListener('focusout', onFocusOut);
    };
  }, [products.length]);

  if (products.length === 0) return null;

  const track = [...products, ...products];

  return (
    <div className="relative">
      {/* Soft edges so cards enter and leave rather than being cut off */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-10 bg-gradient-to-r from-spice-beige to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-10 bg-gradient-to-l from-spice-beige to-transparent" />

      <div
        ref={scrollerRef}
        className="marquee-scroller overflow-x-auto overflow-y-hidden scrollbar-none"
      >
        <div ref={trackRef} className="flex gap-5 sm:gap-8 w-max py-2">
          {track.map((product, idx) => (
            <Link
              key={`${product._id}-${idx}`}
              to={`/products/${product.slug}`}
              aria-hidden={idx >= products.length}
              tabIndex={idx >= products.length ? -1 : 0}
              draggable={false}
              className="group/card w-[210px] sm:w-[300px] lg:w-[360px] shrink-0 bg-white rounded-2xl border border-spice-brown/10 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-spice-cream flex items-center justify-center p-6 border-b border-spice-brown/5">
                <img
                  src={productImageUrl(product)}
                  onError={handleImageError}
                  alt={`${displayProductName(product.name)} pack`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 sm:p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-spice-red">
                  {typeof product.category === 'object'
                  ? categoryName(product.category.slug, product.category.name)
                  : 'Subhadarshini'}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-spice-brown mt-1 leading-tight line-clamp-2">
                  {displayProductName(productText.name(product, product.name))}
                </h3>
                <p className="text-xs text-spice-brown/70 mt-2 line-clamp-2 leading-relaxed">
                  {productText.shortDescription(product)}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-spice-red mt-4">
                  {t('action.viewDetails')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
