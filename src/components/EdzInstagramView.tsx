import React, { useState, useEffect } from 'react';
import { ExternalLink, Instagram, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface InstagramPost {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  aspectRatio: 'panorama' | 'portrait' | 'square';
  caption: string;
  tags: string[];
  url: string;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-muay-thai-panorama',
    title: 'Fight Night Ringside Panorama',
    subtitle: 'Singapore Muay Thai Association (SMTA)',
    image: '/photos/instagram-muay-thai-panorama.webp',
    aspectRatio: 'panorama',
    caption: 'High-tempo exchanges, defensive checks, and raw corner moments from the SMTA championship card.',
    tags: ['MuayThai', 'SMTA', 'Ringside', 'CombatSports', 'QuietFrames'],
    url: 'https://www.instagram.com/quietframes.sg/',
  },
  {
    id: 'ig-ncc-sea-highlights',
    title: 'Cadet Dragon Boat & Regatta Days',
    subtitle: 'National Cadet Corps (NCC Sea)',
    image: '/photos/instagram-ncc-sea-highlights.webp',
    aspectRatio: 'portrait',
    caption: 'On-the-water moments from the dragon boat regatta and sea training expeditions along Kallang.',
    tags: ['NCCSea', 'DragonBoat', 'Regatta', 'YouthLeadership', 'QuietFrames'],
    url: 'https://www.instagram.com/quietframes.sg/',
  },
  {
    id: 'ig-stp-sea-trainers',
    title: "10th Sea Trainers' Programme",
    subtitle: 'Kallang Sea Training Centre',
    image: '/photos/instagram-stp-trainers-programme.webp',
    aspectRatio: 'portrait',
    caption: 'Publicity poster designed for the 10th Sea Trainers Programme, highlighting cadet sea expeditions, seamanship, and leadership.',
    tags: ['STP', 'SeaTrainers', 'KallangSTC', 'PosterDesign', 'QuietFrames'],
    url: 'https://www.instagram.com/quietframes.sg/',
  },
];

