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

  return (
    <div className="w-full flex flex-col items-center select-none pt-0">
      {/* HERO SECTION: Vertically centered in initial viewport, shifted down slightly more on mobile view */}
      <section className="w-full min-h-[calc(100vh-40px)] md:min-h-screen flex flex-col items-center justify-center relative">
        <div className="w-full flex justify-center translate-y-[36px] md:translate-y-0">
          <NametagHeroCard isPastHeroCards={isPastHeroCards} />
        </div>

        {/* SCROLL DOWN INDICATOR ARROW (Pure visual cue: non-clickable, fades out on scroll) */}
        <motion.div
          style={{ opacity: arrowOpacity }}
          className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 select-none"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center justify-center text-black/45"
          >
            <ChevronDown className="w-6 h-6 stroke-[1.75]" />
          </motion.div>
        </motion.div>
      </section>

      {/* PHOTO HIGHLIGHT CAROUSEL */}
      <section className="w-full max-w-[960px] mt-14 sm:mt-20 md:mt-28 mb-4 sm:mb-8 md:mb-12 flex flex-col items-center relative px-2 sm:px-4">
        {/* SECTION TITLE: Handwritten in same Schoolbell font as cards */}
        <h2 className="font-schoolbell text-[22px] sm:text-[28px] md:text-[32px] text-[#1a1a1a] tracking-normal mb-1.5 sm:mb-2 select-none text-center">
          My photography highlights!!!
        </h2>

        <div className="w-full flex items-start justify-center relative">
          <EdzHomeView
            photos={photos}
            className="w-full flex items-start justify-center relative select-none h-[250px] xs:h-[310px] sm:h-[420px] md:h-[580px]"
          />
        </div>
      </section>

      {/* LOCATION & BIO SUMMARY */}
      <section className="w-full max-w-[860px] text-center mt-5 sm:mt-8 md:mt-16 flex flex-col items-center">
        {/* BLUE NAMETAG CARD (Above the text that is below the images) */}
        <div className="w-[170px] xs:w-[195px] sm:w-[240px] aspect-[1.6/1] mb-5 sm:mb-7 select-none rotate-[-1.5deg]">
          <img
            src="/card-nametag-blue.png?v=4"
            alt="hello my name is JUZTIN!"
            className="w-full h-full object-contain pointer-events-none"
            loading="lazy"
          />
        </div>

        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#555555] font-sans">
          I am currently based in Singapore. Available for commercial assignments, ringside fight night coverage,
          motorsport events, and creative storytelling photography. Learn more about my journey in{' '}
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
