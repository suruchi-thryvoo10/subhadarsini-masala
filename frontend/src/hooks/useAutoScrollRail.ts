import { useEffect, useRef } from 'react';

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
 * Turns a horizontal scroll container into an endless, slowly self-scrolling
 * rail that people can still swipe, trackpad-scroll or mouse-drag.
 *
 * Expects the track to render its set of `itemCount` items twice. Once the
 * scroll position passes the start of the second copy it is wound back by
 * exactly one copy's width, which looks identical, so the loop never runs out
 * in either the auto or manual case.
 *
 * Auto-scroll pauses while the mouse is over the rail or an item has keyboard
 * focus, and for a moment after any touch, drag or wheel, then eases back up
 * to speed. It stays off entirely for reduced-motion users, and idles while
 * the rail is off screen or the tab is hidden.
 *
 * Pair the scroller with the `rail-scroller` class (index.css).
 */
export const useAutoScrollRail = (itemCount: number) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track || itemCount === 0) return;

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
      const mirror = track.children[itemCount] as HTMLElement | undefined;
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
  }, [itemCount]);

  return { scrollerRef, trackRef };
};
