import React, { useEffect, useRef, useState } from 'react';

interface ProtectedCanvasImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoaded?: () => void;
}

/**
 * ProtectedCanvasImage renders photographs directly onto an HTML5 <canvas>
 * rather than an <img> tag.
 * 
 * Benefits:
 * 1. Zero <img> tag and zero `src` URL anywhere in the browser DOM tree when inspected.
 * 2. Overlaid with an invisible interaction shield that absorbs right-clicks, long-presses,
 *    and direct element inspection.
 * 3. Eliminates native browser "Save Image As..." context options.
 */
export const ProtectedCanvasImage: React.FC<ProtectedCanvasImageProps> = ({
  src,
  alt = 'Protected photograph',
  className = '',
  containerClassName = '',
  style,
  onClick,
  onLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      }
      setIsLoaded(true);
      if (onLoaded) onLoaded();
    };

    return () => {
      isMounted = false;
    };
  }, [src, onLoaded]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${containerClassName}`}
      onClick={onClick}
    >
      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-9 h-9 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      )}

      {/* HTML5 Canvas: No <img> tag and No src attribute in the DOM tree */}
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        className={`select-none transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{
          WebkitTouchCallout: 'none',
          userSelect: 'none',
          ...style,
        }}
      />

      {/* Invisible Anti-Inspect & Anti-Save Shield */}
      <div
        className="photo-shield absolute inset-0 z-20 pointer-events-auto cursor-pointer"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent('photo-protection-alert'));
        }}
        onDragStart={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
      />
    </div>
  );
};
