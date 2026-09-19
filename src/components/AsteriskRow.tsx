import React from 'react';
import { motion } from 'motion/react';

interface AsteriskProps {
  color: string;
  size?: number;
  delay?: number;
}

const EightPointAsterisk: React.FC<AsteriskProps> = ({ color, size = 32, delay = 0 }) => {
  return (
    <motion.span
      initial={{ scale: 0.9, rotate: 0 }}
      animate={{
        rotate: [0, 15, -15, 0],
        scale: [1, 1.05, 0.98, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{
        rotate: 180,
        scale: 1.25,
        transition: { duration: 0.4 },
      }}
      className="inline-flex items-center justify-center cursor-pointer select-none px-1"
      style={{ color, fontSize: `${size}px`, lineHeight: 1 }}
    >
      ✶
    </motion.span>
  );
};

export const AsteriskRow: React.FC = () => {
  // Signature colors from justinle.xyz
  const colors = [
    '#663300', // Brown
    '#ffdc72', // Pastel Yellow
    '#663300', // Brown
    '#89c1e9', // Sky Blue
    '#ffdc72', // Pastel Yellow
    '#663300', // Brown
    '#89c1e9', // Sky Blue
    '#ffdc72', // Pastel Yellow
    '#663300', // Brown
    '#ffdc72', // Pastel Yellow
    '#89c1e9', // Sky Blue
    '#ffdc72', // Pastel Yellow
    '#663300', // Brown
    '#66b3ea', // Cyan Blue
    '#ffdc72', // Pastel Yellow
    '#663300', // Brown
    '#89c1e9', // Sky Blue
    '#ffdc72', // Pastel Yellow
    '#89c1e9', // Sky Blue
  ];

  return (
    <div className="w-full overflow-hidden py-4 my-2 flex items-center justify-center">
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap max-w-full px-4">
        {colors.map((color, idx) => (
          <EightPointAsterisk
            key={idx}
            color={color}
            size={typeof window !== 'undefined' && window.innerWidth < 640 ? 26 : 34}
            delay={idx * 0.18}
          />
        ))}
      </div>
    </div>
  );
};
