import React from 'react';
import { motion } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface MobilePrevPageCueProps {
  onBack: () => void;
  prevTitle?: string;
  isPulling?: boolean;
  pullProgress?: number;
  isConfirmed?: boolean;
}

export const MobilePrevPageCue: React.FC<MobilePrevPageCueProps> = ({
  onBack,
  prevTitle,
  isPulling = false,
  pullProgress = 0,
  isConfirmed = false,
}) => {
  return (
    <div className="w-full -mt-2 pb-2 flex items-center justify-center select-none block md:hidden">
      <button
        type="button"
        onClick={onBack}
        className="p-4 text-black/50 hover:text-black active:scale-90 transition-colors cursor-pointer outline-none flex items-center justify-center"
        aria-label={prevTitle ? `Back to ${prevTitle}` : 'Previous tab'}
        title={prevTitle ? `Back: ${prevTitle}` : 'Previous tab'}
      >
        <motion.div
          animate={
            isConfirmed
              ? {
                  y: [-8, -14, -10],
                  scale: [1.2, 1.45, 1.3],
                  opacity: 1,
                }
              : isPulling
              ? {
                  y: -pullProgress * 14,
                  scale: 1 + pullProgress * 0.35,
                  opacity: 0.5 + pullProgress * 0.5,
                }
              : {
                  y: [0, -7, 0],
                  scale: 1,
                  opacity: [0.4, 0.8, 0.4],
                }
          }
          transition={
            isConfirmed
              ? { duration: 0.35, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }
              : isPulling
              ? { duration: 0.1, ease: 'easeOut' }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
          className="flex items-center justify-center text-black"
        >
          <ChevronUp
            className={`w-7 h-7 stroke-[2.2] transition-colors duration-200 ${
              isConfirmed ? 'text-black' : isPulling ? 'text-black/85' : 'text-black/45'
            }`}
          />
        </motion.div>
      </button>
    </div>
  );
};
