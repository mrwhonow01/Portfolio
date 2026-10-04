import React from 'react';

interface Logo1SportProps {
  className?: string;
}

export const Logo1Sport: React.FC<Logo1SportProps> = ({ className = 'w-[92px] h-auto max-h-14 object-contain' }) => {
  return (
    <svg
      width="92"
      height="60"
      viewBox="0 0 280 180"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      role="img"
      aria-label="1-SPORTS League Singapore Logo"
    >
      <g fill="currentColor">
        {/* 1 MARK */}
        <path d="
          M 46 36
          L 76 18
          L 98 18
          L 98 42
          L 78 42
          L 55 110
          L 108 110
          L 96 128
          L 24 128
          L 48 52
          L 28 62
          Z
        " />

        {/* S MARK WITH SPEED WING */}
        <path d="
          M 112 18
          L 218 18
          L 230 32
          L 204 80
          L 182 80
          L 198 42
          L 142 42
          L 130 68
          L 180 82
          C 204 90, 212 102, 206 118
          C 198 134, 180 138, 152 138
          L 88 138
          L 98 120
          L 148 120
          L 156 104
          L 112 90
          C 92 84, 94 68, 102 46
          Z
        " />

        {/* HYPHEN */}
        <rect x="22" y="152" width="16" height="7" rx="1.5" transform="skewX(-16)" />

        {/* TEXT - SPORTS (Athletic Wordmark) */}
        <g transform="skewX(-16)">
          <text
            x="44"
            y="160"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="24"
            letterSpacing="3.5"
          >
            SPORTS
          </text>
        </g>
      </g>
    </svg>
  );
};
