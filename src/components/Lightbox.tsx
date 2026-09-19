import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
  Camera,
  Share2,
  Download,
  Calendar,
  MapPin,
  Check,
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
  const [showInfo, setShowInfo] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const handleShare = () => {
    if (navigator.clipboard && currentPhoto) {
      navigator.clipboard.writeText(currentPhoto.src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key.toLowerCase() === 'i') setShowInfo((prev) => !prev);
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

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
              <span className="text-xs font-mono text-zinc-600 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200">
                {currentIndex + 1} / {photos.length}
              </span>
              <span className="text-sm font-semibold text-zinc-900 truncate max-w-xs sm:max-w-md">
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
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </motion.button>

              {/* Fullscreen Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors hidden sm:block"
                title="Toggle Fullscreen (F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </motion.button>

              {/* Info Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-full transition-colors ${
                  showInfo
                    ? 'text-black bg-zinc-100 font-medium'
                    : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                }`}
                title="Toggle Shot Info & EXIF (I)"
              >
                <Info className="w-4 h-4" />
              </motion.button>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors relative"
                title="Copy Image URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </motion.button>

              {/* Download Original */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={currentPhoto.src}
                target="_blank"
                rel="noopener noreferrer"
                download={`${currentPhoto.title.replace(/\s+/g, '_')}.jpg`}
                className="p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                title="Open Full Resolution"
              >
                <Download className="w-4 h-4" />
              </motion.a>

              {/* Close Lightbox */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                id="lightbox-close-btn"
                onClick={onClose}
                className="p-2 ml-1 rounded-full text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Main Image Stage & Drawer */}
          <div className="relative flex-1 flex overflow-hidden">
            {/* Navigation Arrow Left */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handlePrev}
              id="lightbox-prev-btn"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-black border border-zinc-200 shadow-md backdrop-blur-md transition-all cursor-pointer"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Center Canvas Area */}
            <div
              className={`flex-1 relative flex items-center justify-center p-4 sm:p-10 overflow-auto ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {/* Loading Shimmer */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{
                    opacity: imageLoaded ? 1 : 0,
                    scale: isZoomed ? 1.5 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  src={currentPhoto.src}
                  alt={currentPhoto.title}
                  onLoad={() => setImageLoaded(true)}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-transform duration-300 transform-gpu border border-black/5"
                />
              </AnimatePresence>
            </div>

            {/* Navigation Arrow Right */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNext}
              id="lightbox-next-btn"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-black border border-zinc-200 shadow-md backdrop-blur-md transition-all cursor-pointer"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* EXIF & Metadata Sidebar Drawer with AnimatePresence */}
            <AnimatePresence>
              {showInfo && (
                <motion.aside
                  key="lightbox-drawer"
                  initial={{ x: 340, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 340, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  id="lightbox-info-drawer"
                  className="w-full sm:w-84 lg:w-96 bg-white/98 border-l border-zinc-200 backdrop-blur-2xl p-7 overflow-y-auto flex flex-col justify-between absolute sm:relative inset-y-0 right-0 z-20 shadow-xl text-zinc-800"
                >
                  <div className="space-y-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {currentPhoto.category}
                      </span>
                      {currentPhoto.date ? (
                        <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {currentPhoto.date}
                        </span>
                      ) : null}
                    </div>

                    {/* Title & Project */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-zinc-900 leading-snug">
                        {currentPhoto.title}
                      </h3>
                      {currentPhoto.clientOrProject && (
                        <p className="text-xs text-zinc-600 mt-1.5 font-medium">
                          {currentPhoto.clientOrProject}
                        </p>
                      )}
                      {currentPhoto.story && (
                        <p className="text-xs text-zinc-600 leading-relaxed mt-2.5 font-normal">
                          {currentPhoto.story}
                        </p>
                      )}
                    </div>

                    {/* Camera & EXIF Information Grid */}
                    <div className="pt-3.5 border-t border-zinc-200">
                      <div className="flex items-center gap-2 mb-3.5">
                        <Camera className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
                          Camera & Settings
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                          <span className="block text-[10px] text-zinc-500 uppercase">Camera</span>
                          <span className="font-mono text-zinc-900 truncate block mt-0.5">
                            {currentPhoto.cameraInfo?.camera || 'Sony Alpha 7 II (A7M2)'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                          <span className="block text-[10px] text-zinc-500 uppercase">Lens</span>
                          <span className="font-mono text-zinc-900 truncate block mt-0.5">
                            {currentPhoto.cameraInfo?.lens || 'Tamron 28-75mm f/2.8 Di III VXD G2'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                          <span className="block text-[10px] text-zinc-500 uppercase">Aperture</span>
                          <span className="font-mono text-zinc-900 block mt-0.5">
                            {currentPhoto.cameraInfo?.aperture || 'f/2.8'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                          <span className="block text-[10px] text-zinc-500 uppercase">Shutter</span>
                          <span className="font-mono text-zinc-900 block mt-0.5">
                            {currentPhoto.cameraInfo?.shutter || '1/1000s'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                          <span className="block text-[10px] text-zinc-500 uppercase">ISO</span>
                          <span className="font-mono text-zinc-900 block mt-0.5">
                            {currentPhoto.cameraInfo?.iso || '800'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                          <span className="block text-[10px] text-zinc-500 uppercase">Focal Length</span>
                          <span className="font-mono text-zinc-900 block mt-0.5">
                            {currentPhoto.cameraInfo?.focalLength || '50mm'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                      <div className="pt-3.5 border-t border-zinc-200">
                        <div className="flex flex-wrap gap-1.5">
                          {currentPhoto.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile close info button */}
                  <div className="pt-6 sm:hidden">
                    <button
                      onClick={() => setShowInfo(false)}
                      className="w-full py-2.5 text-xs text-zinc-700 bg-zinc-100 rounded-xl"
                    >
                      Hide Details
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

