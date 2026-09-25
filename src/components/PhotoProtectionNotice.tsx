import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

/**
 * Polished, non-intrusive notification badge displayed when an unauthorized
 * right-click, inspection, or save attempt is intercepted.
 */
export const PhotoProtectionNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const onAlert = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setVisible(false);
      }, 2400);
    };

    window.addEventListener('photo-protection-alert', onAlert);
    return () => {
      window.removeEventListener('photo-protection-alert', onAlert);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[100] pointer-events-none select-none"
        >
          <div className="bg-zinc-900/95 text-white backdrop-blur-xl px-4 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-2.5 text-[12px] font-sans font-medium tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Images Protected · &copy; Juztin Yuen</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
