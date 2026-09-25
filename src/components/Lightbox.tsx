import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';

interface LightboxProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentPhoto = photos[currentIndex];

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setImageLoaded(false);
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setImageLoaded(false);
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Preload adjacent images in background for instantaneous next/previous transitions
  useEffect(() => {
    if (!isOpen || !photos.length) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;

    const imgNext = new Image();
    imgNext.src = photos[nextIdx].src;
    const imgPrev = new Image();
    imgPrev.src = photos[prevIdx].src;
  }, [isOpen, currentIndex, photos]);

  // Render photograph directly onto HTML5 Canvas
  // (Prevents <img> tags or `src` URLs from appearing in DOM inspect element)
  useEffect(() => {
    if (!isOpen || !currentPhoto) return;
    setImageLoaded(false);
    let isMounted = true;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentPhoto.src;

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
      setImageLoaded(true);
    };

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentPhoto]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || isZoomed) return;
    const touchEndX = e.changedTouches[0]?.clientX;
    if (touchEndX !== undefined) {
      const deltaX = touchEndX - touchStartX;
      if (deltaX > 45) {
        handlePrev();
      } else if (deltaX < -45) {
        handleNext();
      }
    }
    setTouchStartX(null);
  };

  // Reset zoom on photo change
  useEffect(() => {
    setIsZoomed(false);
    setImageLoaded(false);
  }, [currentIndex]);

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          key="lightbox-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          id="portfolio-lightbox"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-white/98 backdrop-blur-2xl flex flex-col select-none text-zinc-800"
        >
          {/* Top Controls Bar */}
          <div className="h-16 px-5 sm:px-8 flex items-center justify-between border-b border-zinc-200/80 bg-white/90 z-20">
            {/* Left: Index Counter & Title */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-600 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 select-none">
                {currentIndex + 1} / {photos.length}
              </span>
              <span className="text-sm font-semibold text-zinc-900 truncate max-w-xs sm:max-w-md select-none">
                {currentPhoto.title}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Zoom Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </motion.button>

              {/* Fullscreen Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors hidden sm:block cursor-pointer"
                title="Toggle Fullscreen (F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </motion.button>

              {/* Close Lightbox */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                id="lightbox-close-btn"
                onClick={onClose}
                className="p-2 ml-1 rounded-full text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Main Image Stage - Rendered via Canvas with Zero <img> tag in DOM */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <div
              className={`w-full h-full relative flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-auto ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              {/* Loading Shimmer Spinner */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
                </div>
              )}

              <div className="relative inline-flex items-center justify-center">
                {/* HTML5 Canvas: Inspect Element shows only <canvas>, no image url */}
                <canvas
                  ref={canvasRef}
                  aria-label={currentPhoto.title}
                  role="img"
                  className={`max-h-[86vh] max-w-[94vw] w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-300 transform-gpu border border-black/5 select-none ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                    WebkitTouchCallout: 'none',
                    userSelect: 'none',
                  }}
                />

                {/* Invisible Anti-Inspect & Anti-Save Shield */}
                <div
                  className="photo-shield absolute inset-0 z-30 pointer-events-auto cursor-pointer"
                  onClick={() => setIsZoomed(!isZoomed)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('photo-protection-alert'));
                  }}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
