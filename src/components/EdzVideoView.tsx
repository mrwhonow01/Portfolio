import React, { useState, useEffect } from 'react';
import { Play, Film, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoItem } from '../types';

interface EdzVideoViewProps {
  videos: VideoItem[];
}

export const EdzVideoView: React.FC<EdzVideoViewProps> = ({ videos }) => {
  const [activeVideoModal, setActiveVideoModal] = useState<VideoItem | null>(null);
  const [inlinePlayingId, setInlinePlayingId] = useState<string | null>(null);

  // Lock scroll and handle Escape key when theater modal is open
  useEffect(() => {
    if (!activeVideoModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideoModal(null);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideoModal]);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <header className="mb-8 pb-3 border-b border-gray-100">
        <h1 className="font-schoolbell text-[30px] sm:text-[36px] md:text-[40px] text-[#1a1a1a] tracking-normal select-none mb-3 sm:mb-4 pb-1 leading-snug">
          Videography
        </h1>
        <p className="text-xs text-[#888888] uppercase tracking-wider mt-1.5 sm:mt-2">
          Travel & Video Work
        </p>
      </header>

      <div className="space-y-16">
        {videos.map((video) => {
          const videoId = video.youtubeId || 'ax7x51OqE1M';
          const isInlinePlaying = inlinePlayingId === video.id;

          return (
            <article key={video.id} className="group video_article">
              {/* Video preview / inline player */}
              <div className="bg-black aspect-video relative overflow-hidden border border-gray-200">
                {isInlinePlaying ? (
                  <iframe
                    title={video.title}
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&vq=hd2160&hd=1&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => setInlinePlayingId(video.id)}
                    className="w-full h-full relative cursor-pointer group/thumb"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      className="w-full h-full object-cover group-hover/thumb:scale-[1.01] transition-transform duration-500 opacity-95 select-none pointer-events-none"
                      style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                    />
                    {/* Protective Shield Overlay */}
                    <div
                      className="photo-shield absolute inset-0 z-10 pointer-events-auto"
                      style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('photo-protection-alert'));
                      }}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Minimalist Play Button */}
                    <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/35 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:bg-black/75 group-hover/thumb:border-white/60 shadow-xl">
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom metadata tags */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-black/75 backdrop-blur-sm px-3 py-1.5 font-mono">
                      <span>{video.tagline}</span>
                      <span>{video.duration} · {video.resolution}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video details */}
              <figcaption className="mt-4 max-w-3xl">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="text-[16px] font-bold text-black">
                    <button
                      type="button"
                      onClick={() => setInlinePlayingId(video.id)}
                      className="hover:underline text-left cursor-pointer"
                    >
                      {video.title}
                    </button>
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(video)}
                      className="text-[11px] uppercase tracking-wider text-[#666666] hover:text-black cursor-pointer font-medium"
                    >
                      Theater Mode
                    </button>
                    <span className="text-gray-300">·</span>
                    <a
                      href={`https://youtu.be/${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-[#888888] hover:text-black flex items-center gap-1"
                    >
                      Watch on YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-[#aaaaaa] mt-1 uppercase tracking-wider font-mono">
                  {video.device} · {video.channel}
                </p>
                <p className="text-[13px] text-[#666666] leading-relaxed mt-2.5">
                  {video.description}
                </p>
              </figcaption>
            </article>
          );
        })}
      </div>

      {/* Video Modal Player (Theater Mode) */}
      <AnimatePresence>
        {activeVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveVideoModal(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-black overflow-hidden shadow-2xl border border-white/10 cursor-default"
            >
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="absolute top-3 right-3 z-20 p-2 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 cursor-pointer rounded-full"
                aria-label="Close video (Esc)"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <iframe
                  title={activeVideoModal.title}
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId || 'ax7x51OqE1M'}?autoplay=1&rel=0&vq=hd2160&hd=1&playsinline=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5 bg-zinc-950 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">{activeVideoModal.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">{activeVideoModal.description}</p>
                </div>
                <a
                  href={`https://youtu.be/${activeVideoModal.youtubeId || 'ax7x51OqE1M'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 hover:border-zinc-500 whitespace-nowrap ml-4"
                >
                  YouTube <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
