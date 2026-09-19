import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';

interface EdzHomeViewProps {
  photos: PhotoItem[];
}

export const EdzHomeView: React.FC<EdzHomeViewProps> = ({ photos }) => {
  // Use curated featured highlights spanning Muay Thai, F1, Wushu stage, and Temple events
  const featuredPhotos = photos.filter((p) => p.featured);
  const displayPhotos = featuredPhotos.length > 0 ? featuredPhotos : photos.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Switch between images: unchanged interval (17.5s)
  useEffect(() => {
    if (displayPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
    }, 17500);

    return () => clearInterval(interval);
  }, [displayPhotos.length]);

  // Preload next image in memory so transitions are instant
  useEffect(() => {
    if (displayPhotos.length <= 1) return;
    const nextIdx = (currentIndex + 1) % displayPhotos.length;
    const nextPhoto = displayPhotos[nextIdx];
    if (nextPhoto && typeof window !== 'undefined') {
      const img = new Image();
      img.src = nextPhoto.src;
    }
  }, [currentIndex, displayPhotos]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayPhotos.length]);

  // Mobile touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0]?.clientX;
    if (touchEndX !== undefined) {
      const deltaX = touchEndX - touchStartX;
      if (deltaX > 45) {
        // Swiped right -> previous image
        setCurrentIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
      } else if (deltaX < -45) {
        // Swiped left -> next image
        setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
      }
    }
    setTouchStartX(null);
  };

  const currentPhoto = displayPhotos[currentIndex] || displayPhotos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
  };

  return (
    <div
      className="w-full flex items-center justify-center relative select-none"
      style={{ height: 'calc(100vh - 100px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pure, Minimalist Photo Frame (Non-clickable) */}
      {currentPhoto && (
        <div className="relative w-full h-full flex items-center justify-center cursor-default select-none pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhoto.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              src={currentPhoto.src}
              alt={currentPhoto.title}
              className="max-h-full max-w-full w-auto h-auto object-contain select-none pointer-events-none"
            />
          </AnimatePresence>

          {/* Minimalist discreet arrow controls (fade in on hover) */}
          {displayPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-black border border-black/10 shadow-sm transition-all duration-200 cursor-pointer ${
                  isHovered ? 'opacity-90' : 'opacity-0 pointer-events-none'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-black border border-black/10 shadow-sm transition-all duration-200 cursor-pointer ${
                  isHovered ? 'opacity-90' : 'opacity-0 pointer-events-none'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Minimalist unobtrusive dot indicators */}
              <div
                className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-300 ${
                  isHovered ? 'opacity-80' : 'opacity-25'
                }`}
              >
                {displayPhotos.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    className={`transition-all rounded-full cursor-pointer ${
                      currentIndex === i
                        ? 'w-4 h-1 bg-black'
                        : 'w-1 h-1 bg-black/40 hover:bg-black/70'
                    }`}
                    aria-label={`Jump to image ${i + 1}`}
                  />
                ))}
              </div>

              {/* Ultra-sleek progress line indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black/5 overflow-hidden pointer-events-none">
                <motion.div
                  key={currentIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 17.5, ease: 'linear' }}
                  className="h-full bg-black/25"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
