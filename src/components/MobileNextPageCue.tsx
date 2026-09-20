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
    <div className="w-full py-10 flex flex-col items-center justify-center select-none block md:hidden">
      <button
        type="button"
        onClick={onAdvance}
        className="flex items-center justify-center p-3 text-black/40 hover:text-black/80 active:scale-90 transition-all cursor-pointer outline-none"
        aria-label={nextTitle ? `Go to next page: ${nextTitle}` : 'Next page'}
        title={nextTitle ? `Next: ${nextTitle}` : 'Next page'}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center"
        >
          <ChevronDown className="w-6 h-6 stroke-[1.75]" />
        </motion.div>
      </button>
    </div>
  );
};
