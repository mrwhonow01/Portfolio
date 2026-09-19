import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera, Film, Instagram as InstagramIcon, Mail } from 'lucide-react';
import { NavView, AlbumCategory } from './EdzSidebar';
import { TopNavbar } from './TopNavbar';
import { NametagHeroCard } from './NametagHeroCard';
import { AsteriskRow } from './AsteriskRow';
import { MarqueeTicker } from './MarqueeTicker';

interface JustinLeHomeViewProps {
  currentView: NavView;
  onNavigate: (view: NavView, album?: AlbumCategory, subAlbum?: string) => void;
}

export const JustinLeHomeView: React.FC<JustinLeHomeViewProps> = ({
  currentView,
  onNavigate,
}) => {
  // Skills / Disciplines pill tags matching justinle.xyz
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
      {/* 1. Ethereal Sky-Blue Vignette Aura Glow around viewport edges matching justinle.xyz */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 shadow-[inset_0_0_80px_25px_rgba(137,193,233,0.38)]"
      />

      {/* 2. Top Sticky Navigation Bar */}
      <TopNavbar currentView={currentView} onNavigate={onNavigate} />

      {/* 3. Main Content Container */}
      <main className="relative z-10 flex-1 max-w-[1020px] w-full mx-auto px-6 sm:px-10 pt-8 sm:pt-14 pb-16 flex flex-col items-center">
        {/* HERO SECTION: Iconic 3D Floating Nametag Card Stack */}
        <section className="w-full flex flex-col items-center justify-center my-4 sm:my-8">
          <NametagHeroCard />
        </section>

        {/* PLAYFUL COLORED ASTERISK STAR ROW */}
        <section className="w-full my-6 sm:my-8">
          <AsteriskRow />
        </section>

        {/* (NOTE: The Spotify widget is explicitly omitted per user instructions) */}

        {/* "WHO I AM" & "WHAT I DO" SECTION matching 2-column layout */}
        <section className="w-full max-w-[820px] mt-8 sm:mt-12 space-y-12 sm:space-y-16">
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
        <section className="w-full max-w-[720px] text-center mt-16 sm:mt-20">
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

          {/* ORGANIZATIONS & CLIENTS SHOWCASE */}
          <div className="mt-14 pt-10 border-t border-black/[0.06]">
            <p className="text-xs uppercase tracking-widest text-[#888888] font-bold mb-8">
              Organizations & Events I Have Documented:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-85 hover:opacity-100 transition-opacity">
              {/* SMTA */}
              <div
                onClick={() => onNavigate('album', 'sports', 'muay-thai')}
                className="group flex flex-col items-center cursor-pointer"
                title="Singapore Muay Thai Association (SMTA)"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-black group-hover:text-[#663300] transition-colors font-sans">
                  SMTA
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Muay Thai Association
                </span>
              </div>

              {/* Mercedes-AMG PETRONAS F1 */}
              <div
                onClick={() => onNavigate('album', 'sports', 'formula-1')}
                className="group flex flex-col items-center cursor-pointer"
                title="Mercedes-AMG PETRONAS Formula 1 Demo"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight text-black group-hover:text-[#663300] transition-colors font-sans">
                  PETRONAS F1
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Mercedes-AMG Demo
                </span>
              </div>

              {/* NCC Sea */}
              <div
                onClick={() => onNavigate('instagram')}
                className="group flex flex-col items-center cursor-pointer"
                title="National Cadet Corps (NCC Sea)"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight text-black group-hover:text-[#663300] transition-colors font-sans">
                  NCC SEA
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Kallang Regatta
                </span>
              </div>

              {/* Bushido Fight Academy */}
              <div
                onClick={() => onNavigate('album', 'sports', 'muay-thai')}
                className="group flex flex-col items-center cursor-pointer"
                title="Bushido Fight Academy"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight text-black group-hover:text-[#663300] transition-colors font-sans">
                  BUSHIDO
                </span>
                <span className="text-[9.5px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Fight Academy
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

      {/* 4. INFINITE RUNNING EMAIL MARQUEE TICKER matching justinle.xyz */}
      <footer className="relative z-20 w-full mt-8">
        <MarqueeTicker
          email="mrwhonow01@gmail.com"
          onNavigateToContact={() => onNavigate('contact')}
        />
      </footer>
    </div>
  );
};
