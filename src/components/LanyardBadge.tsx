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
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const settleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Exact motion values for badge position (used synchronously by both card and SVG strap)
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Clean up any pending settle timers on unmount
  React.useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  // Natural tilt/rotation based on horizontal displacement
  const badgeRotate = useTransform(dragX, [-180, 180], [-18, 18]);

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

  // Dynamic shadow displacement based on badge position
  const badgeShadow = useTransform([dragX, dragY], ([latestX, latestY]) => {
    const x = Number(latestX);
    const y = Number(latestY);
    const offsetX = (x * 0.12).toFixed(1);
    const offsetY = (16 + y * 0.08).toFixed(1);
    return `${offsetX}px ${offsetY}px 28px rgba(0, 0, 0, 0.16)`;
  });

  // Move the lanyard slightly in the direction the mouse moves in (zero auto-downward movement)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) return;

    const cardEl = cardRef.current;
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // Calculate exact resting center of badge
    let restingCenterX: number;
    let restingCenterY: number;

    if (cardEl) {
      const cardRect = cardEl.getBoundingClientRect();
      restingCenterX = cardRect.left + cardRect.width / 2 - dragX.get();
      restingCenterY = cardRect.top + cardRect.height / 2 - dragY.get();
    } else {
      const containerRect = containerEl.getBoundingClientRect();
      restingCenterX = containerRect.left + containerRect.width / 2;
      restingCenterY = containerRect.top + 366;
    }

    // Direction and velocity of mouse movement
    let deltaX = 0;
    let deltaY = 0;
    if (lastMousePosRef.current) {
      deltaX = e.clientX - lastMousePosRef.current.x;
      deltaY = e.clientY - lastMousePosRef.current.y;
    }
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Subtle position offset from card resting center (balanced around 0, zero downward bias)
    const offsetX = e.clientX - restingCenterX;
    const offsetY = e.clientY - restingCenterY;

    // Movement impulse in the exact direction the user is moving their mouse
    const pushX = deltaX * 0.45;
    const pushY = deltaY * 0.30;

    // Subtle positional tracking
    const leanX = offsetX * 0.08;
    const leanY = offsetY * 0.03;

    // Target displacement: moves slightly in cursor direction with realistic limits
    const targetX = Math.max(-28, Math.min(28, pushX + leanX));
    const targetY = Math.max(-10, Math.min(10, pushY + leanY));

    animate(dragX, targetX, { type: 'spring', stiffness: 240, damping: 22 });
    animate(dragY, targetY, { type: 'spring', stiffness: 240, damping: 22 });

    // Smoothly relax back to equilibrium when mouse stops moving
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = setTimeout(() => {
      if (isDraggingRef.current) return;
      lastMousePosRef.current = null;
      animate(dragX, 0, { type: 'spring', stiffness: 180, damping: 18 });
      animate(dragY, 0, { type: 'spring', stiffness: 180, damping: 18 });
    }, 150);
  };

  // Reset to equilibrium when mouse leaves the lanyard area
  const handleMouseLeave = () => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }
    lastMousePosRef.current = null;
    if (isDraggingRef.current) return;
    animate(dragX, 0, { type: 'spring', stiffness: 190, damping: 16 });
    animate(dragY, 0, { type: 'spring', stiffness: 190, damping: 16 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] mx-auto min-h-[560px] flex flex-col items-center select-none overflow-visible pt-1 outline-none ring-0"
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

      {/* Entrance Animation Wrapper: drops down from the ceiling */}
      <motion.div
        initial={{ y: -540, rotate: -8, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 14,
          mass: 1.15,
          delay: 0.12,
        }}
        className="w-full h-full relative flex flex-col items-center select-none outline-none ring-0"
      >
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

        {/* Draggable Lanyard Clasp & Badge Assembly */}
        <motion.div
          ref={cardRef}
          drag
          dragSnapToOrigin
          dragElastic={0.35}
          dragConstraints={{ left: -160, right: 160, top: -70, bottom: 180 }}
          dragTransition={{ bounceStiffness: 240, bounceDamping: 15 }}
          style={{
            x: dragX,
            y: dragY,
            rotate: badgeRotate,
            transformOrigin: '50% 20px',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            outline: 'none',
          }}
          onDragStart={() => {
            if (settleTimerRef.current) {
              clearTimeout(settleTimerRef.current);
            }
            isDraggingRef.current = true;
          }}
          onDragEnd={() => {
            isDraggingRef.current = false;
            lastMousePosRef.current = null;
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

          {/* The Credential Badge Pouch & Card */}
          <motion.div
            style={{
              boxShadow: badgeShadow,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              outline: 'none',
            }}
            className="w-[260px] sm:w-[270px] rounded-xl bg-white/95 border border-zinc-300/80 p-3.5 pt-2 flex flex-col relative select-none outline-none ring-0 focus:outline-none active:outline-none"
          >
            {/* Acrylic Badge Header Slot Punch Hole */}
            <div className="w-full flex justify-center pb-2.5 pt-0.5 select-none pointer-events-none">
              <div className="w-12 h-2.5 rounded-full bg-zinc-200/90 border border-zinc-400/60 shadow-inner flex items-center justify-center">
                <div className="w-8 h-1 rounded-full bg-zinc-300/60" />
              </div>
            </div>

            {/* Badge Inner Card */}
            <div className="bg-[#fcfcfc] border border-zinc-200/80 rounded-lg p-3 shadow-xs relative overflow-hidden flex flex-col select-none pointer-events-none">
              {/* Top Pass Header (clean, without red dot) */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2.5 select-none">
                <span className="text-[9.5px] font-mono font-bold tracking-widest uppercase text-black select-none">
                  OFFICIAL PRESS
                </span>
                <span className="text-[8.5px] font-mono text-zinc-400 tracking-wider select-none">
                  #JY-2026-SG
                </span>
              </div>

              {/* Portrait Photo Frame with Gloss Sheen (clean, no Set Photo button) */}
              <div className="relative aspect-[3/3.6] w-full bg-zinc-100 rounded border border-zinc-200 overflow-hidden shadow-xs select-none">
                <img
                  src={avatarSrc || '/DSC04070.jpg'}
                  alt={`${name} — Photographer`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                />

                {/* Diagonal Glass Sheen Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none select-none" />
              </div>

              {/* Badge Credential Identity Info */}
              <div className="pt-2.5 flex flex-col select-none">
                <div className="flex items-baseline justify-between select-none">
                  <h2 className="text-[14px] font-bold text-black uppercase tracking-tight leading-none select-none">
                    {name}
                  </h2>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 select-none">
                    {location}
                  </span>
                </div>

                <p className="text-[9.5px] uppercase tracking-wider font-mono text-zinc-600 mt-1 select-none">
                  Photographer & Storyteller
                </p>

                {/* Barcode Footer (clean, without ACCREDITED) */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-zinc-200 flex items-center justify-between select-none">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 select-none">
                    MEDIA ACCESS PASS
                  </span>

                  {/* Faux Barcode */}
                  <div className="flex items-end gap-[1.5px] h-3.5 opacity-50 select-none">
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[2px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[2.5px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[2px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Vinyl Sleeve Border Reflection Highlights */}
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/50 shadow-inner select-none" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
