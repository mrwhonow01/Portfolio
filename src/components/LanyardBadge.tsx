import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Camera, Sparkles } from 'lucide-react';

interface LanyardBadgeProps {
  avatarSrc: string;
  name: string;
  location?: string;
  onSetPhotoClick?: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  onImageFile?: (file: File) => void;
}

export const LanyardBadge: React.FC<LanyardBadgeProps> = ({
  avatarSrc,
  name,
  location = 'Singapore',
  onSetPhotoClick,
  fileInputRef,
}) => {
  const [imgError, setImgError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Motion values for badge dragging
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Smooth springs for strap follow-through
  const smoothX = useSpring(dragX, { stiffness: 350, damping: 25 });
  const smoothY = useSpring(dragY, { stiffness: 350, damping: 25 });

  // Natural tilt/rotation based on horizontal displacement
  const badgeRotate = useTransform(smoothX, [-180, 180], [-18, 18]);

  // Dynamic SVG path for left strap strand (from top anchor to badge clip)
  // Anchor width is centered at 160px; top anchor is at (142, 0) and (178, 0)
  const leftStrapPath = useTransform([smoothX, smoothY], ([latestX, latestY]) => {
    const x = Number(latestX);
    const y = Number(latestY);
    const startX = 142;
    const startY = 0;
    const endX = 160 + x;
    const endY = 112 + y;
    // Control point bends naturally with displacement
    const cpX = (startX + endX) / 2 + x * 0.15;
    const cpY = (startY + endY) * 0.45;
    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  // Dynamic SVG path for right strap strand
  const rightStrapPath = useTransform([smoothX, smoothY], ([latestX, latestY]) => {
    const x = Number(latestX);
    const y = Number(latestY);
    const startX = 178;
    const startY = 0;
    const endX = 160 + x;
    const endY = 112 + y;
    const cpX = (startX + endX) / 2 + x * 0.15;
    const cpY = (startY + endY) * 0.45;
    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  // Shadow displacement based on badge position
  const badgeShadow = useTransform(
    [smoothX, smoothY],
    ([latestX, latestY]) => {
      const x = Number(latestX);
      const y = Number(latestY);
      const offsetX = (x * 0.15).toFixed(1);
      const offsetY = (18 + y * 0.1).toFixed(1);
      return `${offsetX}px ${offsetY}px 32px rgba(0, 0, 0, 0.18)`;
    }
  );

  return (
    <div
      className="relative w-full max-w-[340px] mx-auto min-h-[560px] flex flex-col items-center select-none overflow-visible pt-1"
    >
      {/* Top Wall Hook / Hanging Peg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        {/* Brushed metal cylindrical wall peg */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-md border-2 border-zinc-400/80 flex items-center justify-center -mt-2">
          {/* Inner metallic bevel ring */}
          <div className="w-4 h-4 rounded-full bg-gradient-to-tl from-zinc-300 via-zinc-100 to-zinc-400 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shadow-xs" />
          </div>
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div
        className={`absolute top-2 right-2 z-30 transition-opacity duration-300 pointer-events-none text-[10px] font-mono tracking-wider uppercase flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100/90 text-zinc-600 border border-zinc-200 shadow-2xs backdrop-blur-xs ${
          hasInteracted ? 'opacity-0' : 'opacity-85'
        }`}
      >
        <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
        <span>drag me</span>
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
        className="w-full h-full relative flex flex-col items-center"
      >
        {/* SVG Ribbon / Lanyard Strap */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[300px] pointer-events-none overflow-visible z-10"
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
          }}
          onDragStart={() => setHasInteracted(true)}
          className="relative mt-[95px] flex flex-col items-center cursor-grab active:cursor-grabbing z-20 touch-none group/badge"
        >
          {/* Metal Swivel Clasp & Crimp Hardware */}
          <div className="relative flex flex-col items-center -mb-2 z-30 pointer-events-none">
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
            style={{ boxShadow: badgeShadow }}
            className="w-[260px] sm:w-[270px] rounded-xl bg-white/95 border border-zinc-300/80 p-3.5 pt-2 flex flex-col relative transition-transform duration-200 group-hover/badge:border-zinc-400"
          >
            {/* Acrylic Badge Header Slot Punch Hole */}
            <div className="w-full flex justify-center pb-2.5 pt-0.5">
              <div className="w-12 h-2.5 rounded-full bg-zinc-200/90 border border-zinc-400/60 shadow-inner flex items-center justify-center">
                <div className="w-8 h-1 rounded-full bg-zinc-300/60" />
              </div>
            </div>

            {/* Badge Inner Card */}
            <div className="bg-[#fcfcfc] border border-zinc-200/80 rounded-lg p-3 shadow-xs relative overflow-hidden flex flex-col">
              {/* Top Pass Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-[9.5px] font-mono font-bold tracking-widest uppercase text-black">
                    OFFICIAL PRESS
                  </span>
                </div>
                <span className="text-[8.5px] font-mono text-zinc-400 tracking-wider">
                  #JY-2026-SG
                </span>
              </div>

              {/* Portrait Photo Frame with Gloss Sheen */}
              <div className="relative aspect-[3/3.6] w-full bg-zinc-100 rounded border border-zinc-200 overflow-hidden group/photo shadow-xs">
                <img
                  src={!imgError ? avatarSrc : '/DSC04070.jpg'}
                  alt={`${name} — Photographer`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />

                {/* Diagonal Glass Sheen Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Subtle Owner Action: Click to change photo */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSetPhotoClick) {
                      onSetPhotoClick();
                    } else {
                      fileInputRef?.current?.click();
                    }
                  }}
                  className="absolute top-2 right-2 px-2 py-1 bg-black/75 hover:bg-black text-white rounded text-[9.5px] tracking-wider uppercase opacity-0 group-hover/badge:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 shadow-sm backdrop-blur-xs pointer-events-auto"
                  title="Choose new photo to save permanently"
                >
                  <Camera className="w-3 h-3" />
                  <span>Set Photo</span>
                </button>
              </div>

              {/* Badge Credential Identity Info */}
              <div className="pt-2.5 flex flex-col">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-[14px] font-bold text-black uppercase tracking-tight leading-none">
                    {name}
                  </h2>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                    {location}
                  </span>
                </div>

                <p className="text-[9.5px] uppercase tracking-wider font-mono text-zinc-600 mt-1">
                  Photographer & Storyteller
                </p>

                {/* Holographic Strip & Barcode Footer */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-zinc-200 flex items-center justify-between">
                  {/* Faux Holographic Accreditation Seal */}
                  <div className="px-2 py-0.5 rounded bg-gradient-to-r from-teal-200 via-purple-200 to-amber-200 border border-zinc-200/60 flex items-center gap-1 shadow-2xs">
                    <span className="text-[7.5px] font-mono font-bold tracking-widest uppercase text-zinc-700">
                      ACCREDITED
                    </span>
                  </div>

                  {/* Faux Barcode */}
                  <div className="flex items-end gap-[1.5px] h-3.5 opacity-60">
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
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/50 shadow-inner" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
