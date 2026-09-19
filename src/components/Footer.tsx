import React from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioProfile } from '../types';

interface FooterProps {
  profile: PortfolioProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="portfolio-footer" className="pt-24 pb-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] select-none">
      {/* Graphic Thank You Banner with subtle entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 sm:py-20 text-center relative overflow-hidden flex flex-col items-center justify-center"
      >
        <div className="relative inline-block w-full max-w-4xl mx-auto">
          <h2
            className="text-[14vw] sm:text-[12vw] md:text-[8.5rem] lg:text-[10.5rem] font-black tracking-tighter leading-none text-[#f5f5f7] select-none uppercase opacity-95"
            style={{ letterSpacing: '-0.06em' }}
          >
            thank you
          </h2>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="font-signature text-[14vw] sm:text-[12vw] md:text-[6.5rem] lg:text-[7.5rem] text-[#ef4444] font-bold tracking-normal transform drop-shadow-[0_4px_24px_rgba(239,68,68,0.35)] select-none translate-y-1 sm:translate-y-2"
              style={{ lineHeight: 0.9 }}
            >
              {profile.signatureText || 'Juztin Yuen'}
            </span>
          </motion.div>
        </div>

        <p className="text-xs sm:text-sm text-[#86868b] mt-8 max-w-md mx-auto leading-relaxed">
          Thank you for viewing my visual body of work. Available for freelance event, sports, and production bookings worldwide.
        </p>
      </motion.div>

      {/* Bottom Minimalist Bar */}
      <div className="pt-8 mt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717a]">
        <div className="flex items-center gap-2">
          <span>© 2026 {profile.name}. All visual rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#86868b]">Singapore</span>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs text-[#a1a1a6] hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

