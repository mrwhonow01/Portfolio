import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface MobileNextPageCueProps {
  onAdvance: () => void;
  nextTitle?: string;
}

export const MobileNextPageCue: React.FC<MobileNextPageCueProps> = ({
  onAdvance,
  nextTitle,
}) => {
  return (
    <div className="w-full pt-36 pb-20 flex flex-col items-center justify-center select-none block md:hidden">
      <button
        type="button"
        onClick={onAdvance}
        className="group flex flex-col items-center justify-center p-3 text-black/45 hover:text-black/85 active:scale-95 transition-all cursor-pointer outline-none gap-1.5"
        aria-label={nextTitle ? `Go to ${nextTitle}` : 'Next page'}
        title={nextTitle ? `Next: ${nextTitle}` : 'Next page'}
      >
        {nextTitle && (
          <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-black/50 group-hover:text-black transition-colors">
            {nextTitle}
          </span>
        )}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center"
        >
          <ChevronDown className="w-5 h-5 stroke-[1.85]" />
        </motion.div>
      </button>
    </div>
  );
};
