import React, { useState } from 'react';
import {
  Grid,
  LayoutGrid,
  Columns,
  Camera,
  Eye,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';

interface GalleryProps {
  photos: PhotoItem[];
  onSelectPhoto: (index: number) => void;
  onOpenStudio: () => void;
}

type CategoryFilter = 'all' | 'sports' | 'stage' | 'events' | 'leadership';
type ViewLayout = 'bento' | 'grid' | 'filmstrip';

export const Gallery: React.FC<GalleryProps> = ({
  photos,
  onSelectPhoto,
  onOpenStudio,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('bento');

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Works' },
    { id: 'sports', label: 'Sports & Action' },
    { id: 'stage', label: 'Stage & Performance' },
    { id: 'events', label: 'Events & Publicity' },
    { id: 'leadership', label: 'Cadet Leadership' },
  ];

  const filteredPhotos =
    activeCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <section id="gallery" className="py-28 lg:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header with smooth entrance */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8 pb-8 border-b border-white/[0.06]"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Curated Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f5f5f7]">
            Visual Highlights
          </h2>
          <p className="text-[#86868b] text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
            Freezing split-second kinetic energy in high-speed sports, dramatic stagecraft, and high-impact unit events.
          </p>
        </div>

        {/* View Layout Switcher & Add Action */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center p-1 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewLayout('bento')}
              className={`p-2.5 rounded-xl text-xs transition-colors ${
                viewLayout === 'bento'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#86868b] hover:text-[#d1d1d6]'
              }`}
              title="Editorial Bento Layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewLayout('grid')}
              className={`p-2.5 rounded-xl text-xs transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#86868b] hover:text-[#d1d1d6]'
              }`}
              title="Uniform Precision Grid"
            >
              <Grid className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewLayout('filmstrip')}
              className={`p-2.5 rounded-xl text-xs transition-colors ${
                viewLayout === 'filmstrip'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#86868b] hover:text-[#d1d1d6]'
              }`}
              title="Large Cinematic Filmstrip"
            >
              <Columns className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenStudio}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-[#e5e5ea] border border-white/10 transition-all shadow-sm"
            title="Add a new photograph to this gallery"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Add Photo</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Tabs with animated sliding pill */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-12 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const count =
            cat.id === 'all'
              ? photos.length
              : photos.filter((p) => p.category === cat.id).length;

          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="relative px-4 py-2 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-colors flex items-center gap-2 z-10 focus:outline-none"
            >
              {isActive && (
                <motion.span
                  layoutId="activeFilterPill"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-[#f5f5f7] shadow-lg shadow-white/10"
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-[#070708] font-bold' : 'text-[#a1a1a6] hover:text-white'
                }`}
              >
                {cat.label}
              </span>
              <span
                className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                  isActive ? 'bg-black/15 text-black font-semibold' : 'bg-white/10 text-[#86868b]'
                }`}
              >
                {count}
              </span>
              {!isActive && (
                <span className="absolute inset-0 rounded-full bg-white/[0.03] border border-white/[0.05] -z-10 hover:bg-white/[0.06] transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 rounded-3xl bg-white/[0.02] border border-white/[0.06]"
        >
          <Camera className="w-10 h-10 text-[#52525b] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#d1d1d6]">No photographs found</h3>
          <p className="text-xs text-[#86868b] mt-1">There are no photos in this category yet.</p>
          <button
            onClick={onOpenStudio}
            className="mt-4 px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#ececf0] transition-colors"
          >
            Add Photo Now
          </button>
        </motion.div>
      )}

      {/* Gallery Layout Variations with layout animation */}
      <AnimatePresence mode="popLayout">
        {viewLayout === 'bento' && (
          <motion.div
            layout
            key="bento-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredPhotos.map((photo, idx) => {
              const originalIndex = photos.findIndex((p) => p.id === photo.id);
              const isFeatured = photo.featured && idx % 4 === 0;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 10 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  key={photo.id}
                  onClick={() => onSelectPhoto(originalIndex)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-[#121214] border border-white/[0.08] transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/90 ${
                    isFeatured ? 'sm:col-span-2 lg:col-span-2 aspect-[16/10]' : 'aspect-[4/3]'
                  }`}
                >
                  {/* Ultra-Fast Image with Lazy Loading */}
                  <img
                    src={photo.thumbnailSrc || photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle Apple-style Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Top badges */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
                      {photo.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Bottom Card Information */}
                  <div className="absolute bottom-0 inset-x-0 p-6 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#f5f5f7] group-hover:text-white line-clamp-1">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#a1a1a6]">
                      {photo.date ? (
                        <>
                          <span>{photo.date}</span>
                          <span className="text-white/20">•</span>
                        </>
                      ) : null}
                      <span className="truncate">{photo.clientOrProject}</span>
                    </div>

                    {/* Technical EXIF strip */}
                    {photo.cameraInfo && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 font-mono text-[11px] text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span>{photo.cameraInfo.shutter || '1/1000s'}</span>
                        <span>·</span>
                        <span>{photo.cameraInfo.aperture || 'f/2.8'}</span>
                        <span>·</span>
                        <span>{photo.cameraInfo.iso || 'ISO 800'}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {viewLayout === 'grid' && (
          <motion.div
            layout
            key="precision-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredPhotos.map((photo) => {
              const originalIndex = photos.findIndex((p) => p.id === photo.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  key={photo.id}
                  onClick={() => onSelectPhoto(originalIndex)}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#121214] border border-white/[0.08] aspect-square transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/90"
                >
                  <img
                    src={photo.thumbnailSrc || photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-50 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-5 left-5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
                      {photo.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <h3 className="text-base font-bold text-white truncate">{photo.title}</h3>
                    {photo.clientOrProject && (
                      <p className="text-xs text-[#a1a1a6] mt-1 truncate">{photo.clientOrProject}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {viewLayout === 'filmstrip' && (
          <motion.div layout key="filmstrip-view" className="space-y-12">
            {filteredPhotos.map((photo) => {
              const originalIndex = photos.findIndex((p) => p.id === photo.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  key={photo.id}
                  onClick={() => onSelectPhoto(originalIndex)}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#121214] border border-white/[0.08] transition-all duration-300 hover:border-white/20 hover:shadow-2xl"
                >
                  <div className="relative aspect-[21/9] sm:aspect-[21/10] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      <div className="max-w-2xl">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          {photo.category}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
                          {photo.title}
                        </h3>
                      </div>

                      <div className="shrink-0 flex items-center gap-4">
                        <div className="text-right hidden sm:block text-xs font-mono text-[#86868b]">
                          <div>{photo.cameraInfo?.camera}</div>
                          <div>{photo.cameraInfo?.lens}</div>
                        </div>
                        <div className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold flex items-center gap-2 group-hover:bg-[#ececf0] transition-colors shadow-lg">
                          <span>Inspect Shot</span>
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

