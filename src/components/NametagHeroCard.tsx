import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

// Authentic Graffiti Marker Tag "JUZTIN!"
const JuztinMarkerTag: React.FC = () => (
  <svg
    viewBox="0 0 490 140"
    className="w-[90%] h-auto max-h-[110px] sm:max-h-[125px] select-none filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.18)]"
  >
    <g
      fill="none"
      stroke="#0c0c0c"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* J */}
      <path d="M 52 24 L 78 24 M 66 24 L 66 84 C 66 112 36 112 26 94" />
      {/* U */}
      <path d="M 96 32 L 96 82 C 96 108 138 108 138 82 L 138 32" />
      {/* Z - Street Art Graffiti Z */}
      <path d="M 160 34 L 214 34 L 164 104 L 220 104" />
      {/* T */}
      <path d="M 234 34 L 292 34 M 263 34 L 263 104" />
      {/* I */}
      <path d="M 310 34 L 310 104" />
      {/* N */}
      <path d="M 338 104 L 338 32 L 396 104 L 396 32" />
      {/* ! */}
      <path d="M 428 26 L 426 78" strokeWidth="21" />
      <circle cx="426" cy="102" r="10.5" fill="#0c0c0c" stroke="none" />
    </g>
  </svg>
);

// Card 1: Blue "hello my name is JUZTIN!"
export const Card1Blue: React.FC = () => (
  <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] bg-[#5b9dd9] border-2 sm:border-[3px] border-[#488bc6] shadow-[0_20px_45px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col justify-between select-none">
    {/* Paper texture overlay */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:12px_12px] opacity-60 z-20" />
    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-20" />

    {/* Top Blue Header Strip */}
    <div className="relative z-10 w-full bg-[#5b9dd9] px-6 pt-3 pb-2 sm:pt-4 sm:pb-3 flex flex-col items-center justify-center text-white border-b-2 border-[#488bc6]">
      <span className="text-[32px] sm:text-[42px] font-black leading-none tracking-tight font-sans lowercase drop-shadow-xs">
        hello
      </span>
      <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.26em] opacity-95 mt-0.5 font-sans">
        my name is
      </span>
    </div>

    {/* Center White Paper with Graffiti Tag "JUZTIN!" */}
    <div className="relative z-10 flex-1 flex items-center justify-center px-4 bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#f3f3f3] shadow-inner">
      {/* Subtle crease line across paper */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        preserveAspectRatio="none"
        viewBox="0 0 400 150"
      >
        <path d="M 0 40 Q 200 80 400 30" stroke="#000000" strokeWidth="1" fill="none" />
      </svg>
      <JuztinMarkerTag />
    </div>

    {/* Bottom Blue Strip */}
    <div className="relative z-10 w-full h-[22px] sm:h-[30px] bg-[#5b9dd9] border-t-2 border-[#488bc6]" />
  </div>
);

