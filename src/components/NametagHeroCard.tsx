import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

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
  // Settles around 180px - 220px of scroll
  const desktopCard1XRaw = useTransform(scrollY, [0, 220], [0, -230]);
  const desktopCard2XRaw = useTransform(scrollY, [0, 220], [0, 230]);
  const desktopCard1RotateRaw = useTransform(scrollY, [0, 220], [-5, -1.5]);
  const desktopCard2RotateRaw = useTransform(scrollY, [0, 220], [5, 2]);

  // Mobile slide-out: Cascades vertically and slightly horizontally
  const mobileCard1XRaw = useTransform(scrollY, [0, 200], [0, -25]);
  const mobileCard1YRaw = useTransform(scrollY, [0, 200], [0, -75]);
  const mobileCard2XRaw = useTransform(scrollY, [0, 200], [0, 25]);
  const mobileCard2YRaw = useTransform(scrollY, [0, 200], [0, 75]);
  const mobileCard1RotateRaw = useTransform(scrollY, [0, 200], [-4, -1]);
  const mobileCard2RotateRaw = useTransform(scrollY, [0, 200], [4, 1.5]);

  // Mouse tilt interaction
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

  // If manual expand is toggled by click, override positions
  const card1X = isMobile
    ? manualExpand ? -25 : mobileCard1XRaw
    : manualExpand ? -230 : desktopCard1XRaw;

  const card1Y = isMobile
    ? manualExpand ? -75 : mobileCard1YRaw
    : 0;

  const card1Rotate = isMobile
    ? manualExpand ? -1 : mobileCard1RotateRaw
    : manualExpand ? -1.5 : desktopCard1RotateRaw;

  const card2X = isMobile
    ? manualExpand ? 25 : mobileCard2XRaw
    : manualExpand ? 230 : desktopCard2XRaw;

  const card2Y = isMobile
    ? manualExpand ? 75 : mobileCard2YRaw
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
      className="relative w-full max-w-[1000px] min-h-[340px] sm:min-h-[420px] md:min-h-[460px] flex items-center justify-center select-none perspective-[1200px] cursor-pointer"
      title="Click or scroll down to slide out the second card!"
    >
      {/* Dynamic hint showing scroll interaction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0.6, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 z-0 pointer-events-none text-center"
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
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="absolute w-[290px] xs:w-[340px] sm:w-[420px] md:w-[470px] aspect-[1.6/1] z-10 filter drop-shadow-[0_16px_32px_rgba(74,36,8,0.22)]"
      >
        <img
          src="/card-nametag-brown.png"
          alt="i am a... Photographer, Ringside & Motorsport, Filmmaker"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300"
        />
      </motion.div>

      {/* CARD 1: Blue "hello my name is JUSTIN!" Card (Starts in front, slides left) */}
      <motion.div
        style={{
          x: card1X,
          y: card1Y,
          rotate: card1Rotate,
          rotateX: isHovered ? tiltRotateX : 0,
          rotateY: isHovered ? tiltRotateY : 0,
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="relative w-[290px] xs:w-[340px] sm:w-[420px] md:w-[470px] aspect-[1.6/1] z-20 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
      >
        <img
          src="/card-nametag-blue.png"
          alt="hello my name is Justin!"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300"
        />
      </motion.div>
    </div>
  );
};
