import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  thumbnailSrc?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  onClick?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  thumbnailSrc,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  decoding = 'async',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-zinc-100 ${containerClassName}`}
    >
      {/* Shimmer Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 via-zinc-200/60 to-zinc-100 animate-pulse" />
      )}

      {/* Optional low-res blurred thumbnail (only if distinct from src) */}
      {thumbnailSrc && thumbnailSrc !== src && !isLoaded && !hasError && (
        <img
          src={thumbnailSrc}
          alt={alt}
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-contain filter blur-md scale-105 opacity-60 transition-opacity duration-300 ${className}`}
        />
      )}

      {/* High-res final image */}
      <img
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
            setIsLoaded(true);
          }
        }}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`relative z-10 transition-opacity duration-300 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />

      {/* Graceful error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs font-mono">
          <span>Unable to load image</span>
        </div>
      )}
    </div>
  );
};
