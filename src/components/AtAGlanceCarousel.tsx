'use client';

import { useState, useRef } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import OptimizedImage from './OptimizedImage';

interface AtAGlanceCarouselProps {
  infographic?: string;
  youtubeVideoId?: string;
  personaTitle: string;
}

type Slide =
  | { type: 'infographic'; src: string }
  | { type: 'video'; videoId: string };

export default function AtAGlanceCarousel({
  infographic,
  youtubeVideoId,
  personaTitle,
}: AtAGlanceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const slides: Slide[] = [];
  if (infographic) slides.push({ type: 'infographic', src: infographic });
  if (youtubeVideoId) slides.push({ type: 'video', videoId: youtubeVideoId });

  if (slides.length === 0) return null;

  // Single item — no carousel chrome needed
  if (slides.length === 1) {
    const slide = slides[0];
    return (
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
        {slide.type === 'infographic' ? (
          <>
            <OptimizedImage
              src={slide.src}
              alt={`${personaTitle} – infographic`}
              width={900}
              height={600}
              className="w-full h-auto object-contain"
            />
            <p className="py-3 text-sm text-gray-500 italic">
              Overview infographic for {personaTitle}
            </p>
          </>
        ) : (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${slide.videoId}?rel=0&modestbranding=1`}
              title={`${personaTitle} – overview video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    );
  }

  // Multi-item carousel with peek + thumbnail strip
  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    // Calculate slide width based on scroll position
    // For mobile (88% viewport), for desktop (92% viewport)
    const containerWidth = trackRef.current.clientWidth;
    const slideWidth = containerWidth * 0.88; // Mobile default
    const gapPx = 12;
    const idx = Math.round(scrollLeft / (slideWidth + gapPx));
    setActiveIndex(Math.min(idx, slides.length - 1));
  };

  const handleThumbnailClick = (idx: number) => {
    if (!trackRef.current) return;
    const containerWidth = trackRef.current.clientWidth;
    const slideWidth = containerWidth * 0.88;
    const gapPx = 12;
    trackRef.current.scrollTo({
      left: idx * (slideWidth + gapPx),
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      {/* Slides container with native scroll + snap */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-scroll snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden rounded-2xl border border-gray-200 shadow-md bg-white"
        style={{ scrollbarWidth: 'none' }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="snap-start flex-shrink-0 w-[88%] sm:w-[92%] first:pl-0"
          >
            {slide.type === 'infographic' ? (
              <OptimizedImage
                src={slide.src}
                alt={`${personaTitle} – infographic`}
                width={900}
                height={600}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${slide.videoId}?rel=0&modestbranding=1`}
                  title={`${personaTitle} – overview video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`flex-1 relative h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex flex-col group ${
              idx === activeIndex
                ? 'border-primary scale-105 shadow-md'
                : 'border-gray-200 opacity-60 hover:opacity-90'
            }`}
            aria-label={`View ${slide.type === 'infographic' ? 'infographic' : 'video'} slide`}
          >
            {/* Thumbnail image */}
            {slide.type === 'infographic' ? (
              <img
                src={slide.src}
                alt={`${personaTitle} infographic thumbnail`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={`https://img.youtube.com/vi/${slide.videoId}/mqdefault.jpg`}
                  alt={`${personaTitle} video thumbnail`}
                  className="w-full h-full object-cover"
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <PlayIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </>
            )}

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs sm:text-sm font-medium px-1 py-0.5 text-center truncate">
              {slide.type === 'infographic' ? 'Infographic' : 'Video'}
            </div>
          </button>
        ))}
      </div>

      {/* Slide label */}
      <p className="mt-3 text-sm text-gray-500 italic text-center">
        {slides[activeIndex].type === 'infographic'
          ? `Overview infographic for ${personaTitle}`
          : `Overview video for ${personaTitle}`}
      </p>
    </div>
  );
}