export const EdzInstagramView: React.FC = () => {
  const [enlargedIndex, setEnlargedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Keyboard navigation for enlarged modal viewer
  useEffect(() => {
    if (enlargedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEnlargedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setEnlargedIndex((prev) =>
          prev !== null && prev < INSTAGRAM_POSTS.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setEnlargedIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : INSTAGRAM_POSTS.length - 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedIndex]);

  // Lock body scroll when enlarged modal is active
  useEffect(() => {
    if (enlargedIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [enlargedIndex]);

  // Touch swipe gestures for mobile modal
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || enlargedIndex === null) return;
    const touchEndX = e.changedTouches[0]?.clientX;
    if (touchEndX !== undefined) {
      const deltaX = touchEndX - touchStartX;
      if (deltaX > 45) {
        // Swiped right -> previous
        setEnlargedIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : INSTAGRAM_POSTS.length - 1
        );
      } else if (deltaX < -45) {
        // Swiped left -> next
        setEnlargedIndex((prev) =>
          prev !== null && prev < INSTAGRAM_POSTS.length - 1 ? prev + 1 : 0
        );
      }
    }
    setTouchStartX(null);
  };

  const instagramProfileUrl = 'https://www.instagram.com/quietframes.sg/';

  return (
    <div className="w-full max-w-[1200px] mx-auto text-[#666666] space-y-12">
      {/* Header with Instagram Profile Link */}
      <header className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="font-schoolbell text-[30px] sm:text-[36px] md:text-[40px] text-[#1a1a1a] tracking-normal select-none -mb-1">
            Instagram Posts
          </h1>
          <p className="text-xs text-[#888888] uppercase tracking-wider mt-1">
            Social Media Coverage, Posters & Highlights
          </p>
        </div>

        {/* Profile follow link badge */}
        <a
          href={instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          title="Visit @quietframes.sg on Instagram"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>@quietframes.sg</span>
          <ExternalLink className="w-3 h-3 text-white/70" />
        </a>
      </header>

      {/* 1. Full-Width Panoramic Post (Muay Thai Banner) */}
      {INSTAGRAM_POSTS[0] && (
        <article className="group space-y-3">
          <div
            onClick={() => setEnlargedIndex(0)}
            className="bg-[#f4f4f4] overflow-hidden relative cursor-pointer group/card transition-all duration-300 border border-gray-100"
          >
            <img
              src={INSTAGRAM_POSTS[0].image}
              alt={INSTAGRAM_POSTS[0].title}
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="w-full h-auto object-contain block group-hover/card:scale-[1.005] transition-transform duration-500 select-none pointer-events-none"
              style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
            />

            {/* Protective Shield Overlay */}
            <div
              className="photo-shield absolute inset-0 z-20 pointer-events-auto cursor-pointer"
              style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('photo-protection-alert'));
              }}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Hover Badge */}
            <div className="absolute bottom-3 left-3 pointer-events-none z-30">
              <span className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-white/95 text-black border border-black/10 px-3 py-1.5 text-[10px] tracking-wider uppercase font-semibold shadow-sm flex items-center gap-1.5 select-none">
                <Maximize2 className="w-3 h-3" />
                Click to Enlarge
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-black leading-snug">
                  <button
                    type="button"
                    onClick={() => setEnlargedIndex(0)}
                    className="hover:underline text-left cursor-pointer"
                  >
                    {INSTAGRAM_POSTS[0].title}
                  </button>
                </h3>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-[#888888] font-mono">
                  {INSTAGRAM_POSTS[0].subtitle}
                </span>
              </div>
              <p className="text-[13px] text-[#666666] leading-relaxed">
                {INSTAGRAM_POSTS[0].caption}
              </p>
            </div>

            <a
              href={INSTAGRAM_POSTS[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono uppercase tracking-wider text-[#888888] hover:text-black flex items-center gap-1 shrink-0"
            >
              <span>View on Instagram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </article>
      )}

      {/* 2. Side-by-Side 2-Column Grid for Vertical Posters & Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 pt-4">
        {INSTAGRAM_POSTS.slice(1).map((post, idx) => {
          const globalPostIndex = idx + 1;
          return (
            <article key={post.id} className="group space-y-3 flex flex-col">
              <div
                onClick={() => setEnlargedIndex(globalPostIndex)}
                className="bg-[#f4f4f4] overflow-hidden relative cursor-pointer group/card transition-all duration-300 border border-gray-100 aspect-[3/4] flex items-center justify-center"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover group-hover/card:scale-[1.02] transition-transform duration-500 select-none pointer-events-none"
                  style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                />

                {/* Protective Shield Overlay */}
                <div
                  className="photo-shield absolute inset-0 z-20 pointer-events-auto cursor-pointer"
                  style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('photo-protection-alert'));
                  }}
                  onDragStart={(e) => e.preventDefault()}
                />

                {/* Hover Badge */}
                <div className="absolute bottom-3 left-3 pointer-events-none z-30">
                  <span className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-white/95 text-black border border-black/10 px-3 py-1.5 text-[10px] tracking-wider uppercase font-semibold shadow-sm flex items-center gap-1.5 select-none">
                    <Maximize2 className="w-3 h-3" />
                    Click to Enlarge
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-black leading-snug">
                    <button
                      type="button"
                      onClick={() => setEnlargedIndex(globalPostIndex)}
                      className="hover:underline text-left cursor-pointer"
                    >
                      {post.title}
                    </button>
                  </h3>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono uppercase tracking-wider text-[#888888] hover:text-black flex items-center gap-1 shrink-0"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-[#888888] font-mono">
                  {post.subtitle}
                </p>

                <p className="text-[12.5px] text-[#666666] leading-relaxed pt-1">
                  {post.caption}
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono uppercase tracking-wider text-[#888888] bg-gray-100 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer Instagram Promotion Banner */}
      <footer className="pt-10 border-t border-gray-100">
        <div className="bg-[#f9f9f9] border border-gray-200 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-[15px] font-bold text-black">
              Follow along on Instagram
            </h3>
            <p className="text-[13px] text-[#666666]">
              Ringside fight sequences, cadet highlights, and behind-the-scenes photography over at @quietframes.sg.
            </p>
          </div>

          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>Open Profile</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </footer>

      {/* Enlarged Modal Viewer */}
      <AnimatePresence>
        {enlargedIndex !== null && INSTAGRAM_POSTS[enlargedIndex] && (
          <motion.div
            key="instagram-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl flex flex-col justify-between items-center p-4 sm:p-6 select-none"
            onClick={() => setEnlargedIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar: Close Button */}
            <div className="w-full flex justify-between items-center z-20 max-w-6xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-[#888888]">
                {INSTAGRAM_POSTS[enlargedIndex].title}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedIndex(null);
                }}
                className="p-2.5 rounded-full text-zinc-500 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
                aria-label="Close enlarged view"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Stage: Enlarged Image with Arrow Navigation */}
            <div
              className="relative flex-1 w-full flex items-center justify-center min-h-0 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative inline-flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={INSTAGRAM_POSTS[enlargedIndex].id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    src={INSTAGRAM_POSTS[enlargedIndex].image}
                    alt={INSTAGRAM_POSTS[enlargedIndex].title}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className="max-h-[80vh] max-w-[92vw] object-contain select-none shadow-xl border border-black/5 pointer-events-none"
                    style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                  />
                </AnimatePresence>

                {/* Subtle Copyright Watermark */}
                <div className="absolute bottom-3 right-4 pointer-events-none z-15 select-none opacity-65">
                  <div className="bg-black/45 backdrop-blur-[2px] px-2.5 py-1 rounded-[3px] text-[10px] font-mono tracking-widest text-white/95 border border-white/15 drop-shadow-md uppercase">
                    &copy; Juztin Yuen
                  </div>
                </div>

                {/* Protective Shield Overlay */}
                <div
                  className="photo-shield absolute inset-0 z-20 pointer-events-auto"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('photo-protection-alert'));
                  }}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                />
              </div>
            </div>

            {/* Bottom Bar: Post Details & Counter */}
            <div
              className="py-3 text-center z-20 flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs font-mono tracking-widest text-zinc-700 select-none px-4 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-200 shadow-sm">
                {enlargedIndex + 1} / {INSTAGRAM_POSTS.length}
              </span>
              <a
                href={INSTAGRAM_POSTS[enlargedIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-black underline flex items-center gap-1"
              >
                <span>Open in Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
