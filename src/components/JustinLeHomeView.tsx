import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { NavView, AlbumCategory } from './EdzSidebar';
import { NametagHeroCard } from './NametagHeroCard';
import { EdzHomeView } from './EdzHomeView';
import { PhotoItem } from '../types';

interface JustinLeHomeViewProps {
  currentView: NavView;
  onNavigate: (view: NavView, album?: AlbumCategory, subAlbum?: string) => void;
  photos: PhotoItem[];
  isPastHeroCards?: boolean;
}

export const JustinLeHomeView: React.FC<JustinLeHomeViewProps> = ({
  onNavigate,
  photos,
  isPastHeroCards = false,
}) => {
  const { scrollY } = useScroll();
  // Fades out fast on initial scroll (fully invisible by 45px)
  const arrowOpacity = useTransform(scrollY, [0, 45], [1, 0]);
  const arrowPointerEvents = useTransform(scrollY, (v) => (v < 25 ? 'auto' : 'none'));

  return (
    <div className="w-full flex flex-col items-center select-none pt-0">
      {/* HERO SECTION: Vertically centered in initial viewport, shifted down slightly more on mobile view */}
      <section className="w-full min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-50px)] flex flex-col items-center justify-center relative">
        <div className="w-full flex justify-center translate-y-[36px] md:translate-y-0">
          <NametagHeroCard isPastHeroCards={isPastHeroCards} />
        </div>

        {/* SCROLL DOWN INDICATOR ARROW (Below cards, just above bottom of initial screen) */}
        <motion.div
          style={{ opacity: arrowOpacity, pointerEvents: arrowPointerEvents }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.85,
              behavior: 'smooth',
            });
          }}
          className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-30 select-none group"
          title="Scroll down"
          aria-label="Scroll to explore"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center justify-center text-black/45 group-hover:text-black transition-colors"
          >
            <ChevronDown className="w-6 h-6 stroke-[1.75]" />
          </motion.div>
        </motion.div>
      </section>

      {/* CLEAN MINIMAL DIVIDER LINE */}
      <div className="w-full max-w-[960px] h-px bg-black/[0.08] my-8 sm:my-10" />

      {/* PHOTO HIGHLIGHT CAROUSEL */}
      <section className="w-full max-w-[960px] my-4 sm:my-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-center">
          <EdzHomeView
            photos={photos}
            className="w-full flex items-center justify-center relative select-none"
            style={{ height: 'min(72vh, 600px)', minHeight: '360px' }}
          />
        </div>
      </section>

      {/* LOCATION & BIO SUMMARY */}
      <section className="w-full max-w-[860px] text-center mt-14 sm:mt-18">
        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#555555] font-sans">
          Currently based in Singapore. Available for commercial assignments, ringside fight night coverage,
          motorsport events, architectural documentation, and creative storytelling productions. Learn more about my journey in{' '}
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-black font-bold underline decoration-black/30 hover:decoration-black transition-colors cursor-pointer"
          >
            about me
          </button>{' '}
          or explore the photo collections{' '}
          <button
            type="button"
            onClick={() => onNavigate('photography')}
            className="text-black font-bold underline decoration-black/30 hover:decoration-black transition-colors cursor-pointer"
          >
            here
          </button>
          .
        </p>

        {/* ORGANIZATIONS & CLIENTS SHOWCASE WITH ACTUAL OFFICIAL LOGOS */}
        <div className="mt-14 pt-10 border-t border-black/[0.08]">
          <p className="text-xs uppercase tracking-widest text-[#777777] font-mono font-bold mb-8">
            Organizations & Events I Have Documented:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 items-center justify-items-center">
            {/* 1. Singapore Muay Thai Association (SMTA) */}
            <div
              onClick={() => onNavigate('album', 'sports', 'muay-thai')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer w-full max-w-[190px] h-[130px]"
              title="Singapore Muay Thai Association (SMTA)"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-smta.webp"
                  alt="Singapore Muay Thai Association (SMTA) Logo"
                  className="max-h-16 max-w-[85px] object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black mt-2 text-center font-sans">
                SMTA Singapore
              </span>
            </div>

            {/* 2. Mercedes-AMG PETRONAS Formula One Team */}
            <div
              onClick={() => onNavigate('album', 'sports', 'formula-1')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer w-full max-w-[190px] h-[130px]"
              title="Mercedes-AMG PETRONAS Formula One Team"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-mercedes-f1.svg"
                  alt="Mercedes-AMG PETRONAS Formula 1 Logo"
                  className="max-h-14 max-w-[110px] object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black mt-2 text-center font-sans">
                Mercedes-AMG F1
              </span>
            </div>

            {/* 3. National Cadet Corps (NCC Sea) */}
            <div
              onClick={() => onNavigate('instagram')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer w-full max-w-[190px] h-[130px]"
              title="National Cadet Corps (NCC Sea)"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-ncc.png"
                  alt="National Cadet Corps (Singapore) Official Crest"
                  className="max-h-16 max-w-[85px] object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black mt-2 text-center font-sans">
                NCC Sea
              </span>
            </div>

            {/* 4. Bushido Fight Academy */}
            <div
              onClick={() => onNavigate('album', 'sports', 'muay-thai')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer w-full max-w-[190px] h-[130px]"
              title="Bushido Fight Academy Singapore"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-bushido.png"
                  alt="Bushido Fight Academy Singapore Logo"
                  className="max-h-14 max-w-[105px] object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black mt-2 text-center font-sans">
                Bushido Fight Academy
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* MINIMAL STATIC FOOTER */}
      <footer className="w-full max-w-[860px] border-t border-black/[0.08] mt-16 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="font-bold text-black">Juztin Yuen</span>
            <span className="text-zinc-300">•</span>
            <a
              href="mailto:mrwhonow01@gmail.com"
              className="text-black hover:underline font-medium"
            >
              mrwhonow01@gmail.com
            </a>
            <span className="text-zinc-300">•</span>
            <span>Singapore</span>
          </div>
          <div className="flex items-center gap-5 text-zinc-600">
            <a
              href="https://www.instagram.com/quietframes.sg/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@MrWhoNow"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              YouTube
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
