import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';

interface EdzHomeViewProps {
  photos: PhotoItem[];
  className?: string;
  style?: React.CSSProperties;
}

export const EdzHomeView: React.FC<EdzHomeViewProps> = ({ photos, className, style }) => {
  // Use curated featured highlights spanning Muay Thai, F1, Wushu stage, and Temple events
  const featuredPhotos = photos.filter((p) => p.featured);
  const displayPhotos = featuredPhotos.length > 0 ? featuredPhotos : photos.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Switch between images: smooth auto-advance interval (17.5s)
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

  const currentPhoto = displayPhotos[currentIndex] || displayPhotos[0];

  return (
    <div
      className={className || "w-full flex items-start justify-center relative select-none pointer-events-none"}
      style={style}
    >
      {/* Pure, Minimalist Photo Frame (Non-clickable, no chrome, no controls) */}
      {currentPhoto && (
        <div className="relative w-full h-full flex items-start justify-center select-none pointer-events-none">
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
        </div>
      )}
    </div>
  );
};
