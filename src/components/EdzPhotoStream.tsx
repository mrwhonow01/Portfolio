import React, { useState } from 'react';
import { Share2, Check, ZoomIn } from 'lucide-react';
import { motion } from 'motion/react';
import { PhotoItem } from '../types';
import { ProgressiveImage } from './ProgressiveImage';

interface EdzPhotoStreamProps {
  photos: PhotoItem[];
  onSelectPhoto: (index: number) => void;
  title?: string;
  subtitle?: string;
}

export const EdzPhotoStream: React.FC<EdzPhotoStreamProps> = ({
  photos,
  onSelectPhoto,
  title,
  subtitle,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (photo: PhotoItem, platform: 'copy' | 'twitter' | 'pinterest') => {
    const url = window.location.href;
    const text = `${photo.title} — Photography by Juztin Yuen`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedId(photo.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else if (platform === 'pinterest') {
      window.open(
        `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(photo.src)}&description=${encodeURIComponent(text)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      {/* Optional Album or Section Header */}
      {title && (
        <header className="mb-8 pb-3 border-b border-gray-100">
          <h1 className="font-schoolbell text-[30px] sm:text-[36px] md:text-[40px] text-[#1a1a1a] tracking-normal select-none -mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#888888] uppercase tracking-wider mt-1">
              {subtitle}
            </p>
          )}
        </header>
      )}

      {/* List of Photos matching edz.us */}
      <div className="space-y-20 md:space-y-24">
        {photos.map((photo, index) => {
          const exif = photo.cameraInfo;
          const exifParts: string[] = [];
          if (exif.camera) exifParts.push(exif.camera);
          if (exif.lens) exifParts.push(exif.lens);
          if (exif.aperture) exifParts.push(exif.aperture);
          if (exif.shutter) exifParts.push(exif.shutter);
          if (exif.iso) exifParts.push(`ISO ${exif.iso}`);
          if (exif.focalLength) exifParts.push(exif.focalLength);
          if (photo.date) exifParts.push(photo.date);

          return (
            <article
              key={photo.id}
              id={`photo-${index}`}
              className="list_item group relative"
            >
              {/* Image Frame with Madison style background frame */}
              <div className="item_media relative">
                <div
                  onClick={() => onSelectPhoto(index)}
                  className="imgframe block relative bg-[#f4f4f4] cursor-pointer overflow-hidden transition-all duration-300"
                >
                  <ProgressiveImage
                    src={photo.src}
                    alt={photo.title}
                    thumbnailSrc={photo.thumbnailSrc}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    className="w-full h-auto max-h-[820px] object-contain mx-auto block select-none"
                  />

                  {/* "CLICK TO VIEW" badge at bottom left on hover */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 pointer-events-none z-10">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-black border border-black/10 px-3 py-1.5 text-[10px] tracking-wider uppercase font-semibold shadow-sm block select-none">
                      Click to View
                    </span>
                  </div>
                </div>
              </div>

              {/* Caption & EXIF metadata */}
              <figcaption className="cap_width mt-4 max-w-3xl">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[16px] font-bold text-black leading-snug">
                    <button
                      type="button"
                      onClick={() => onSelectPhoto(index)}
                      className="hover:underline text-left cursor-pointer"
                    >
                      {photo.title}
                    </button>
                  </h3>

                  {/* Share button / controls */}
                  <div className="flex items-center gap-2 text-[11px] text-[#aaaaaa]">
                    <button
                      type="button"
                      onClick={() => handleShare(photo, 'copy')}
                      className="hover:text-black transition-colors"
                      title="Copy share link"
                    >
                      {copiedId === photo.id ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-mono text-[10px]">
                          <Check className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        <span className="text-[11px] uppercase tracking-wider">Share</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* EXIF list */}
                {exifParts.length > 0 && (
                  <div className="media-meta text-[11px] text-[#aaaaaa] mt-1.5 flex flex-wrap items-center gap-x-2.5 font-normal">
                    {exifParts.map((part, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-gray-300">·</span>}
                        <span>{part}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Short photo description */}
                {photo.story && (
                  <p className="text-[12px] text-[#777777] leading-relaxed mt-2 font-normal">
                    {photo.story}
                  </p>
                )}
              </figcaption>
            </article>
          );
        })}
      </div>
    </div>
  );
};
