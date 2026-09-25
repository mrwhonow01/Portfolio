import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
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
  const [blobUrl, setBlobUrl] = useState<string>('');

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

  // Preload adjacent images in background for instantaneous transitions
  useEffect(() => {
    if (!isOpen || !photos.length) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;

    const imgNext = new Image();
    imgNext.src = photos[nextIdx].src;
    const imgPrev = new Image();
    imgPrev.src = photos[prevIdx].src;
  }, [isOpen, currentIndex, photos]);

  // Convert image to dynamic memory Blob URL so DevTools Inspect Element reveals NO static /photos/ file path
  useEffect(() => {
    if (!isOpen || !currentPhoto) return;
    setImageLoaded(false);
    let isMounted = true;

    fetch(currentPhoto.src)
      .then((res) => res.blob())
      .then((blob) => {
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      })
      .catch(() => {
        if (isMounted) setBlobUrl(currentPhoto.src);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentPhoto]);

  // Touch Swipe navigation for mobile: disabled completely if zoomed in (isZoomed)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZoomed || touchStartX === null || touchStartY === null) {
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }
    const touchEndX = e.changedTouches[0]?.clientX;
    const touchEndY = e.changedTouches[0]?.clientY;
    if (touchEndX !== undefined && touchEndY !== undefined) {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      // Only switch images if the gesture is predominantly horizontal and exceeds threshold
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
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
          <div
            className="h-16 px-5 sm:px-8 flex items-center justify-between border-b border-zinc-200/80 bg-white/90 z-40"
            onClick={(e) => e.stopPropagation()}
          >
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

          {/* Main Image Stage - Clicking anywhere on the white backdrop exits the view */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={onClose}
          >
            {/* Inner Viewport Area */}
            <div
              className={`w-full h-full relative flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-auto ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-default'
              }`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onClose();
                }
              }}
            >
              {/* Loading Shimmer Spinner */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
                </div>
              )}

              {/* Photo Wrapper - stopPropagation ensures clicking the photo itself zooms, NOT exits */}
              <div
                className="relative inline-flex items-center justify-center cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                {/* High-Resolution Responsive Photograph with Perfect Proportional Sizing */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhoto.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{
                      opacity: imageLoaded ? 1 : 0,
                      scale: isZoomed ? 1.5 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    src={blobUrl || currentPhoto.src}
                    alt={currentPhoto.title}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onLoad={() => setImageLoaded(true)}
                    className="max-h-[86vh] max-w-[94vw] object-contain rounded-xl shadow-2xl transition-transform duration-300 transform-gpu border border-black/5 select-none pointer-events-none"
                    style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                  />
                </AnimatePresence>

                {/* Subtle Copyright Watermark: Directly on the image itself, text only, no shaded box */}
                <div className="absolute bottom-3 right-3.5 pointer-events-none z-25 select-none opacity-80">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.95),_0_0_2px_rgba(0,0,0,0.85)] uppercase">
                    &copy; Juztin Yuen
                  </span>
                </div>

                {/* Invisible Anti-Inspect & Anti-Save Shield: Absorbs all clicks, right-clicks, and inspects */}
                <div
                  className={`photo-shield absolute inset-0 z-30 pointer-events-auto ${
                    isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                  }}
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

            {/* Desktop Left & Right Navigation Arrows: Shown ONLY when unzoomed (!isZoomed) */}
            <AnimatePresence>
              {!isZoomed && (
                <>
                  <motion.button
                    key="lightbox-desktop-prev"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-black shadow-xl border border-black/5 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Previous photograph"
                    title="Previous Photo (Left Arrow)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    key="lightbox-desktop-next"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.18 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-black shadow-xl border border-black/5 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Next photograph"
                    title="Next Photo (Right Arrow)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