// Card 2: Brown "i am a... Photographer, Architecture Student, Storyteller"
export const Card2Brown: React.FC = () => (
  <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] bg-[#4d2405] border-2 sm:border-[3px] border-[#3a1a03] shadow-[0_18px_40px_rgba(77,36,5,0.22)] overflow-hidden flex flex-col justify-between select-none">
    {/* Paper texture overlay */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:12px_12px] opacity-60 z-20" />
    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-20" />

    {/* Top Brown Header Strip */}
    <div className="relative z-10 w-full bg-[#4d2405] px-6 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 flex flex-col items-center justify-center text-white border-b-2 border-[#3a1a03]">
      <span className="text-[30px] sm:text-[40px] font-black leading-none tracking-tight font-sans drop-shadow-xs">
        i am a...
      </span>
    </div>

    {/* Center White Paper with Handwritten Specialties */}
    <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 py-3 bg-gradient-to-b from-[#fefefc] via-[#fbfaf6] to-[#f4f2ea] shadow-inner font-['Architects_Daughter',cursive,'Caveat',sans-serif]">
      {/* Subtle crease line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 400 150"
      >
        <path d="M 0 110 Q 200 60 400 100" stroke="#000000" strokeWidth="1" fill="none" />
      </svg>

      <ul className="space-y-2 sm:space-y-2.5 text-[#0d0d0d] font-bold text-[18px] xs:text-[20px] sm:text-[24px] md:text-[25px] leading-tight">
        <li className="flex items-center gap-2.5">
          <span className="text-[20px] sm:text-[26px] leading-none text-[#0d0d0d]">*</span>
          <span>Photographer</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[20px] sm:text-[26px] leading-none text-[#0d0d0d]">*</span>
          <span>Architecture Student</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-[20px] sm:text-[26px] leading-none text-[#0d0d0d]">*</span>
          <span>Storyteller</span>
        </li>
      </ul>
    </div>

    {/* Bottom Brown Strip */}
    <div className="relative z-10 w-full h-[22px] sm:h-[30px] bg-[#4d2405] border-t-2 border-[#3a1a03]" />
  </div>
);

export const NametagHeroCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [manualExpand, setManualExpand] = useState<boolean>(false);

  // Check window size for responsive scroll distances
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global window scroll tracking
  const { scrollY } = useScroll();

  // Desktop slide-out: Left card moves left, right card moves right
  // Settles smoothly between 0px and 140px of scroll
  const desktopCard1XRaw = useTransform(scrollY, [0, 140], [0, -215]);
  const desktopCard2XRaw = useTransform(scrollY, [0, 140], [0, 215]);
  const desktopCard1RotateRaw = useTransform(scrollY, [0, 140], [-5, -1.5]);
  const desktopCard2RotateRaw = useTransform(scrollY, [0, 140], [5, 2]);

  // Mobile slide-out: Cascades vertically without clipping
  const mobileCard1XRaw = useTransform(scrollY, [0, 140], [0, -20]);
  const mobileCard1YRaw = useTransform(scrollY, [0, 140], [0, -70]);
  const mobileCard2XRaw = useTransform(scrollY, [0, 140], [0, 20]);
  const mobileCard2YRaw = useTransform(scrollY, [0, 140], [0, 70]);
  const mobileCard1RotateRaw = useTransform(scrollY, [0, 140], [-4, -1]);
  const mobileCard2RotateRaw = useTransform(scrollY, [0, 140], [4, 1.5]);

  // Mouse tilt physics using springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const tiltRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const tiltRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Determine positions (scroll or click toggle)
  const card1X = isMobile
    ? manualExpand ? -20 : mobileCard1XRaw
    : manualExpand ? -225 : desktopCard1XRaw;

  const card1Y = isMobile
    ? manualExpand ? -70 : mobileCard1YRaw
    : 0;

  const card1Rotate = isMobile
    ? manualExpand ? -1 : mobileCard1RotateRaw
    : manualExpand ? -1.5 : desktopCard1RotateRaw;

  const card2X = isMobile
    ? manualExpand ? 20 : mobileCard2XRaw
    : manualExpand ? 225 : desktopCard2XRaw;

  const card2Y = isMobile
    ? manualExpand ? 70 : mobileCard2YRaw
    : 0;

  const card2Rotate = isMobile
    ? manualExpand ? 1.5 : mobileCard2RotateRaw
    : manualExpand ? 2 : desktopCard2RotateRaw;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setManualExpand(!manualExpand)}
      className="relative w-full max-w-[960px] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center justify-center select-none perspective-[1200px] cursor-pointer"
      title="Click or scroll down to slide out the cards!"
    >
      {/* Scroll indicator hint */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isHovered ? 1 : 0.55, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-0 pointer-events-none text-center"
      >
        <span className="text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-zinc-400 font-sans">
          scroll or click to slide out card ↓
        </span>
      </motion.div>

      {/* CARD 2: Brown "i am a..." Card (Slides out to the right) */}
      <motion.div
        style={{
          x: card2X,
          y: card2Y,
          rotate: card2Rotate,
          rotateX: isHovered ? tiltRotateX : 0,
          rotateY: isHovered ? tiltRotateY : 0,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="absolute w-[290px] xs:w-[330px] sm:w-[390px] md:w-[440px] h-[190px] xs:h-[220px] sm:h-[260px] md:h-[285px] z-10"
      >
        <Card2Brown />
      </motion.div>

      {/* CARD 1: Blue "hello my name is JUZTIN!" Card (Starts in front, slides left) */}
      <motion.div
        style={{
          x: card1X,
          y: card1Y,
          rotate: card1Rotate,
          rotateX: isHovered ? tiltRotateX : 0,
          rotateY: isHovered ? tiltRotateY : 0,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="relative w-[290px] xs:w-[330px] sm:w-[390px] md:w-[440px] h-[190px] xs:h-[220px] sm:h-[260px] md:h-[285px] z-20"
      >
        <Card1Blue />
      </motion.div>
    </div>
  );
};
