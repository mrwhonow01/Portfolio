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

  // Translation motion values for the top hardware / strap connection point
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Independent rotational pendulum motion values for true rigid-body mechanics
  const cardRotateZ = useMotionValue(0); // 2D swing around the top clip eyelet
  const cardRotateY = useMotionValue(0); // 3D yaw twist (left/right tilt)
  const cardRotateX = useMotionValue(0); // 3D pitch tilt (bottom kick up/down)

  // Subtle drag tilt coupled with rotational pendulum
  const dragTilt = useTransform(dragX, [-180, 180], [-10, 10]);
  const totalRotateZ = useTransform([dragTilt, cardRotateZ], ([dt, cr]) => Number(dt) + Number(cr));

  // Dynamic SVG path for left strap strand (from top wall peg to crimp buckle)
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

  // Dynamic ambient drop shadow on the wall that reacts to both translation and rotational swing
  const badgeShadow = useTransform(
    [dragX, dragY, totalRotateZ],
    ([latestX, latestY, latestRz]) => {
      const x = Number(latestX);
      const y = Number(latestY);
      const rz = Number(latestRz);
      const offsetX = (x * 0.14 + rz * 0.35).toFixed(1);
      const offsetY = (16 + y * 0.08 + Math.abs(x) * 0.04 + Math.abs(rz) * 0.25).toFixed(1);
      const blur = (26 + Math.abs(x) * 0.06 + Math.abs(rz) * 0.2).toFixed(1);
      return `${offsetX}px ${offsetY}px ${blur}px rgba(0, 0, 0, 0.18)`;
    }
  );

  // Dynamic specular light glare across the clear vinyl sleeve that shifts with 3D rotation
  const vinylGlareBackground = useTransform(
    [cardRotateY, totalRotateZ],
    ([ry, rz]) => {
      const posX = (50 + Number(ry) * 2.2).toFixed(1);
      const angle = (115 + Number(rz) * 0.8).toFixed(1);
      return `linear-gradient(${angle}deg, transparent ${Math.max(10, Number(posX) - 24)}%, rgba(255,255,255,0.45) ${posX}%, rgba(255,255,255,0.14) ${Number(posX) + 4}%, transparent ${Math.min(90, Number(posX) + 24)}%)`;
    }
  );

  // Dynamic iridescent hologram gradient angle reacting to rotation
  const holoGradient = useTransform(
    [totalRotateZ, cardRotateY],
    ([rz, ry]) => {
      const angle = (135 + Number(rz) * 2.2 + Number(ry) * 1.5).toFixed(0);
      return `linear-gradient(${angle}deg, #fbc2eb 0%, #a6c1ee 35%, #8fd3f4 70%, #f6d365 100%)`;
    }
  );

  // Physically accurate compound pendulum contact simulation:
  // Hitting the bottom corner exerts maximum torque around the top clip pivot (transformOrigin: 50% 12px),
  // causing the bottom corner to swing and tilt dramatically while the top stays anchored at the clasp!
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

    // Cursor velocity vector in px/sec
    let speedX = (deltaX / dt) * 1000;
    let speedY = (deltaY / dt) * 1000;

    // Measure exact card dimensions & hit location
    const cardRect = cardEl.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardTopY = cardRect.top;

    // Normalized hit coordinates:
    // hitRelX: -1.0 (left edge) to 0.0 (center) to +1.0 (right edge)
    const hitRelX = Math.max(-1, Math.min(1, (e.clientX - cardCenterX) / (cardRect.width / 2)));
    // hitRelY: 0.0 (top near clip eyelet) to 1.0 (bottom edge)
    const hitRelY = Math.max(0, Math.min(1, (e.clientY - cardTopY) / cardRect.height));

    // Provide authentic impulse for gentle taps or static hovers based on hit location
    if (Math.abs(speedX) < 45) {
      speedX = hitRelX < 0 ? 320 : -320;
    }
    if (Math.abs(speedY) < 25) {
      speedY = 120;
    }

    // --- COMPOUND PENDULUM TORQUE & LEVER ARM DECOMPOSITION ---
    // The physical pivot is at the top of the card (hitRelY ≈ 0).
    // The farther down the hit point, the larger the rotational lever arm!
    const leverArm = Math.max(0.12, hitRelY);

    // Rotational torque around Z-axis:
    // ForceX * distanceY from top pivot
    const torqueX = speedX * leverArm;
    // Off-center vertical force also imparts angular momentum
    const torqueY = -speedY * hitRelX * 0.42;
    const totalTorque = torqueX + torqueY;

    // Angular velocity: At the bottom corner (leverArm ≈ 0.95, hitRelX ≈ ±0.8), angular velocity is MAXIMUM!
    const angularVz = Math.max(-460, Math.min(460, totalTorque * 0.52));

    // 3D Yaw (RotateY): hitting the edge rotates the card in 3D around its vertical axis
    const angularVy = Math.max(-300, Math.min(300, (-hitRelX * Math.abs(speedX) * 0.3) - (speedX * 0.15)));

    // 3D Pitch (RotateX): hitting the bottom edge kicks the bottom outwards/inwards in 3D
    const angularVx = Math.max(-250, Math.min(250, (leverArm * Math.abs(speedY) * 0.32) + (speedY * 0.1)));

    // Strap translation (lateral sway at the top clip):
    // When hitting the bottom corner, only a minor fraction of force translates the top strap!
    // When hitting the top near the clip, most of the force translates the strap.
    const strapFactor = Math.max(0.18, 1 - leverArm * 0.78);
    const contactVx = Math.max(-320, Math.min(320, speedX * strapFactor * 0.28));
    const contactVy = Math.max(-120, Math.min(120, speedY * strapFactor * 0.14));

    // Animate angular pendulum (card swings and oscillates freely around the top clip)
    animate(cardRotateZ, 0, {
      type: 'spring',
      stiffness: 38,
      damping: 3.5, // underdamped oscillation for natural physical decay
      mass: 0.85,
      velocity: angularVz,
    });

    // Animate 3D yaw twist
    animate(cardRotateY, 0, {
      type: 'spring',
      stiffness: 62,
      damping: 6.2,
      mass: 0.75,
      velocity: angularVy,
    });

    // Animate 3D pitch tilt
    animate(cardRotateX, 0, {
      type: 'spring',
      stiffness: 70,
      damping: 6.8,
      mass: 0.75,
      velocity: angularVx,
    });

    // Animate top hardware strap sway
    animate(dragX, 0, {
      type: 'spring',
      stiffness: 28,
      damping: 5.0,
      mass: 1.1,
      velocity: contactVx,
    });

    animate(dragY, 0, {
      type: 'spring',
      stiffness: 52,
      damping: 6.2,
      mass: 1.0,
      velocity: contactVy,
    });
  };

  // Track cursor velocity without sticky tracking
  const handleCardMouseMove = (e: React.MouseEvent) => {
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = performance.now();

    if (!hasContactedRef.current && !isDraggingRef.current) {
      handleCardContact(e);
    }
  };

  const handleCardMouseLeave = () => {
    hasContactedRef.current = false;
  };

  // Touch screen support
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

  // Track container-level cursor motion
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
        perspective: 1000,
      }}
    >
      {/* Top Wall Hook / Hanging Peg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none">
        {/* Brushed stainless steel cylindrical wall peg with concentric bevels */}
        <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-[0_4px_12px_rgba(0,0,0,0.35)] border-2 border-zinc-300/90 flex items-center justify-center -mt-2">
          {/* Inner metallic bevel ring */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-tl from-zinc-400 via-zinc-100 to-zinc-300 shadow-inner flex items-center justify-center border border-zinc-400">
            {/* Center mounting hex bolt */}
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-950 shadow-xs flex items-center justify-center">
              <div className="w-1 h-1 bg-zinc-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Lanyard Assembly Wrapper */}
      <div className="w-full h-full relative flex flex-col items-center select-none outline-none ring-0">
        {/* SVG Ribbon / Lanyard Strap */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[300px] pointer-events-none overflow-visible z-10 select-none"
          viewBox="0 0 320 300"
        >
          <defs>
            {/* Woven Twill Ribbon Texture Pattern */}
            <pattern id="ribbonWeave" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="2" height="4" fill="#242429" />
              <rect x="2" width="2" height="4" fill="#141417" />
              <line x1="0" y1="0" x2="4" y2="0" stroke="#383842" strokeWidth="0.75" opacity="0.7" />
            </pattern>

            {/* Depth Shadow Filter */}
            <filter id="strapDropShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.25" />
            </filter>

            {/* Dark woven ribbon gradient */}
            <linearGradient id="ribbonDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#101013" />
              <stop offset="18%" stopColor="#25252b" />
              <stop offset="50%" stopColor="#161619" />
              <stop offset="82%" stopColor="#25252b" />
              <stop offset="100%" stopColor="#101013" />
            </linearGradient>

            {/* Gold Thread Accent for Edge Stitching */}
            <linearGradient id="threadGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#967744" />
              <stop offset="50%" stopColor="#cca562" />
              <stop offset="100%" stopColor="#7a5d30" />
            </linearGradient>
          </defs>

          {/* Left Ribbon Ambient Shadow */}
          <motion.path
            d={leftStrapPath}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={19}
            strokeLinecap="round"
            fill="none"
            filter="url(#strapDropShadow)"
          />

          {/* Left Ribbon Outer Webbing */}
          <motion.path
            d={leftStrapPath}
            stroke="url(#ribbonDark)"
            strokeWidth={15}
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Ribbon Twill Weave Texture Overlay */}
          <motion.path
            d={leftStrapPath}
            stroke="url(#ribbonWeave)"
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
            opacity={0.9}
          />

          {/* Left Ribbon Fine Edge Stitching (Twin golden thread stitch) */}
          <motion.path
            d={leftStrapPath}
            stroke="url(#threadGold)"
            strokeWidth={11}
            strokeDasharray="2.5 2.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.75}
          />

          {/* Right Ribbon Ambient Shadow */}
          <motion.path
            d={rightStrapPath}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={19}
            strokeLinecap="round"
            fill="none"
            filter="url(#strapDropShadow)"
          />

          {/* Right Ribbon Outer Webbing */}
          <motion.path
            d={rightStrapPath}
            stroke="url(#ribbonDark)"
            strokeWidth={15}
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Ribbon Twill Weave Texture Overlay */}
          <motion.path
            d={rightStrapPath}
            stroke="url(#ribbonWeave)"
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
            opacity={0.9}
          />

          {/* Right Ribbon Fine Edge Stitching (Twin golden thread stitch) */}
          <motion.path
            d={rightStrapPath}
            stroke="url(#threadGold)"
            strokeWidth={11}
            strokeDasharray="2.5 2.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.75}
          />
        </svg>

        {/* Draggable Lanyard Hardware Anchor (moves by dragX, dragY) */}
        <motion.div
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
          <div className="relative flex flex-col items-center -mb-3 z-30 pointer-events-none select-none filter drop-shadow-[0_4px_7px_rgba(0,0,0,0.25)]">
            {/* Ribbon Crimp Buckle (Folded stamped steel band with grip teeth) */}
            <div className="relative w-9 h-4.5 rounded-xs bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 border border-zinc-400/90 shadow-sm flex items-center justify-between px-1.5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15 pointer-events-none" />
              {/* Stamped crimp tooth indentation ridges */}
              <div className="w-[1.5px] h-full bg-zinc-500/60 shadow-xs" />
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-200 to-zinc-600 shadow-inner border border-zinc-400/90" />
              <div className="w-[1.5px] h-full bg-zinc-500/60 shadow-xs" />
            </div>

            {/* Machined Swivel Collar Joint */}
            <div className="w-4 h-4 rounded-full border-2 border-zinc-300 bg-gradient-to-br from-zinc-100 to-zinc-300 -mt-1 shadow-xs flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shadow-inner" />
            </div>

            {/* Lobster Hook Body with trigger snap lever */}
            <div className="w-5 h-7 -mt-1 relative flex items-center justify-center">
              <div className="w-3.5 h-5.5 rounded-t-sm rounded-b-lg bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-400 border border-zinc-400 shadow-sm flex items-center justify-center relative">
                {/* Trigger thumb lever on side with grip ridges */}
                <div className="absolute -left-1.5 top-1.5 w-1.5 h-2.5 rounded-l-xs bg-gradient-to-r from-zinc-400 to-zinc-200 border-l border-t border-b border-zinc-400 shadow-xs flex flex-col justify-center gap-[1.5px] py-0.5">
                  <div className="w-1 h-[0.75px] bg-zinc-600" />
                  <div className="w-1 h-[0.75px] bg-zinc-600" />
                </div>
                {/* Snap gate mechanical slot */}
                <div className="w-1.5 h-3.5 bg-zinc-600/35 rounded-xs shadow-inner" />
              </div>
            </div>

            {/* Heavy-duty Stainless Steel Double-Loop Split Ring (loops through the punch slot) */}
            <div className="w-7 h-4.5 -mt-1.5 rounded-full border-[2.5px] border-zinc-300 bg-transparent shadow-xs relative">
              <div className="absolute inset-0 rounded-full border border-zinc-500/40 pointer-events-none" />
            </div>
          </div>

          {/* The Credential Badge Pouch with TOP-PIVOT COMPOUND PENDULUM:
              transformOrigin is set to '50% 12px' (the top split-ring punch eyelet).
              When you hit the bottom corner, the bottom rotates and swings wide in 3D,
              while the top stays anchored at the clasp! */}
          <motion.div
            ref={cardRef}
            onMouseEnter={handleCardContact}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onTouchStart={handleCardTouchStart}
            onTouchEnd={handleCardTouchEnd}
            style={{
              rotateZ: totalRotateZ,
              rotateY: cardRotateY,
              rotateX: cardRotateX,
              transformOrigin: '50% 12px',
              transformStyle: 'preserve-3d',
              boxShadow: badgeShadow,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              outline: 'none',
            }}
            className="w-[270px] sm:w-[282px] rounded-2xl bg-white/80 backdrop-blur-[3px] border-2 border-[#d2c7b5]/90 p-3.5 pt-2 flex flex-col relative select-none outline-none ring-0 focus:outline-none active:outline-none shadow-xl overflow-hidden cursor-pointer"
          >
            {/* Ultrasonic Welded Edge Perimeter Seam (Frosted 3.5mm bond line) */}
            <div className="absolute inset-1 rounded-xl pointer-events-none border-2 border-dotted border-[#bdae97]/45 z-30" />

            {/* Card Insertion Slit Line (Realistic vinyl opening across top) */}
            <div className="absolute top-[28px] left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#bdae97]/30 to-transparent z-30 pointer-events-none" />
            <div className="absolute top-[29px] left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-30 pointer-events-none" />

            {/* High-Gloss Dynamic Specular Surface Glare (Shifts dynamically with 3D rotation) */}
            <motion.div
              className="absolute -inset-full pointer-events-none z-30 opacity-45 mix-blend-screen"
              style={{
                background: vinylGlareBackground,
              }}
            />

            {/* Clear Die-Cut Slot Punch Hole with Reinforced Brass Grommet Frame */}
            <div className="w-full flex justify-center pb-2.5 pt-0.5 select-none pointer-events-none relative z-20">
              <div className="w-15 h-3.5 rounded-full bg-gradient-to-r from-[#8a682c] via-[#ecd298] to-[#8a682c] p-[1.5px] shadow-sm flex items-center justify-center border border-[#715421]">
                {/* Clear die-cut slot hole where the steel split ring loops through */}
                <div className="w-full h-full rounded-full bg-[#2e2215] flex items-center justify-center shadow-inner">
                  <div className="w-10 h-1.5 rounded-full bg-[#18120b]" />
                </div>
              </div>
            </div>

            {/* Inner Retro Textured Cardstock */}
            <div
              className="relative rounded-xl shadow-xs flex flex-col select-none overflow-hidden border border-[#d2c5b0]"
              style={{
                background: 'linear-gradient(158deg, #fcf9f2 0%, #f6efe1 35%, #ecdeca 75%, #e0ceb4 100%)',
                boxShadow: 'inset 0 0 32px rgba(145, 110, 65, 0.2), inset 0 0 3px rgba(90, 65, 35, 0.35)',
              }}
            >
              {/* Tactile Paper Texture & Fiber Grain Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
                {/* SVG Grain Noise Filter */}
                <svg className="w-full h-full opacity-45 mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
                  <filter id="retroPaperTexture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="
                      0 0 0 0 0.58
                      0 0 0 0 0.48
                      0 0 0 0 0.36
                      0 0 0 0 0.42 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#retroPaperTexture)" />
                </svg>

                {/* Retro Diagonal Crease Marks (Handling folds like pocketed credentials) */}
                <div className="absolute top-[30%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-black/[0.09] to-transparent rotate-[-8deg]" />
                <div className="absolute top-[30%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.28] to-transparent translate-y-[1px] rotate-[-8deg]" />
                
                <div className="absolute top-[66%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-black/[0.08] to-transparent rotate-[6deg]" />
                <div className="absolute top-[66%] -left-6 w-[130%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.24] to-transparent translate-y-[1px] rotate-[6deg]" />

                {/* Natural Organic Wood Pulp Fiber Specks */}
                <div className="absolute top-4 left-6 w-1.5 h-0.5 bg-[#4a3a2a]/25 rounded-full rotate-45" />
                <div className="absolute top-14 right-8 w-2 h-0.5 bg-[#4a3a2a]/20 rounded-full -rotate-15" />
                <div className="absolute top-36 left-12 w-1.5 h-0.5 bg-[#4a3a2a]/25 rounded-full rotate-75" />
                <div className="absolute bottom-12 left-10 w-2 h-0.5 bg-[#4a3a2a]/25 rounded-full rotate-30" />
                <div className="absolute bottom-6 right-12 w-1.5 h-0.5 bg-[#4a3a2a]/20 rounded-full -rotate-45" />
                <div className="absolute bottom-24 right-5 w-1 h-0.5 bg-[#4a3a2a]/20 rounded-full rotate-12" />

                {/* Faded Archival Red Watermark Accreditation Seal */}
                <div className="absolute bottom-10 right-4 w-28 h-28 rounded-full border-2 border-red-800/18 flex items-center justify-center rotate-[-18deg] pointer-events-none select-none">
                  <div className="w-24 h-24 rounded-full border border-dashed border-red-800/15 flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[7.5px] font-mono font-bold tracking-widest uppercase text-red-900/22">
                      SINGAPORE MEDIA
                    </span>
                    <span className="text-[9px] text-red-900/25 my-0.5">★</span>
                    <span className="text-[6.5px] font-mono tracking-widest uppercase text-red-900/20">
                      ACCREDITED 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Retro Header Band (matching deep espresso cards on home screen) */}
              <div className="relative bg-[#381c06] text-[#f7f2e8] px-3.5 py-2.5 border-b-2 border-[#1f0f03] shadow-xs flex items-center justify-between z-20 select-none">
                {/* Subtle texture highlight on header */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-black/25 pointer-events-none" />
                
                <div className="relative flex items-center gap-1.5 z-10">
                  <span className="text-[#e2c199] text-[10.5px] select-none font-bold">★</span>
                  <span className="text-[9.5px] font-mono font-black tracking-widest uppercase text-[#fdfbf7] select-none">
                    OFFICIAL PRESS PASS
                  </span>
                </div>

                <span className="relative z-10 text-[8.5px] font-mono tracking-wider text-[#d4bca0] select-none font-bold">
                  #JY-2026-SG
                </span>
              </div>

              {/* Card Body Content */}
              <div className="p-3 pt-2.5 relative z-20 flex flex-col select-none pointer-events-none">
                {/* Analog Glossy Photo Print Frame */}
                <div className="relative aspect-[3/3.6] w-full p-1.5 bg-[#ffffff] rounded-xs border border-[#cfc4b1] shadow-[0_2px_8px_rgba(0,0,0,0.12)] select-none overflow-hidden">
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
                    {/* Glossy photographic paper sheen reflection */}
                    <div
                      className="absolute inset-0 pointer-events-none select-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 40%, transparent 60%, rgba(255,255,255,0.12) 100%)',
                      }}
                    />
                  </div>
                </div>

                {/* Badge Credential Identity Info */}
                <div className="pt-2.5 flex flex-col select-none">
                  <div className="flex items-baseline justify-between select-none">
                    <h2 className="text-[14.5px] font-black text-[#1a140f] uppercase tracking-tight leading-none select-none">
                      {name}
                    </h2>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#7a6a57] select-none font-bold">
                      {location}
                    </span>
                  </div>

                  {/* Subtitle in Schoolbell font matching retro home screen cards */}
                  <p className="font-schoolbell text-[13.5px] text-[#4a2e19] mt-1 select-none font-bold tracking-normal leading-tight">
                    * Photographer & Storyteller
                  </p>

                  {/* Barcode & Security Hologram Footer with Perforated Dotted Border */}
                  <div className="mt-2.5 pt-2 border-t border-dashed border-[#cbbfa9] flex items-center justify-between select-none relative">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#72614e] select-none font-bold">
                        MEDIA ACCESS PASS
                      </span>

                      {/* Vintage Barcode with alternating line weights */}
                      <div className="flex items-end gap-[1.5px] h-3.5 opacity-70 mt-1 select-none">
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
                        <div className="w-[2px] h-full bg-[#1f1915]" />
                        <div className="w-[1.5px] h-full bg-[#1f1915]" />
                      </div>
                    </div>

                    {/* Dynamic Holographic Security Foil Seal (Shifts iridescent gradient with rotation) */}
                    <motion.div
                      className="w-6 h-6 rounded-xs shadow-xs border border-white/60 flex items-center justify-center overflow-hidden relative select-none"
                      style={{
                        background: holoGradient,
                      }}
                      title="Security Hologram"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/40" />
                      <span className="text-[6.5px] font-mono font-black text-black/65 tracking-tighter uppercase rotate-[-25deg]">
                        VALID
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Vinyl Sleeve Perimeter Bevel Reflection */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/70 shadow-inner select-none z-30" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
