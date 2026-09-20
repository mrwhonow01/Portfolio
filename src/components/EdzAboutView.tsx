import React, { useState, useEffect } from 'react';
import { PortfolioProfile, TimelineMilestone } from '../types';
import { getStoredImage } from '../utils/imageStorage';
import { LanyardBadge } from './LanyardBadge';

interface EdzAboutViewProps {
  profile: PortfolioProfile;
  timeline: TimelineMilestone[];
  onNavigateToContact: () => void;
}

export const EdzAboutView: React.FC<EdzAboutViewProps> = ({
  profile,
  timeline,
  onNavigateToContact,
}) => {
  const fallbackUrl = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85';
  
  const [avatarSrc, setAvatarSrc] = useState<string>(() => {
    try {
      return localStorage.getItem('juztin_portfolio_avatar_v2') || profile.avatar || '/DSC04070.jpg?v=2';
    } catch {
      return profile.avatar || '/DSC04070.jpg?v=2';
    }
  });
  const [imgError, setImgError] = useState(false);

  // Load custom portrait if saved in IndexedDB
  useEffect(() => {
    let isMounted = true;
    getStoredImage('juztin_portfolio_avatar_v2')
      .then((stored) => {
        if (isMounted && stored) {
          setAvatarSrc(stored);
          setImgError(false);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <article className="w-full max-w-[850px] mx-auto text-[#666666] leading-relaxed text-[14px]">
      <header className="mb-10 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-black uppercase tracking-tight">
          About
        </h1>
      </header>

      <main className="space-y-8">
        {/* Profile picture (Lanyard Pass) & Bio Intro Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Lanyard Badge Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <LanyardBadge
              avatarSrc={!imgError ? (avatarSrc || '/DSC04070.jpg?v=2') : fallbackUrl}
              name={profile.name}
              location={profile.location || 'Singapore'}
            />
          </div>

          {/* Bio text — aligned with the lanyard credential card on desktop */}
          <div className="md:col-span-7 space-y-4 text-[14px] leading-[1.7] md:pt-[150px]">
            <p>
              I'm {profile.name}, a photographer and filmmaker based in {profile.location || 'Singapore'}. 
              Most of my time is spent documenting combat sports, live events, and stage performances.
            </p>
            <p>
              Over the past few years, I've worked ringside for the <strong>Singapore Muay Thai Association (SMTA)</strong>, 
              capturing fast exchanges and the atmosphere at fight nights and tournaments. Alongside sports, I've served in the 
              National Cadet Corps (NCC Sea District) as Vice Chairperson and Engagement IC—coordinating media coverage, 
              filming regattas, and documenting cadet expeditions on the water.
            </p>
            <p>
              My go-to camera is a Sony A7M2 paired with fast Tamron zoom glass. I look for raw, honest moments rather than 
              posed shots, with clean framing and rapid turnaround for athletes, teams, and event organizers.
            </p>
          </div>
        </section>

        {/* Statement / Approach */}
        <section className="pt-6 pb-4 border-t border-b border-gray-100 my-8">
          <h2 className="text-[14px] font-bold text-black uppercase tracking-wider mb-3">
            Approach
          </h2>
          <blockquote className="italic text-[#444444] text-[15px] leading-relaxed pl-4 border-l-2 border-black/80 my-3">
            &ldquo;Whether I'm ringside dodging stray sweat, riding a safety boat with cadets, or tucked in the back of a theatre, 
            the best photos always happen between the poses. I try to catch the quiet focus, the adrenaline, and what it actually felt like to be in the room.&rdquo;
          </blockquote>
        </section>

        {/* Milestones / Leadership Trajectory */}
        <section className="space-y-6 pt-8 border-t border-gray-300">
          <h2 className="text-[14px] font-bold text-black uppercase tracking-wider">
            Experience & Appointments
          </h2>

          <div className="space-y-6 divide-y divide-gray-100">
            {timeline.map((item) => (
              <div key={item.id} className="pt-6 first:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                  <h3 className="text-[15px] font-bold text-black">
                    {item.role} <span className="font-normal text-[#888888]">· {item.organization}</span>
                  </h3>
                </div>
                <p className="text-[13px] text-[#666666] mb-3 leading-relaxed">
                  {item.description}
                </p>

                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside text-[12px] text-[#777777] space-y-1 mb-3">
                    {item.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                )}

                {item.skills && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] uppercase tracking-wider px-3 py-1 border border-gray-300 rounded-full text-[#555555]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Gear & Technical Setup */}
        <section className="pt-8 border-t border-gray-300 space-y-3">
          <h2 className="text-[14px] font-bold text-black uppercase tracking-wider">
            Equipment
          </h2>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            <strong>Camera Body:</strong> Sony Alpha 7 II (A7M2)<br />
            <strong>Lenses:</strong> Tamron 28-75mm f/2.8 G2, Tamron 70-300mm f/4.5-6.3<br />
            <strong>Post-Processing & Color:</strong> Adobe Lightroom, DaVinci Resolve
          </p>
        </section>

        {/* Contact CTA */}
        <section className="pt-8 border-t border-gray-100">
          <p className="text-[13px]">
            Have an upcoming event, fight night, or project? You can reach out through the{' '}
            <button
              type="button"
              onClick={onNavigateToContact}
              className="text-black font-semibold underline hover:text-black/70 cursor-pointer"
            >
              Contact page
            </button>
            {' '}or email me directly at{' '}
            <a
              href={`mailto:${profile.email}`}
              className="text-black font-semibold underline hover:text-black/70"
            >
              {profile.email}
            </a>.
          </p>
        </section>
      </main>
    </article>
  );
};
