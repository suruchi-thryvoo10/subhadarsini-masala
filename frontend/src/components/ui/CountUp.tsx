import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  /** Rendered before the number, e.g. "₹". */
  prefix?: string;
  /** Rendered after the number, e.g. "%" or "+". */
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

/**
 * Counts from zero up to `to` the first time it scrolls into view.
 *
 * Driven by requestAnimationFrame rather than a state-per-tick interval, and
 * skipped entirely when the viewer prefers reduced motion.
 */
export const CountUp: React.FC<CountUpProps> = ({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 1400,
  className
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);
  const [forced, setForced] = useState(false);

  // IntersectionObserver does not report while the page is not being painted
  // (a background tab), which would leave the figure reading zero. Fall back to
  // a geometry check so the real number is always shown.
  useEffect(() => {
    if (inView || forced) return;

    const timer = window.setTimeout(() => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) setForced(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [inView, forced]);

  useEffect(() => {
    if (!inView && !forced) return;

    // requestAnimationFrame is suspended while the tab is in the background, so
    // an animation started there would leave the number frozen at zero. Show the
    // real figure instead — it is the number that matters, not the count.
    if (reduceMotion || document.hidden) {
      setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // easeOutCubic — fast at first, settles gently on the final number.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        setValue(to);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [inView, forced, reduceMotion, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
