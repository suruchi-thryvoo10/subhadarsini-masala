import React, { useEffect, useRef, useState } from 'react';
import { resolveImageUrl, handleImageError } from '../../config/images';
import { RecipeVideo } from './RecipeVideo';

interface Props {
  image: string;
  title: string;
  /** The dish's own method — each line becomes one caption. */
  steps: string[];
  category?: string;
  /** A real cooking video, when one exists, takes the place of all of this. */
  videoUrl?: string;
  videoThumbnail?: string;
  className?: string;
}

/** How long each step stays on screen. */
const STEP_MS = 4200;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Gives a recipe card motion without inventing anything: the dish's own
 * photograph drifts slowly while that dish's own numbered steps cross-fade
 * across it.
 *
 * This is not footage of the dish being cooked. When a genuine cooking video
 * exists for the recipe, `videoUrl` is set and the real video is shown instead.
 */
export const RecipeMotion: React.FC<Props> = ({
  image,
  title,
  steps,
  category,
  videoUrl,
  videoThumbnail,
  className = ''
}) => {
  const usable = steps.map((s) => s.trim()).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (videoUrl || paused || reduced.current || usable.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % usable.length),
      STEP_MS
    );
    return () => window.clearInterval(id);
  }, [videoUrl, paused, usable.length]);

  if (videoUrl) {
    return (
      <div className={`relative aspect-video overflow-hidden ${className}`}>
        <RecipeVideo url={videoUrl} poster={videoThumbnail || image} title={title} />
      </div>
    );
  }

  const step = usable[index];

  return (
    <div
      className={`recipe-motion relative aspect-video overflow-hidden bg-spice-brown ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <img
        src={resolveImageUrl(image)}
        onError={handleImageError}
        alt={title}
        loading="lazy"
        decoding="async"
        className="recipe-motion-img w-full h-full object-cover"
      />

      {category && (
        <span className="absolute top-3 left-3 z-20 bg-spice-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          {category}
        </span>
      )}

      {step && (
        <>
          {/* Scrim only behind the caption, so the dish stays visible. */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-spice-dark via-spice-dark/70 to-transparent pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5" aria-hidden="true">
            {usable.length > 1 && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-spice-turmeric tabular-nums">
                  {index + 1}/{usable.length}
                </span>
                <span
                  className="flex-1 h-0.5 bg-white/25 rounded-full overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full bg-spice-turmeric transition-[width] duration-500"
                    style={{ width: `${((index + 1) / usable.length) * 100}%` }}
                  />
                </span>
              </div>
            )}

            {/* Keyed so React remounts it and the fade-in runs per step. */}
            <p
              key={index}
              className="recipe-motion-step text-xs sm:text-sm text-spice-cream leading-relaxed line-clamp-2"
            >
              {step}
            </p>
          </div>
        </>
      )}

      {/* The rotating caption is decoration over a card that already lists
          every step below it, so it is hidden from assistive technology
          rather than announced repeatedly. */}
      <span className="sr-only">{title}</span>
    </div>
  );
};
