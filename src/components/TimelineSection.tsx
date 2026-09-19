import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Shield,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineMilestone, PortfolioProfile } from '../types';

interface TimelineProps {
  timeline: TimelineMilestone[];
  profile: PortfolioProfile;
}

export const TimelineSection: React.FC<TimelineProps> = ({ timeline, profile }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string>(
    timeline[timeline.length - 1]?.id || 'tm-2026'
  );

  const active = timeline.find((m) => m.id === selectedMilestone) || timeline[0];

  return (
    <section id="timeline" className="py-28 lg:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Introduction Banner (Faithful to Slide 2) */}
      <motion.div
        id="about"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 sm:mb-32 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] p-8 sm:p-14 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
              <Compass className="w-4 h-4" />
              <span>Leadership & Creative Roots</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f5f5f7] leading-tight">
              Behind the Viewfinder
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#a1a1a6] leading-relaxed font-normal">
              {profile.bio}
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
              <div>
                <span className="block text-2xl font-bold text-white tracking-tight">200+</span>
                <span className="text-xs text-[#86868b] mt-0.5 block">Cadets & Attendees Led</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white tracking-tight">NCC Sea</span>
                <span className="text-xs text-[#86868b] mt-0.5 block">Maritime Vice Chair</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white tracking-tight">SMTA</span>
                <span className="text-xs text-[#86868b] mt-0.5 block">Official Event Coverage</span>
              </div>
            </div>
          </div>

          {/* Intro Card Spotlight */}
          <div className="lg:col-span-5">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#111113]"
            >
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
                alt="Leadership Commendation Ceremony"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-103"
              />
              <div className="p-6 bg-[#0e0e10]/95 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-white">Cadet Command & Publicity</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
                    Official Appointment
                  </span>
                </div>
                <p className="text-xs text-[#86868b] mt-2.5 leading-relaxed">
                  Combining military precision, operational calm under pressure, and cinematic camera eye.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#86868b] uppercase tracking-wider mb-4">
          <Calendar className="w-3.5 h-3.5 text-red-400" />
          <span>Proven Trajectory</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f5f5f7]">
          My Timeline
        </h3>
        <p className="text-sm text-[#86868b] mt-3 leading-relaxed">
          Key milestones tracing the evolution from unit publicity in-charge to high-octane freelance photography.
        </p>
      </motion.div>

      {/* Horizontal Milestone Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {timeline.map((m) => {
          const isSelected = m.id === selectedMilestone;
          return (
            <motion.button
              key={m.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMilestone(m.id)}
              className={`text-left p-6 sm:p-7 rounded-3xl border transition-all duration-300 relative ${
                isSelected
                  ? 'bg-white/[0.08] border-white/20 shadow-2xl shadow-black/80'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                    isSelected ? 'text-red-400' : 'text-[#86868b]'
                  }`}
                >
                  {m.year}
                </span>
                {m.badge && (
                  <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90">
                    {m.badge}
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-[#f5f5f7] tracking-tight">{m.role}</h4>
              <p className="text-xs text-[#86868b] mt-1.5 truncate">{m.organization}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Detailed Milestone Panel with fluid animation */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl bg-[#0e0e11] border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-mono text-red-400 tracking-wider uppercase font-semibold">
                    Milestone Focus · {active.year}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
                    {active.role}
                  </h4>
                  <p className="text-sm font-medium text-[#a1a1a6] mt-1">{active.organization}</p>
                </div>

                <p className="text-sm text-[#86868b] leading-relaxed">{active.description}</p>

                {/* Responsibilities */}
                <div className="pt-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d1d1d6] mb-3">
                    Key Highlights & Responsibilities
                  </h5>
                  <ul className="space-y-2.5">
                    {active.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#a1a1a6]">
                        <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Developed */}
                <div className="pt-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d1d1d6] mb-3">
                    Core Competencies
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {active.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs bg-white/[0.04] text-[#d1d1d6] border border-white/[0.08]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Highlight Image */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                {active.highlightImage && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-black/40 shadow-xl">
                    <img
                      src={active.highlightImage}
                      alt={active.role}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                    />
                  </div>
                )}

                <div className="mt-6 p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#86868b] flex items-center justify-between">
                  <span>Direct client and agency references available</span>
                  <a
                    href="#contact"
                    className="text-white hover:text-red-400 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Inquire</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

