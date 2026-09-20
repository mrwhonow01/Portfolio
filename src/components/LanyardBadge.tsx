import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

interface LanyardBadgeProps {
  avatarSrc: string;
  name: string;
  location?: string;
}

export const LanyardBadge: React.FC<LanyardBadgeProps> = ({
  avatarSrc,
  name,
  location = 'Singapore',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasContactedRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Exact motion values for badge position (used synchronously by both card and SVG strap)
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Natural tilt/rotation based on horizontal displacement
  // Subtle rotation centered at 50% 50% so the whole card translates together in unison
  const badgeRotate = useTransform(dragX, [-160, 160], [-4.5, 4.5]);

  // Dynamic SVG path for left strap strand (from top peg anchor directly to metal crimp buckle)
  // Zero lag because it reads dragX and dragY directly!
  const leftStrapPath = useTransform([dragX, dragY], ([latestX, latestY]) => {
    const x = Number(latestX);
    const y = Number(latestY);
    const startX = 146;
    const startY = 0;
    const endX = 156 + x;
    const endY = 96 + y;
    const cpX = (startX + endX) / 2 + x * 0.12;
    const cpY = (startY + endY) * 0.45;
    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  // Dynamic SVG path for right strap strand
  const rightStrapPath = useTransform([dragX, dragY], ([latestX, latestY]) => {
    const x = Number(latestX);
    const y = Number(latestY);
    const startX = 174;
    const startY = 0;
    const endX = 164 + x;
    const endY = 96 + y;
    const cpX = (startX + endX) / 2 + x * 0.12;
    const cpY = (startY + endY) * 0.45;
    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  // Dynamic shadow displacement based on badge 3D position
  const badgeShadow = useTransform([dragX, dragY], ([latestX, latestY]) => {
    const x = Number(latestX);
    const y = Number(latestY);
    const offsetX = (x * 0.14).toFixed(1);
    const offsetY = (16 + y * 0.08 + Math.abs(x) * 0.04).toFixed(1);
    const blur = (26 + Math.abs(x) * 0.06).toFixed(1);
    return `${offsetX}px ${offsetY}px ${blur}px rgba(0, 0, 0, 0.16)`;
  });

  // Trigger a natural physical pendulum swing in the direction of initial contact
  const handleCardContact = (e: React.MouseEvent | { clientX: number; clientY: number }) => {
    if (isDraggingRef.current || hasContactedRef.current) return;
    hasContactedRef.current = true;

    const cardEl = cardRef.current;
    if (!cardEl) return;

    const now = performance.now();
    const lastTime = lastTimeRef.current || (now - 16);
    const dt = Math.max(8, Math.min(100, now - lastTime));

    let deltaX = 0;
    let deltaY = 0;
    if (lastMousePosRef.current) {
      deltaX = e.clientX - lastMousePosRef.current.x;
      deltaY = e.clientY - lastMousePosRef.current.y;
    }

    // Determine contact velocity vector from cursor motion entering the card
    let speedX = (deltaX / dt) * 1000;
    let speedY = (deltaY / dt) * 1000;

    // Measure card center to determine impact direction if cursor was slow
    const cardRect = cardEl.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const relX = e.clientX - cardCenterX;
    const relY = e.clientY - cardCenterY;

    // If approaching with minimal speed, push away from the edge of contact
    if (Math.abs(speedX) < 60) {
      speedX = relX < 0 ? 280 : -280;
    }
    if (Math.abs(speedY) < 30) {
      speedY = relY < 0 ? 100 : -70;
    }

    // Realistic physical contact momentum
    const contactVx = Math.max(-550, Math.min(550, speedX * 0.35));
    const contactVy = Math.max(-180, Math.min(180, speedY * 0.18));

    // Underdamped harmonic pendulum gravity swing:
    // Swings freely in the direction of contact, overshoots, and oscillates 3-4 times to rest
    // without tracking the cursor!
    animate(dragX, 0, {
      type: 'spring',
      stiffness: 36,
      damping: 4.6,
      mass: 1.25,
      velocity: contactVx,
    });

    animate(dragY, 0, {
      type: 'spring',
      stiffness: 60,
      damping: 6.4,
      mass: 1.0,
      velocity: contactVy,
    });
  };

  // While cursor moves inside the card, update position tracking but DO NOT follow the mouse!
  const handleCardMouseMove = (e: React.MouseEvent) => {
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = performance.now();

    if (!hasContactedRef.current && !isDraggingRef.current) {
      handleCardContact(e);
    }
  };

  // When cursor leaves the card, reset contact state so the next contact can trigger cleanly
  const handleCardMouseLeave = () => {
    hasContactedRef.current = false;
  };

  // On touch screens, tap or touch also triggers the pendulum swing
  const handleCardTouchStart = (e: React.TouchEvent) => {
    if (isDraggingRef.current) return;
    const touch = e.touches[0];
    if (touch) {
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      lastTimeRef.current = performance.now();
      handleCardContact({ clientX: touch.clientX, clientY: touch.clientY });
    }
  };

  const handleCardTouchEnd = () => {
    setTimeout(() => {
      hasContactedRef.current = false;
    }, 200);
  };

  // Track cursor trajectory in the container space around the lanyard for contact velocity
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = performance.now();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      className="relative w-full max-w-[340px] mx-auto min-h-[465px] md:min-h-[560px] flex flex-col items-center select-none overflow-visible pt-1 outline-none ring-0"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Top Wall Hook / Hanging Peg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none">
        {/* Brushed metal cylindrical wall peg */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-md border-2 border-zinc-400/80 flex items-center justify-center -mt-2">
          {/* Inner metallic bevel ring */}
          <div className="w-4 h-4 rounded-full bg-gradient-to-tl from-zinc-300 via-zinc-100 to-zinc-400 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shadow-xs" />
          </div>
        </div>
      </div>

      {/* Lanyard Assembly Wrapper (already in place on load, no drop-down delay) */}
      <div className="w-full h-full relative flex flex-col items-center select-none outline-none ring-0">
        {/* SVG Ribbon / Lanyard Strap */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[300px] pointer-events-none overflow-visible z-10 select-none"
          viewBox="0 0 320 300"
        >
          <defs>
            {/* Dark woven ribbon gradient */}
            <linearGradient id="ribbonDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="25%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="75%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
          </defs>

          {/* Left Ribbon Strand - Outer Width */}
          <motion.path
            d={leftStrapPath}
            stroke="url(#ribbonDark)"
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Ribbon Strand - Fine Edge Stitching */}
          <motion.path
            d={leftStrapPath}
            stroke="#71717a"
            strokeWidth={10}
            strokeDasharray="2 3"
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />

          {/* Right Ribbon Strand - Outer Width */}
          <motion.path
            d={rightStrapPath}
            stroke="url(#ribbonDark)"
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Ribbon Strand - Fine Edge Stitching */}
          <motion.path
            d={rightStrapPath}
            stroke="#71717a"
            strokeWidth={10}
            strokeDasharray="2 3"
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
        </svg>

        {/* Draggable Lanyard Clasp & Badge Assembly (Whole card moves together in unison) */}
        <motion.div
          ref={cardRef}
          drag
          dragSnapToOrigin
          dragElastic={0.4}
          dragConstraints={{ left: -180, right: 180, top: -80, bottom: 180 }}
          dragTransition={{
            bounceStiffness: 36,
            bounceDamping: 4.6,
            power: 0.3,
            restDelta: 0.5,
          }}
          style={{
            x: dragX,
            y: dragY,
            rotate: badgeRotate,
            transformOrigin: '50% 50%',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            outline: 'none',
          }}
          onDragStart={() => {
            isDraggingRef.current = true;
            hasContactedRef.current = true;
          }}
          onDragEnd={() => {
            isDraggingRef.current = false;
            lastMousePosRef.current = null;
            lastTimeRef.current = null;
            setTimeout(() => {
              hasContactedRef.current = false;
            }, 300);
          }}
          className="relative mt-[95px] flex flex-col items-center cursor-grab active:cursor-grabbing z-20 touch-none select-none outline-none ring-0"
        >
          {/* Metal Swivel Clasp & Crimp Hardware */}
          <div className="relative flex flex-col items-center -mb-2 z-30 pointer-events-none select-none">
            {/* Ribbon Crimp Buckle */}
            <div className="w-8 h-4 rounded-xs bg-gradient-to-r from-zinc-400 via-zinc-100 to-zinc-500 shadow-xs border border-zinc-400/80 flex items-center justify-center">
              <div className="w-6 h-[1.5px] bg-zinc-600/40" />
            </div>

            {/* Swivel Ring Link */}
            <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 bg-zinc-100 -mt-1 shadow-xs" />

            {/* Lobster Hook Body */}
            <div className="w-4 h-6 -mt-1 relative flex items-center justify-center">
              <div className="w-3 h-5 rounded-t-sm rounded-b-md bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 border border-zinc-400 shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-3 bg-zinc-600/30 rounded-xs" />
              </div>
            </div>

            {/* Metal Ring looping through the badge slot hole */}
            <div className="w-6 h-4 -mt-1 rounded-full border-2 border-zinc-300 bg-transparent shadow-xs" />
          </div>

          {/* The Credential Badge Pouch with Retro Vinyl Finish */}
          <motion.div
            onMouseEnter={handleCardContact}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onTouchStart={handleCardTouchStart}
            onTouchEnd={handleCardTouchEnd}
            style={{
              boxShadow: badgeShadow,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              outline: 'none',
            }}
            className="w-[264px] sm:w-[274px] rounded-2xl bg-[#fdfcf9]/85 backdrop-blur-[2px] border border-[#d6cebe]/90 p-3.5 pt-2 flex flex-col relative select-none outline-none ring-0 focus:outline-none active:outline-none shadow-md overflow-hidden"
          >
            {/* Retro Brass Grommet Slot Punch Hole */}
            <div className="w-full flex justify-center pb-2.5 pt-0.5 select-none pointer-events-none">
              <div className="w-14 h-3 rounded-full bg-gradient-to-r from-[#8a682c] via-[#dfc48b] to-[#8a682c] p-[1.5px] shadow-xs flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#2d2215] flex items-center justify-center shadow-inner">
                  <div className="w-9 h-1 rounded-full bg-[#18120b]" />
                </div>
              </div>
            </div>

            {/* Badge Inner Retro Textured Cardstock */}
            <div
              className="relative rounded-xl shadow-xs flex flex-col select-none overflow-hidden border border-[#d4cbba]"
              style={{
                background: 'linear-gradient(160deg, #fdfbf7 0%, #f6f0e4 50%, #eee4d2 100%)',
                boxShadow: 'inset 0 0 28px rgba(160, 130, 85, 0.14), inset 0 0 2px rgba(100, 75, 45, 0.2)',
              }}
            >
              {/* Tactile Paper Texture & Fiber Grain Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
                {/* SVG Grain Noise Filter */}
                <svg className="w-full h-full opacity-35 mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
                  <filter id="retroPaperTexture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="
                      0 0 0 0 0.55
                      0 0 0 0 0.45
                      0 0 0 0 0.35
                      0 0 0 0.38 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#retroPaperTexture)" />
                </svg>

                {/* Retro Diagonal Crease Marks (like pocketed credentials) */}
                <div className="absolute top-[32%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-black/[0.07] to-transparent rotate-[-9deg]" />
                <div className="absolute top-[32%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.22] to-transparent translate-y-[1px] rotate-[-9deg]" />
                
                <div className="absolute top-[68%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-black/[0.06] to-transparent rotate-[7deg]" />
                <div className="absolute top-[68%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent translate-y-[1px] rotate-[7deg]" />

                {/* Scattered Paper Pulp Fiber Specks */}
                <div className="absolute top-4 left-6 w-1 h-0.5 bg-[#4a3a2a]/20 rounded-full rotate-45" />
                <div className="absolute top-16 right-8 w-1.5 h-0.5 bg-[#4a3a2a]/15 rounded-full -rotate-12" />
                <div className="absolute bottom-12 left-10 w-1 h-0.5 bg-[#4a3a2a]/20 rounded-full rotate-30" />
                <div className="absolute bottom-6 right-12 w-1.5 h-0.5 bg-[#4a3a2a]/15 rounded-full -rotate-45" />
              </div>

              {/* Retro Header Band (matching the brown retro cards on home screen) */}
              <div className="relative bg-[#422108] text-[#f7f2e8] px-3 py-2 border-b-2 border-[#2b1504] shadow-xs flex items-center justify-between z-20 select-none">
                {/* Subtle texture highlight on header */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
                
                <div className="relative flex items-center gap-1.5 z-10">
                  <span className="text-[#e2c199] text-[10px] select-none font-bold">★</span>
                  <span className="text-[9.5px] font-mono font-black tracking-widest uppercase text-[#fdfbf7] select-none">
                    OFFICIAL PRESS PASS
                  </span>
                </div>

                <span className="relative z-10 text-[8.5px] font-mono tracking-wider text-[#d4bca0] select-none">
                  #JY-2026-SG
                </span>
              </div>

              {/* Card Body Content */}
              <div className="p-3 pt-2.5 relative z-20 flex flex-col select-none pointer-events-none">
                {/* Analog Glossy Photo Print Frame */}
                <div className="relative aspect-[3/3.6] w-full p-1 bg-[#fffdfa] rounded-sm border border-[#d8cfbe] shadow-sm select-none overflow-hidden">
                  <div className="relative w-full h-full rounded-xs overflow-hidden bg-zinc-200">
                    <img
                      src={avatarSrc || '/DSC04070.webp'}
                      alt={`${name} — Photographer`}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    />
                    {/* Subtle vintage photo sheen reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none select-none" />
                  </div>
                </div>

                {/* Badge Credential Identity Info */}
                <div className="pt-2.5 flex flex-col select-none">
                  <div className="flex items-baseline justify-between select-none">
                    <h2 className="text-[14px] font-black text-[#1f1915] uppercase tracking-tight leading-none select-none">
                      {name}
                    </h2>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#82715e] select-none font-semibold">
                      {location}
                    </span>
                  </div>

                  {/* Subtitle in Schoolbell font matching the retro home screen cards */}
                  <p className="font-schoolbell text-[13.5px] text-[#4a2e19] mt-1 select-none font-bold tracking-normal leading-tight">
                    * Photographer & Storyteller
                  </p>

                  {/* Barcode Footer with Perforated Dotted Border */}
                  <div className="mt-2.5 pt-2 border-t border-dashed border-[#cfc4b2] flex items-center justify-between select-none">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#7d6c59] select-none font-semibold">
                      MEDIA ACCESS PASS
                    </span>

                    {/* Vintage Barcode */}
                    <div className="flex items-end gap-[1.5px] h-3.5 opacity-60 select-none">
                      <div className="w-[1px] h-full bg-[#1f1915]" />
                      <div className="w-[2px] h-full bg-[#1f1915]" />
                      <div className="w-[1px] h-full bg-[#1f1915]" />
                      <div className="w-[1.5px] h-full bg-[#1f1915]" />
                      <div className="w-[1px] h-full bg-[#1f1915]" />
                      <div className="w-[2.5px] h-full bg-[#1f1915]" />
                      <div className="w-[1px] h-full bg-[#1f1915]" />
                      <div className="w-[1.5px] h-full bg-[#1f1915]" />
                      <div className="w-[2px] h-full bg-[#1f1915]" />
                      <div className="w-[1px] h-full bg-[#1f1915]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Vinyl Sleeve Border Reflection Highlights */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/60 shadow-inner select-none" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
