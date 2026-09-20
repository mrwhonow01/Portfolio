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
        className="flex items-center justify-center p-3 text-black/35 hover:text-black/80 active:scale-90 transition-all cursor-pointer outline-none"
        aria-label={prevTitle ? `Back to: ${prevTitle}` : 'Previous page'}
        title={prevTitle ? `Back: ${prevTitle}` : 'Previous page'}
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center"
        >
          <ChevronUp className="w-6 h-6 stroke-[1.75]" />
        </motion.div>
      </button>
    </div>
  );
};
