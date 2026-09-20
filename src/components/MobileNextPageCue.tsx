import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface MobileNextPageCueProps {
  nextTitle: string;
  nextSubtitle: string;
  pageNumber: number;
  totalNumberedPages: number;
  onAdvance: () => void;
}

export const MobileNextPageCue: React.FC<MobileNextPageCueProps> = ({
  nextTitle,
  nextSubtitle,
  pageNumber,
  totalNumberedPages,
  onAdvance,
}) => {
  return (
    <aside
      aria-label={`Next section: ${nextTitle}`}
      className="w-full mt-16 mb-6 select-none block md:hidden"
    >
      {/* Decorative hairline divider */}
      <div className="w-full flex items-center gap-3 mb-6">
        <div className="h-[1px] bg-black/[0.08] flex-1" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
          End of Section
        </span>
        <div className="h-[1px] bg-black/[0.08] flex-1" />
      </div>

      {/* Interactive Next Page Advance Card */}
      <button
        type="button"
        onClick={onAdvance}
        className="w-full text-left bg-gradient-to-b from-[#fbf9f5] to-[#f4eee4] hover:from-[#f6f2ea] hover:to-[#ede5d6] active:scale-[0.985] transition-all duration-200 border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
      >
        {/* Subtle background texture shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          {/* Top metadata pill & step counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/[0.05] rounded-full text-[9.5px] font-mono uppercase tracking-widest text-zinc-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f1915]/60 animate-pulse" />
              Up Next · 0{pageNumber} / 0{totalNumberedPages}
            </span>

            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-black transition-colors flex items-center gap-1 font-semibold">
              Continue
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Large destination title */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[21px] font-black uppercase tracking-tight text-[#1a140f] font-sans leading-tight">
              {nextTitle}
            </h3>

            {/* Bouncing down arrow icon circle */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-10 h-10 rounded-full bg-white border border-black/10 shadow-xs flex items-center justify-center shrink-0 text-[#1a140f] group-hover:bg-[#1a140f] group-hover:text-white transition-colors"
            >
              <ArrowDown className="w-4 h-4 stroke-[2.2]" />
            </motion.div>
          </div>

          {/* Subtitle / explanation */}
          <p className="text-[12.5px] text-zinc-500 font-sans mt-1.5 leading-snug">
            {nextSubtitle}
          </p>

          {/* Bottom gesture prompt */}
          <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span>Scroll further down or tap</span>
            <span className="text-zinc-600 font-semibold group-hover:text-black transition-colors">
              Next Page →
            </span>
          </div>
        </div>
      </button>
    </aside>
  );
};
