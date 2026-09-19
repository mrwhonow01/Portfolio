import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera, Film, Mail } from 'lucide-react';
import { NavView, AlbumCategory } from './EdzSidebar';
import { NametagHeroCard } from './NametagHeroCard';

interface JustinLeHomeViewProps {
  currentView: NavView;
  onNavigate: (view: NavView, album?: AlbumCategory, subAlbum?: string) => void;
}

export const JustinLeHomeView: React.FC<JustinLeHomeViewProps> = ({
  onNavigate,
}) => {
  // Skills / Disciplines pill tags matching the photographer & architecture student focus
  const skills = [
    { label: 'Combat Sports Photography', album: 'sports', subAlbum: 'muay-thai' },
    { label: 'Motorsport Photography', album: 'sports', subAlbum: 'formula-1' },
    { label: 'Architecture & Spatial Storytelling', album: 'stage' },
    { label: 'Cadet Expeditions', album: 'events' },
    { label: 'Cinematic 4K Videography', view: 'videography' },
    { label: 'DaVinci Color Grading', view: 'videography' },
    { label: 'Visual Storytelling', view: 'instagram' },
    { label: 'High-Speed Action Capture', album: 'sports' },
  ];

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* HERO SECTION: Scroll-Driven Two-Card Slide-Out Interaction */}
      <section className="w-full flex flex-col items-center justify-center my-2 sm:my-6">
        <NametagHeroCard />
      </section>

      {/* CLEAN MINIMAL DIVIDER LINE (Replacing stars per user request) */}
      <div className="w-full max-w-[860px] h-px bg-black/[0.08] my-8 sm:my-10" />

      {/* "WHO I AM" & "WHAT I DO" SECTION */}
      <section className="w-full max-w-[860px] mt-2 sm:mt-4 space-y-12 sm:space-y-16">
        {/* Row 1: Who I Am */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          <div className="md:col-span-3">
            <h2 className="text-[17px] sm:text-[19px] font-bold text-black font-sans lowercase tracking-tight">
              who i am
            </h2>
          </div>
          <div className="md:col-span-9">
            <p className="text-[15px] sm:text-[16px] leading-[1.7] text-[#333333] font-sans">
              Hi there! I'm <span className="text-black font-bold">Juztin</span>, a photographer, architecture student, and storyteller based in Singapore capturing raw speed, spatial forms, and live human grit. Most weekends, you'll find me ringside covering championship fight nights for the Singapore Muay Thai Association, trackside at motorsport events, or documenting national cadet expeditions and architectural spaces. My work is focused on real, unfiltered energy—freezing split-second action at 1/1000s without getting in the way of it.
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
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full border border-black/15 bg-white text-[#222222] hover:text-black hover:border-black hover:bg-black/5 text-[13px] sm:text-[14px] font-medium transition-all shadow-2xs cursor-pointer font-sans"
                >
                  <span>{skill.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & BIO SUMMARY */}
      <section className="w-full max-w-[860px] text-center mt-16 sm:mt-20">
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
              className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 shadow-2xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
              title="Singapore Muay Thai Association (SMTA)"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-smta.webp"
                  alt="Singapore Muay Thai Association (SMTA) Logo"
                  className="max-h-16 max-w-[85px] object-contain group-hover:scale-105 transition-transform duration-300"
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
              className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 shadow-2xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
              title="Mercedes-AMG PETRONAS Formula One Team"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-mercedes-f1.svg"
                  alt="Mercedes-AMG PETRONAS Formula 1 Logo"
                  className="max-h-14 max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-300"
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
              className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 shadow-2xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
              title="National Cadet Corps (NCC Sea)"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-ncc.png"
                  alt="National Cadet Corps (Singapore) Official Crest"
                  className="max-h-16 max-w-[85px] object-contain group-hover:scale-105 transition-transform duration-300"
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
              className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 shadow-2xs hover:shadow-md transition-all cursor-pointer w-full max-w-[190px] h-[130px]"
              title="Bushido Fight Academy Singapore"
            >
              <div className="h-16 flex items-center justify-center">
                <img
                  src="/logo-bushido.png"
                  alt="Bushido Fight Academy Singapore Logo"
                  className="max-h-14 max-w-[105px] object-contain group-hover:scale-105 transition-transform duration-300"
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

      {/* QUICK EXPLORE ACTION CARDS */}
      <section className="w-full max-w-[860px] grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-black/[0.08]">
        <button
          type="button"
          onClick={() => onNavigate('photography')}
          className="p-5 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 hover:shadow-sm transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-black mb-2">
            <Camera className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider font-mono">
            Photography
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Explore combat sports, F1 trackside, and event coverage galleries.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('videography')}
          className="p-5 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 hover:shadow-sm transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-black mb-2">
            <Film className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider font-mono">
            Videography
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Watch 4K cinematic edits, color grading, and video showcases.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="p-5 rounded-xl bg-[#fafafa] hover:bg-white border border-black/[0.07] hover:border-black/20 hover:shadow-sm transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-black mb-2">
            <Mail className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider font-mono">
            Get in Touch
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Available for commercial shoots, fight coverage, and bookings.
          </p>
        </button>
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
