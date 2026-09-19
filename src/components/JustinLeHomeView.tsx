import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera, Film, Mail } from 'lucide-react';
import { NavView, AlbumCategory } from './EdzSidebar';
import { TopNavbar } from './TopNavbar';
import { NametagHeroCard } from './NametagHeroCard';

interface JustinLeHomeViewProps {
  currentView: NavView;
  onNavigate: (view: NavView, album?: AlbumCategory, subAlbum?: string) => void;
}

export const JustinLeHomeView: React.FC<JustinLeHomeViewProps> = ({
  currentView,
  onNavigate,
}) => {
  // Skills / Disciplines pill tags matching justinle.xyz style
  const skills = [
    { label: 'Combat Sports Photography', album: 'sports', subAlbum: 'muay-thai' },
    { label: 'Motorsport Photography', album: 'sports', subAlbum: 'formula-1' },
    { label: 'Stage & Performance', album: 'stage' },
    { label: 'Cadet Expeditions', album: 'events' },
    { label: 'Videography & 4K', view: 'videography' },
    { label: 'DaVinci Color Grading', view: 'videography' },
    { label: 'Publicity & Poster Design', view: 'instagram' },
    { label: 'High-Speed Action Capture', album: 'sports' },
  ];

  return (
    <div className="relative min-h-screen bg-[#faf9f5] text-[#111111] selection:bg-[#89c1e9]/40 flex flex-col justify-between overflow-x-hidden">
      {/* Top Sticky Navigation Bar */}
      <TopNavbar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-[1020px] w-full mx-auto px-6 sm:px-10 pt-6 sm:pt-12 pb-16 flex flex-col items-center">
        {/* HERO SECTION: Scroll-Driven Two-Card Slide-Out Interaction */}
        <section className="w-full flex flex-col items-center justify-center my-4 sm:my-8">
          <NametagHeroCard />
        </section>

        {/* CLEAN MINIMAL DIVIDER LINE (Replacing stars per user request) */}
        <div className="w-full max-w-[820px] h-px bg-black/10 my-8 sm:my-10" />

        {/* "WHO I AM" & "WHAT I DO" SECTION */}
        <section className="w-full max-w-[820px] mt-4 sm:mt-6 space-y-12 sm:space-y-16">
          {/* Row 1: Who I Am */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
            <div className="md:col-span-3">
              <h2 className="text-[17px] sm:text-[19px] font-bold text-black font-sans lowercase tracking-tight">
                who i am
              </h2>
            </div>
            <div className="md:col-span-9">
              <p className="text-[15px] sm:text-[16px] leading-[1.65] text-[#222222] font-sans">
                Hi there! I'm Juztin, a photographer and filmmaker based in Singapore capturing
                raw speed, human grit, and live moments. Most weekends, you'll find me ringside covering
                championship fight nights for the Singapore Muay Thai Association, trackside at motorsport
                events, or documenting national cadet expeditions and stage showcases. My work is focused on
                real, unfiltered energy—freezing split-second action at 1/1000s without getting in the way of it.
              </p>
            </div>
          </div>

          {/* Row 2: What I Do */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
            <div className="md:col-span-3">
              <h2 className="text-[17px] sm:text-[19px] font-bold text-black font-sans lowercase tracking-tight">
                what i do
              </h2>
            </div>
            <div className="md:col-span-9">
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {skills.map((skill, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (skill.view) {
                        onNavigate(skill.view as NavView);
                      } else if (skill.album) {
                        onNavigate('album', skill.album as AlbumCategory, skill.subAlbum);
                      }
                    }}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full border-2 border-[#89c1e9] bg-white/90 text-[#4a90e2] hover:text-[#2b7fc3] hover:border-[#4a90e2] hover:bg-[#89c1e9]/10 text-[13.5px] sm:text-[14.5px] font-medium transition-all shadow-xs cursor-pointer"
                  >
                    <span>{skill.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOCATION & BIO SUMMARY */}
        <section className="w-full max-w-[820px] text-center mt-16 sm:mt-20">
          <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#444444] font-sans">
            Currently based in Singapore. Available for commercial assignments, ringside fight night coverage,
            motorsport events, expeditions, and creative media productions. Learn more about my background in{' '}
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="text-[#663300] font-semibold underline decoration-[#89c1e9] hover:decoration-[#663300] transition-colors cursor-pointer"
            >
              meet me
            </button>{' '}
            or explore the photo collections{' '}
            <button
              type="button"
              onClick={() => onNavigate('photography')}
              className="text-[#663300] font-semibold underline decoration-[#89c1e9] hover:decoration-[#663300] transition-colors cursor-pointer"
            >
              here
            </button>
            .
          </p>

          {/* ORGANIZATIONS & CLIENTS SHOWCASE WITH ACTUAL OFFICIAL LOGOS */}
          <div className="mt-14 pt-10 border-t border-black/[0.08]">
            <p className="text-xs uppercase tracking-widest text-[#777777] font-bold mb-8">
              Organizations & Events I Have Documented:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
              {/* 1. Singapore Muay Thai Association (SMTA) */}
              <div
                onClick={() => onNavigate('album', 'sports', 'muay-thai')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 hover:bg-white border border-black/[0.06] hover:border-black/15 shadow-xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
                title="Singapore Muay Thai Association (SMTA)"
              >
                <div className="h-16 flex items-center justify-center">
                  <img
                    src="/logo-smta.webp"
                    alt="Singapore Muay Thai Association (SMTA) Logo"
                    className="max-h-16 max-w-[90px] object-contain group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 group-hover:text-[#663300] transition-colors mt-2 text-center">
                  SMTA Singapore
                </span>
              </div>

              {/* 2. Mercedes-AMG PETRONAS Formula One Team */}
              <div
                onClick={() => onNavigate('album', 'sports', 'formula-1')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 hover:bg-white border border-black/[0.06] hover:border-black/15 shadow-xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
                title="Mercedes-AMG PETRONAS Formula One Team"
              >
                <div className="h-16 flex items-center justify-center">
                  <img
                    src="/logo-mercedes-f1.svg"
                    alt="Mercedes-AMG PETRONAS Formula 1 Logo"
                    className="max-h-14 max-w-[120px] object-contain group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 group-hover:text-[#663300] transition-colors mt-2 text-center">
                  Mercedes-AMG F1
                </span>
              </div>

              {/* 3. National Cadet Corps (NCC Sea) */}
              <div
                onClick={() => onNavigate('instagram')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 hover:bg-white border border-black/[0.06] hover:border-black/15 shadow-xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
                title="National Cadet Corps (NCC Sea)"
              >
                <div className="h-16 flex items-center justify-center">
                  <img
                    src="/logo-ncc.png"
                    alt="National Cadet Corps (Singapore) Official Crest"
                    className="max-h-16 max-w-[90px] object-contain group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 group-hover:text-[#663300] transition-colors mt-2 text-center">
                  NCC Sea
                </span>
              </div>

              {/* 4. Bushido Fight Academy */}
              <div
                onClick={() => onNavigate('album', 'sports', 'muay-thai')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 hover:bg-white border border-black/[0.06] hover:border-black/15 shadow-xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
                title="Bushido Fight Academy Singapore"
              >
                <div className="h-16 flex items-center justify-center">
                  <img
                    src="/logo-bushido.png"
                    alt="Bushido Fight Academy Singapore Logo"
                    className="max-h-14 max-w-[110px] object-contain group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 group-hover:text-[#663300] transition-colors mt-2 text-center">
                  Bushido Fight Academy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK EXPLORE ACTION CARDS */}
        <section className="w-full max-w-[820px] grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-black/[0.06]">
          <button
            type="button"
            onClick={() => onNavigate('photography')}
            className="p-5 rounded-2xl bg-white border border-black/8 hover:border-[#89c1e9] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-zinc-400 group-hover:text-[#663300] mb-2">
              <Camera className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-black group-hover:text-[#663300] transition-colors uppercase tracking-wider">
              Photography
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Explore combat sports, F1 trackside, stage & events galleries.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('videography')}
            className="p-5 rounded-2xl bg-white border border-black/8 hover:border-[#89c1e9] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-zinc-400 group-hover:text-[#663300] mb-2">
              <Film className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-black group-hover:text-[#663300] transition-colors uppercase tracking-wider">
              Videography
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Watch 4K cinematic edits, color grading, and video showcases.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="p-5 rounded-2xl bg-white border border-black/8 hover:border-[#89c1e9] hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-zinc-400 group-hover:text-[#663300] mb-2">
              <Mail className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-black group-hover:text-[#663300] transition-colors uppercase tracking-wider">
              Get in Touch
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Available for commercial shoots, fight coverage, and bookings.
            </p>
          </button>
        </section>
      </main>

      {/* CLEAN MINIMAL STATIC FOOTER (Moving text removed per user request) */}
      <footer className="relative z-20 w-full border-t border-black/[0.08] bg-white/70 backdrop-blur-xs py-7 px-6 sm:px-10">
        <div className="max-w-[1020px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <span className="font-bold text-black">Juztin Yuen</span>
            <span className="text-zinc-300">•</span>
            <a
              href="mailto:mrwhonow01@gmail.com"
              className="text-[#663300] hover:underline font-medium"
            >
              mrwhonow01@gmail.com
            </a>
            <span className="text-zinc-300">•</span>
            <span>Singapore</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-600">
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
