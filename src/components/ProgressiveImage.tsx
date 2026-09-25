import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  thumbnailSrc?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
}

const ProgressiveImageComponent: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  thumbnailSrc,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchpriority,
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
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className={`absolute inset-0 w-full h-full object-contain filter blur-md scale-105 opacity-60 transition-opacity duration-300 pointer-events-none select-none ${className}`}
          style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
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
        fetchPriority={fetchpriority}
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className={`relative z-10 transition-opacity duration-300 ease-out pointer-events-none select-none ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
      />

      {/* Subtle Copyright Watermark: Text only, no shaded box */}
      <div className="absolute bottom-2.5 right-3 pointer-events-none z-15 select-none opacity-50 group-hover:opacity-85 transition-opacity">
        <span className="text-[9.5px] font-mono tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] uppercase">
          &copy; Juztin Yuen
        </span>
      </div>

      {/* Transparent Protective Shield: Intercepts right-clicks, mobile hold, and inspect element */}
      <div
        className="photo-shield absolute inset-0 z-20 pointer-events-auto cursor-pointer"
        style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent('photo-protection-alert'));
        }}
        onDragStart={(e) => e.preventDefault()}
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

export const ProgressiveImage = React.memo(ProgressiveImageComponent);
