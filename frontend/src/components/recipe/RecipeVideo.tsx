import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../../config/images';

interface RecipeVideoProps {
  /** YouTube, Vimeo or a direct file URL. */
  url: string;
  /** Poster frame; falls back to the recipe photo. */
  poster?: string;
  title: string;
}

const youTubeId = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};

const vimeoId = (url: string): string | null => {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
};

/**
 * Click-to-play recipe video.
 *
 * Nothing third-party loads until the viewer actually presses play, so the page
 * stays fast and no embed cookies are set on arrival. Falls back to a plain
 * link for anything that is not a recognised embed or a direct video file.
 */
export const RecipeVideo: React.FC<RecipeVideoProps> = ({ url, poster, title }) => {
  const [playing, setPlaying] = useState(false);

  const yt = youTubeId(url);
  const vm = vimeoId(url);
  const isFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
  const embeddable = Boolean(yt || vm || isFile);

  const posterSrc = poster
    ? resolveImageUrl(poster)
    : yt
    ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`
    : undefined;

  if (!playing) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-spice-dark border border-spice-brown/10">
        {posterSrc && (
          <img
            src={posterSrc}
            onError={handleImageError}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}

        {embeddable ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <span className="w-16 h-16 rounded-full bg-spice-red text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Play className="w-6 h-6 translate-x-0.5 fill-current" />
            </span>
          </button>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="px-5 py-2.5 rounded-full bg-spice-red text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Watch the video
            </span>
          </a>
        )}

        <span className="absolute bottom-3 left-4 text-[11px] font-bold uppercase tracking-wider text-spice-cream">
          Cooking video
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-spice-dark border border-spice-brown/10">
      {isFile ? (
        <video src={url} controls autoPlay playsInline className="w-full h-full object-cover">
          <track kind="captions" />
        </video>
      ) : (
        <iframe
          src={
            yt
              ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`
              : `https://player.vimeo.com/video/${vm}?autoplay=1`
          }
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
};
