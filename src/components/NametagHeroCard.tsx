import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const NametagHeroCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt physics using spring motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  // Back card slight counter-tilt
  const backRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const backRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

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
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] h-[360px] sm:h-[400px] flex items-center justify-center select-none perspective-[1000px] cursor-grab active:cursor-grabbing"
    >
      {/* 1. BACK CARD: Deep rich textured leather-brown card */}
      <motion.div
        style={{
          rotateX: backRotateX,
          rotateY: backRotateY,
        }}
        initial={{ rotate: 5, scale: 0.95 }}
        animate={{
          rotate: [4.5, 6, 4.5],
          y: [-2, 3, -2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[330px] sm:w-[450px] h-[220px] sm:h-[290px] rounded-[26px] bg-[#4a2408] border-[3px] border-[#381a04] shadow-2xl overflow-hidden flex items-center justify-center pointer-events-none"
      >
        {/* Subtle inner paper grain overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-70" />
        <div className="absolute inset-2 rounded-[20px] border border-white/10" />
        <div className="w-16 h-16 rounded-full bg-[#381a04]/60 blur-md opacity-40" />
      </motion.div>

      {/* 2. MIDDLE CARD: Subtle offset warm card */}
      <motion.div
        style={{
          rotateX: backRotateX,
          rotateY: backRotateY,
        }}
        initial={{ rotate: -1, scale: 0.97 }}
        animate={{
          rotate: [-1.5, -0.5, -1.5],
          y: [2, -2, 2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[330px] sm:w-[450px] h-[220px] sm:h-[290px] rounded-[26px] bg-[#f7f5ed] border border-black/10 shadow-lg pointer-events-none"
      />

      {/* 3. FRONT CARD: Authentic "hello my name is JUZTIN!" Nametag Sticker */}
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        initial={{ rotate: -5 }}
        animate={{
          rotate: [-5.5, -4, -5.5],
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.25 },
        }}
        className="relative w-[320px] sm:w-[440px] h-[220px] sm:h-[290px] rounded-[24px] bg-white shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-black/10 overflow-hidden flex flex-col justify-between"
      >
        {/* Paper crease / grain texture */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:12px_12px] opacity-60 z-20" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-20" />

        {/* TOP BLUE HEADER STRIP */}
        <div className="relative z-10 w-full bg-[#5b9bd5] px-6 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 flex flex-col items-center justify-center text-white border-b-2 border-[#488ac6]">
          <span className="text-[28px] sm:text-[38px] font-black leading-none tracking-tight font-sans lowercase drop-shadow-sm">
            hello
          </span>
          <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.25em] opacity-95 mt-0.5">
            my name is
          </span>
        </div>

        {/* CENTER WHITE SECTION WITH GRAFFITI MARKER "JUZTIN!" */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 bg-gradient-to-b from-[#fefefe] via-[#fafafa] to-[#f2f2f2]">
          <svg
            viewBox="0 0 460 140"
            className="w-[92%] h-auto max-h-[115px] select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          >
            {/* Bold Street-Art Marker Tag "JUZTIN!" */}
            <g
              fill="none"
              stroke="#0a0a0a"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* J */}
              <path
                d="M 52 28 L 78 28 M 66 28 L 66 84 C 66 108 38 108 28 92"
                strokeWidth="19"
              />
              {/* U */}
              <path
                d="M 94 36 L 94 82 C 94 104 132 104 132 82 L 132 36"
                strokeWidth="19"
              />
              {/* Z */}
              <path
                d="M 152 38 L 198 38 L 154 98 L 202 98"
                strokeWidth="19"
              />
              {/* T */}
              <path
                d="M 214 38 L 268 38 M 241 38 L 241 100"
                strokeWidth="19"
              />
              {/* I */}
              <path
                d="M 284 38 L 284 100"
                strokeWidth="19"
              />
              {/* N */}
              <path
                d="M 314 100 L 314 36 L 366 100 L 366 36"
                strokeWidth="19"
              />
              {/* ! (Exclamation Mark) */}
              <path
                d="M 396 32 L 394 76"
                strokeWidth="20"
              />
              <circle
                cx="394"
                cy="98"
                r="10"
                fill="#0a0a0a"
                stroke="none"
              />
            </g>
          </svg>
        </div>

        {/* BOTTOM BLUE FOOTER STRIP */}
        <div className="relative z-10 w-full h-[22px] sm:h-[30px] bg-[#5b9bd5] border-t-2 border-[#488ac6]" />
      </motion.div>
    </div>
  );
};
