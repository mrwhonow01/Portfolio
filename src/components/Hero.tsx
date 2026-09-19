import React from 'react';
import { ArrowDown, ArrowRight, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioProfile } from '../types';

interface HeroProps {
  profile: PortfolioProfile;
  onOpenStudio: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenStudio }) => {
  return (
    <section
      id="hero-section"
      className="relative min-h-[96vh] flex flex-col justify-between pt-36 sm:pt-40 pb-16 sm:pb-20 px-6 sm:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Subtle Apple-style radial illumination with pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[32rem] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.06] via-transparent to-transparent pointer-events-none"
      />

      {/* Top Meta Line: matching Slide 1 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs text-[#86868b] tracking-wider uppercase"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="font-semibold text-[#c7c7cc]">Publicity Portfolio</span>
          <span className="text-white/20">/</span>
          <span className="text-[#86868b]">Singapore</span>
        </div>
        <div className="flex items-center gap-2 text-[#a1a1a6]">
          <span className="font-mono text-[11px]">2026 EDITION</span>
          <ArrowRight className="w-3.5 h-3.5 text-red-400" />
        </div>
      </motion.div>

      {/* Centerpiece: Massive 'portfolio' with cursive signature 'Juztin Yuen' */}
      <div className="my-auto py-16 sm:py-20 text-center relative flex flex-col items-center justify-center">
        <div className="relative inline-block w-full max-w-5xl mx-auto">
          {/* Main Display Typography with reveal */}
          <motion.h1
            id="hero-main-title"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 0.96, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[17vw] sm:text-[15vw] md:text-[13rem] lg:text-[15.5rem] font-black tracking-tighter leading-none text-[#f5f5f7] select-none uppercase"
            style={{ letterSpacing: '-0.06em' }}
          >
            portfolio
          </motion.h1>

          {/* Signature Overlay in Vibrant Red (Faithful to Slide 1) */}
          <motion.div
            id="hero-signature-overlay"
            initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 0.9, delay: 0.35, type: 'spring', stiffness: 120, damping: 14 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="font-signature text-[17vw] sm:text-[15vw] md:text-[9rem] lg:text-[11rem] text-[#ef4444] font-bold tracking-normal drop-shadow-[0_8px_24px_rgba(239,68,68,0.35)] select-none translate-y-1 sm:translate-y-3"
              style={{ lineHeight: 0.9 }}
            >
              {profile.signatureText || 'Juztin Yuen'}
            </span>
          </motion.div>
        </div>

        {/* Apple-style Sub-headline with generous spacing */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 sm:mt-12 text-base sm:text-lg md:text-xl text-[#a1a1a6] max-w-2xl mx-auto font-normal tracking-tight px-6 leading-relaxed"
        >
          {profile.headline}
        </motion.p>

        {/* CTA Actions with spring micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
        >
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            href="#gallery"
            id="hero-explore-btn"
            className="px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold tracking-tight hover:bg-[#ececf0] transition-colors shadow-xl shadow-white/10 flex items-center gap-2.5"
          >
            <span>Explore High-Res Gallery</span>
            <ArrowDown className="w-4 h-4" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            href="#timeline"
            id="hero-timeline-btn"
            className="px-7 py-3.5 rounded-full bg-white/[0.05] text-[#f5f5f7] border border-white/10 text-sm font-medium tracking-tight hover:bg-white/[0.1] hover:border-white/20 transition-all flex items-center gap-2"
          >
            <span>View Timeline & Story</span>
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenStudio}
            id="hero-quick-edit-btn"
            className="px-5 py-3.5 rounded-full bg-white/[0.03] text-[#86868b] hover:text-[#f5f5f7] border border-white/[0.06] hover:border-white/15 text-sm font-medium transition-all flex items-center gap-2"
            title="Curator Studio: Add photo or edit information"
          >
            <Sliders className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Curator Studio</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Focus Badges (Cleaner, airy design that doesn't crowd) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="max-w-6xl w-full mx-auto pt-8 border-t border-white/[0.05] flex flex-wrap items-center justify-center sm:justify-between gap-6 text-xs text-[#86868b]"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
          <span className="text-[#d1d1d6] font-medium">High-Speed Action:</span>
          <span>Sports, Futsal & F1</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
          <span className="text-[#d1d1d6] font-medium">Stage & Arts:</span>
          <span>Theatrical Martial Arts & Symphony</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
          <span className="text-[#d1d1d6] font-medium">District Publicity:</span>
          <span>200+ Cadet Campaigns</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
          <span className="text-[#d1d1d6] font-medium">Cinematic 4K:</span>
          <span>Mobile Videography</span>
        </div>
      </motion.div>
    </section>
  );
};

