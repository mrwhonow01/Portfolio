import React from 'react';
import { motion } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface MobilePrevPageCueProps {
  onBack: () => void;
  prevTitle?: string;
}

export const MobilePrevPageCue: React.FC<MobilePrevPageCueProps> = ({
  onBack,
  prevTitle,
}) => {
  return (
    <div className="w-full -mt-2 pb-6 flex flex-col items-center justify-center select-none block md:hidden">
      <button
        type="button"
        onClick={onBack}
        className="group flex flex-col items-center justify-center p-3 text-black/45 hover:text-black/85 active:scale-95 transition-all cursor-pointer outline-none gap-1.5"
        aria-label={prevTitle ? `Back to ${prevTitle}` : 'Previous page'}
        title={prevTitle ? `Back: ${prevTitle}` : 'Previous page'}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center"
        >
          <ChevronUp className="w-5 h-5 stroke-[1.85]" />
        </motion.div>
        {prevTitle && (
          <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-black/50 group-hover:text-black transition-colors">
            {prevTitle}
          </span>
        )}
      </button>
    </div>
  );
};
