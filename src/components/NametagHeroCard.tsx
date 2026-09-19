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
  // When scrolling down, the cards smoothly slide apart and move slightly down
  const desktopCard1XRaw = useTransform(scrollY, [0, 160], [0, -220]);
  const desktopCard2XRaw = useTransform(scrollY, [0, 160], [0, 220]);
  const desktopCard1YRaw = useTransform(scrollY, [0, 160], [0, 24]);
  const desktopCard2YRaw = useTransform(scrollY, [0, 160], [0, 28]);
  const desktopCard1RotateRaw = useTransform(scrollY, [0, 160], [-5, -1.5]);
  const desktopCard2RotateRaw = useTransform(scrollY, [0, 160], [5, 2]);

  // Mobile slide-out: Cascades vertically without clipping
  const mobileCard1XRaw = useTransform(scrollY, [0, 160], [0, -20]);
  const mobileCard1YRaw = useTransform(scrollY, [0, 160], [0, -45]);
  const mobileCard2XRaw = useTransform(scrollY, [0, 160], [0, 20]);
  const mobileCard2YRaw = useTransform(scrollY, [0, 160], [0, 85]);
  const mobileCard1RotateRaw = useTransform(scrollY, [0, 160], [-4, -1]);
  const mobileCard2RotateRaw = useTransform(scrollY, [0, 160], [4, 1.5]);

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
    : manualExpand ? -220 : desktopCard1XRaw;

  const card1Y = isMobile
    ? manualExpand ? -45 : mobileCard1YRaw
    : manualExpand ? 24 : desktopCard1YRaw;

  const card1Rotate = isMobile
    ? manualExpand ? -1 : mobileCard1RotateRaw
    : manualExpand ? -1.5 : desktopCard1RotateRaw;

  const card2X = isMobile
    ? manualExpand ? 20 : mobileCard2XRaw
    : manualExpand ? 220 : desktopCard2XRaw;

  const card2Y = isMobile
    ? manualExpand ? 85 : mobileCard2YRaw
    : manualExpand ? 28 : desktopCard2YRaw;

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
      className="relative w-full max-w-[960px] min-h-[340px] sm:min-h-[400px] md:min-h-[440px] flex items-center justify-center select-none perspective-[1200px] cursor-pointer"
      title="Click or scroll down to slide out the cards!"
    >
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
        className="absolute w-[290px] xs:w-[340px] sm:w-[420px] md:w-[460px] aspect-[1.6/1] z-10 filter drop-shadow-[0_18px_36px_rgba(74,36,8,0.22)]"
      >
        <img
          src="/card-nametag-brown.png?v=3"
          alt="i am a... Photographer, Architecture Student, Storyteller"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300"
        />
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
        className="relative w-[290px] xs:w-[340px] sm:w-[420px] md:w-[460px] aspect-[1.6/1] z-20 filter drop-shadow-[0_20px_42px_rgba(0,0,0,0.22)]"
      >
        <img
          src="/card-nametag-blue.png?v=3"
          alt="hello my name is JUZTIN!"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300"
        />
      </motion.div>
    </div>
  );
};
