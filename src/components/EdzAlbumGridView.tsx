import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';
import { AlbumCategory, ALBUMS } from './EdzSidebar';
import { ProgressiveImage } from './ProgressiveImage';

export type SportsSubCategory = 'all' | 'muay-thai' | 'formula-1';

interface EdzAlbumGridViewProps {
  photos: PhotoItem[];
  currentAlbum: AlbumCategory;
  selectedSubAlbum?: string | null;
  onSelectPhoto?: (index: number) => void;
  onNavigateBack: () => void;
  onSelectSubAlbum?: (sub: SportsSubCategory) => void;
}

interface AlbumGridItemProps {
  photo: PhotoItem;
  index: number;
  onSelect: (index: number) => void;
}

const AlbumGridItem = React.memo<AlbumGridItemProps>(({ photo, index, onSelect }) => (
  <figure
    onClick={() => onSelect(index)}
    className="kpgriditem group cursor-pointer block"
  >
    {/* Image Frame with natural aspect ratio & #f4f4f4 frame */}
    <div className="bg-[#f4f4f4] overflow-hidden relative">
      <ProgressiveImage
        src={photo.thumbnailSrc || photo.src}
        thumbnailSrc={photo.thumbnailSrc}
        alt={photo.title}
        loading={index < 6 ? 'eager' : 'lazy'}
        decoding="async"
        className="w-full h-auto block object-cover group-hover:opacity-90 transition-opacity duration-300"
      />

      {/* "CLICK TO VIEW" badge at bottom left on hover */}
      <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-10">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-black border border-black/10 px-2.5 py-1 text-[9.5px] tracking-wider uppercase font-semibold shadow-sm block select-none">
          Click to View
        </span>
      </div>
    </div>
  </figure>
));

