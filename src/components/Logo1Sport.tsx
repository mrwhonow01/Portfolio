import React from 'react';

interface Logo1SportProps {
  className?: string;
}

export const Logo1Sport: React.FC<Logo1SportProps> = ({ className = 'max-h-14 max-w-[105px] object-contain' }) => {
  return (
    <img
      src="/logo-1sport.webp"
      alt="1-SPORTS League Singapore Official Logo"
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};
