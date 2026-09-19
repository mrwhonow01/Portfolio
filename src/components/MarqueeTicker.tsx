import React from 'react';

interface MarqueeTickerProps {
  email: string;
  onNavigateToContact?: () => void;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  email,
  onNavigateToContact,
}) => {
  const itemContent = (
    <div className="flex items-center gap-6 sm:gap-8 shrink-0 px-4">
      <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#663300] font-sans">
        say hello to me at{' '}
        <a
          href={`mailto:${email}`}
          onClick={(e) => {
            if (onNavigateToContact) {
              e.preventDefault();
              onNavigateToContact();
            }
          }}
          className="underline decoration-2 underline-offset-8 decoration-[#89c1e9] hover:decoration-[#663300] hover:text-[#89c1e9] transition-colors cursor-pointer"
        >
          {email}
        </a>
      </span>

      {/* Decorative colored separator dots matching justinle.xyz */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-[#89c1e9] inline-block shadow-xs" />
        <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-[#ffdc72] inline-block shadow-xs" />
        <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-[#663300] inline-block shadow-xs" />
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-hidden py-10 sm:py-14 border-t border-b border-[#89c1e9]/20 bg-white/40 backdrop-blur-xs select-none">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {itemContent}
        {itemContent}
        {itemContent}
        {itemContent}
      </div>
    </div>
  );
};