const EdzAlbumGridViewComponent: React.FC<EdzAlbumGridViewProps> = ({
  photos,
  currentAlbum,
  selectedSubAlbum,
  onNavigateBack,
  onSelectSubAlbum,
}) => {
  const [enlargedIndex, setEnlargedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const albumMeta = ALBUMS.find((a) => a.id === currentAlbum);

  // Keyboard navigation for enlarged modal viewer
  useEffect(() => {
    if (enlargedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEnlargedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setEnlargedIndex((prev) =>
          prev !== null && prev < photos.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setEnlargedIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : photos.length - 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedIndex, photos.length]);

  // Lock body scroll when enlarged modal is active
  useEffect(() => {
    if (enlargedIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [enlargedIndex]);

  // Touch swipe gestures for mobile modal
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || enlargedIndex === null) return;
    const touchEndX = e.changedTouches[0]?.clientX;
    if (touchEndX !== undefined) {
      const deltaX = touchEndX - touchStartX;
      if (deltaX > 45) {
        // Swiped right -> previous
        setEnlargedIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : photos.length - 1
        );
      } else if (deltaX < -45) {
        // Swiped left -> next
        setEnlargedIndex((prev) =>
          prev !== null && prev < photos.length - 1 ? prev + 1 : 0
        );
      }
    }
    setTouchStartX(null);
  };

  // Compute title based on subAlbum
  let displayTitle = albumMeta?.label || 'Album';

  if (currentAlbum === 'sports') {
    if (selectedSubAlbum === 'muay-thai') {
      displayTitle = 'Muay Thai';
    } else if (selectedSubAlbum === 'formula-1') {
      displayTitle = 'Formula 1';
    } else {
      displayTitle = 'Sports & Action';
    }
  }

  return (
    <div className="w-full">
      {/* Editorial Header matching edz.us/albums/france-on-tri-x/ */}
      <header className="mb-6">
        <h1 className="font-schoolbell text-[28px] sm:text-[34px] md:text-[38px] text-[#1a1a1a] tracking-normal select-none -mb-1">
          {displayTitle}
        </h1>

        {/* Mobile Sub-tabs Switcher for Sports & Action */}
        {currentAlbum === 'sports' && (
          <div className="md:hidden flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-[10.5px] uppercase tracking-wider font-sans">
            <button
              type="button"
              onClick={() => onSelectSubAlbum && onSelectSubAlbum('all')}
              className={`px-2.5 py-1 border transition-all cursor-pointer ${
                !selectedSubAlbum || selectedSubAlbum === 'all'
                  ? 'bg-black text-white border-black font-semibold shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'
              }`}
            >
              All Sports
            </button>
            <button
              type="button"
              onClick={() => onSelectSubAlbum && onSelectSubAlbum('muay-thai')}
              className={`px-2.5 py-1 border transition-all cursor-pointer ${
                selectedSubAlbum === 'muay-thai'
                  ? 'bg-black text-white border-black font-semibold shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'
              }`}
            >
              Muay Thai
            </button>
            <button
              type="button"
              onClick={() => onSelectSubAlbum && onSelectSubAlbum('formula-1')}
              className={`px-2.5 py-1 border transition-all cursor-pointer ${
                selectedSubAlbum === 'formula-1'
                  ? 'bg-black text-white border-black font-semibold shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'
              }`}
            >
              Formula 1
            </button>
          </div>
        )}
      </header>

      {/* 3-Column Grid matching edz.us/albums/france-on-tri-x/ (#kpgrid) */}
      {photos.length > 0 ? (
        <div
          id="kpgrid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] items-start w-full"
        >
          {photos.map((photo, index) => (
            <AlbumGridItem
              key={photo.id}
              photo={photo}
              index={index}
              onSelect={setEnlargedIndex}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-xs uppercase tracking-wider text-[#888888] font-mono border border-dashed border-gray-200">
          No photographs in this collection yet.
        </div>
      )}

      {/* Sub-Tab Enlargement Modal: Pure Image View with Number Counter Below (White Background) */}
      <AnimatePresence>
        {enlargedIndex !== null && photos[enlargedIndex] && (
          <motion.div
            key="subalbum-enlarged-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            id="subalbum-enlarged-modal"
            className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl flex flex-col justify-between items-center p-4 sm:p-6 select-none"
            onClick={() => setEnlargedIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar: Minimal Close Button */}
            <div className="w-full flex justify-end items-center z-20">
              <button
                type="button"
                id="subalbum-modal-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedIndex(null);
                }}
                className="p-2.5 rounded-full text-zinc-500 hover:text-black hover:bg-black/5 transition-all cursor-pointer"
                aria-label="Close enlarged view"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Stage: Enlarged Image */}
            <div
              className="relative flex-1 w-full flex items-center justify-center min-h-0 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative inline-flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photos[enlargedIndex].id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    src={photos[enlargedIndex].src}
                    alt=""
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className="max-h-[82vh] max-w-[92vw] object-contain select-none shadow-xl border border-black/5 pointer-events-none"
                    style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
                  />
                </AnimatePresence>

                {/* Subtle Copyright Watermark */}
                <div className="absolute bottom-3 right-4 pointer-events-none z-15 select-none opacity-65">
                  <div className="bg-black/45 backdrop-blur-[2px] px-2.5 py-1 rounded-[3px] text-[10px] font-mono tracking-widest text-white/95 border border-white/15 drop-shadow-md uppercase">
                    &copy; Juztin Yuen
                  </div>
                </div>

                {/* Protective Shield Overlay */}
                <div
                  className="photo-shield absolute inset-0 z-20 pointer-events-auto"
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

            {/* Bottom Bar: Number of picture in the tab ONLY */}
            <div
              className="py-3 text-center z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                id="subalbum-modal-counter"
                className="text-xs font-mono tracking-widest text-zinc-700 select-none px-4 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-200 shadow-sm"
              >
                {enlargedIndex + 1} / {photos.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const EdzAlbumGridView = React.memo(EdzAlbumGridViewComponent);
