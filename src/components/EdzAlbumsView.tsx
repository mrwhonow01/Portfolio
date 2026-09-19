import React from 'react';
import { PhotoItem } from '../types';
import { ALBUMS, AlbumCategory } from './EdzSidebar';

interface EdzAlbumsViewProps {
  photos: PhotoItem[];
  onSelectAlbum: (albumId: AlbumCategory) => void;
}

export const EdzAlbumsView: React.FC<EdzAlbumsViewProps> = ({
  photos,
  onSelectAlbum,
}) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <header className="mb-10 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-black uppercase tracking-tight">
          Photography
        </h1>
        <p className="text-xs text-[#888888] uppercase tracking-wider mt-1">
          Collections & Photo Albums
        </p>
      </header>

      {/* Album Grid matching edz.us #kpgrid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {ALBUMS.map((album) => {
          const albumPhotos = photos.filter((p) => p.category === album.id);
          const coverPhoto = albumPhotos[0] || photos[0];
          const count = albumPhotos.length;

          return (
            <figure
              key={album.id}
              onClick={() => onSelectAlbum(album.id)}
              className="group cursor-pointer"
            >
              {/* Cover thumbnail frame */}
              <div className="bg-[#f4f4f4] aspect-[4/3] overflow-hidden relative">
                {coverPhoto && (
                  <img
                    src={coverPhoto.thumbnailSrc || coverPhoto.src}
                    alt={album.label}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>

              {/* Caption */}
              <figcaption className="mt-3.5">
                <h3 className="text-[15px] font-bold text-black group-hover:underline">
                  {album.label}
                </h3>
                <p className="text-[11px] text-[#aaaaaa] uppercase tracking-wider mt-1">
                  {count} {count === 1 ? 'Photo' : 'Photos'} · {album.countDesc}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
};
