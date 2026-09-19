import React, { useState } from 'react';
import { Play, Film, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoItem } from '../types';

interface VideographyProps {
  videos: VideoItem[];
}

export const VideographySection: React.FC<VideographyProps> = ({ videos }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const video = videos[0];

  if (!video) return null;

  return (
    <section id="videography" className="py-28 lg:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header with motion */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 pb-8 border-b border-white/[0.06] gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
            <Film className="w-4 h-4" />
            <span>Motion & Motion Picture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f5f5f7]">
            Videography Highlights
          </h2>
          <p className="text-[#86868b] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Cinematic narrative vlogs and documentary reels shot on mobile flagships and mirrorless rigs.
          </p>
        </div>

        <motion.a
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.96 }}
          href="https://youtube.com/@MrWhoNow"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-colors self-start sm:self-auto shadow-sm"
        >
          <span>Watch on YouTube (@MrWhoNow)</span>
          <ExternalLink className="w-3.5 h-3.5 text-red-400" />
        </motion.a>
      </motion.div>

      {/* Cinematic Showcase Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl overflow-hidden bg-[#0e0e11] border border-white/[0.08] shadow-2xl relative"
      >
        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden group">
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              <motion.div
                key="thumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />

                {/* Minimalist Glass Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsPlaying(true)}
                    className="w-14 h-14 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center shadow-xl pointer-events-auto backdrop-blur-md border border-white/30 transition-all cursor-pointer"
                    aria-label="Play cinematic preview"
                  >
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </motion.button>
                </div>

                {/* On-screen cinematic badge overlay */}
                <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    WN
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight drop-shadow-md">
                      {video.title}
                    </h4>
                    <span className="text-xs text-white/80 drop-shadow-md">
                      {video.channel} · {video.device}
                    </span>
                  </div>
                </div>

                {/* Bottom Specs Bar */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono border border-white/10">
                      {video.resolution}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono border border-white/10">
                      ProRes Log
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white/80 font-mono border border-white/10">
                      {video.duration}
                    </span>
                  </div>

                  <div className="text-white/90 font-medium hidden sm:flex items-center gap-2 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Color Graded in DaVinci Resolve</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full bg-black flex flex-col justify-between"
              >
                <div className="relative w-full h-full">
                  <iframe
                    title={video.title}
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId || 'ax7x51OqE1M'}?autoplay=1&rel=0&vq=hd2160&hd=1&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-colors shadow-lg cursor-pointer"
                  >
                    Close Video
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Notes */}
        <div className="p-8 sm:p-10 bg-[#0c0c0e] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{video.tagline}</h4>
            <p className="text-xs sm:text-sm text-[#86868b] mt-1.5 leading-relaxed">{video.description}</p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <span className="text-xs text-[#86868b] font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              {video.device}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

