import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { EdzSidebar, NavView, AlbumCategory, ALBUMS } from './components/EdzSidebar';
import { EdzHomeView } from './components/EdzHomeView';
import { JustinLeHomeView } from './components/JustinLeHomeView';
import { EdzPhotoStream } from './components/EdzPhotoStream';
import { EdzAlbumsView } from './components/EdzAlbumsView';
import { EdzAlbumGridView, SportsSubCategory } from './components/EdzAlbumGridView';
import { EdzAboutView } from './components/EdzAboutView';
import { EdzVideoView } from './components/EdzVideoView';
import { EdzInstagramView } from './components/EdzInstagramView';
import { EdzContactView } from './components/EdzContactView';
import { ContentScroll } from './components/ContentScroll';
import { Lightbox } from './components/Lightbox';
import {
  loadPhotos,
  loadProfile,
  loadTimeline,
  loadVideos,
  saveInquiry,
  hydrateEncryptedInquiries,
} from './utils/storage';
import { PhotoItem, PortfolioProfile, TimelineMilestone, ContactInquiry, VideoItem } from './types';

function parseHash(hashStr: string): { view: NavView; album: AlbumCategory | null; subAlbum: string | null } {
  const clean = hashStr.replace(/^#\/?/, '').toLowerCase();
  if (!clean || clean === 'home') {
    return { view: 'home', album: null, subAlbum: null };
  }
  if (clean === 'photography') {
    return { view: 'photography', album: null, subAlbum: null };
  }
  if (clean === 'videography') {
    return { view: 'videography', album: null, subAlbum: null };
  }
  if (clean === 'instagram') {
    return { view: 'instagram', album: null, subAlbum: null };
  }
  if (clean === 'about') {
    return { view: 'about', album: null, subAlbum: null };
  }
  if (clean === 'contact') {
    return { view: 'contact', album: null, subAlbum: null };
  }
  if (clean === 'album-sports' || clean === 'sports') {
    return { view: 'album', album: 'sports', subAlbum: null };
  }
  if (clean === 'subalbum-muay-thai' || clean === 'muay-thai') {
    return { view: 'album', album: 'sports', subAlbum: 'muay-thai' };
  }
  if (clean === 'subalbum-formula-1' || clean === 'formula-1') {
    return { view: 'album', album: 'sports', subAlbum: 'formula-1' };
  }
  if (clean === 'album-stage' || clean === 'stage') {
    return { view: 'album', album: 'stage', subAlbum: null };
  }
  if (clean === 'album-events' || clean === 'events') {
    return { view: 'album', album: 'events', subAlbum: null };
  }
  return { view: 'home', album: null, subAlbum: null };
}

function getHashForRoute(view: NavView, album?: AlbumCategory | null, subAlbum?: string | null): string {
  if (view === 'home') return '#home';
  if (view === 'photography') return '#photography';
  if (view === 'videography') return '#videography';
  if (view === 'instagram') return '#instagram';
  if (view === 'about') return '#about';
  if (view === 'contact') return '#contact';
  if (view === 'album') {
    if (album === 'sports') {
      if (subAlbum === 'muay-thai') return '#subalbum-muay-thai';
      if (subAlbum === 'formula-1') return '#subalbum-formula-1';
      return '#album-sports';
    }
    if (album) return `#album-${album}`;
  }
  return '#home';
}

function updateDocumentTitle(view: NavView, album?: AlbumCategory | null, subAlbum?: string | null) {
  if (typeof document === 'undefined') return;
  const baseTitle = 'Juztin Yuen — Photography & Motion Portfolio';
  if (view === 'home') {
    document.title = baseTitle;
  } else if (view === 'photography') {
    document.title = 'Photography — Juztin Yuen';
  } else if (view === 'album') {
    if (subAlbum === 'muay-thai') document.title = 'Muay Thai — Juztin Yuen';
    else if (subAlbum === 'formula-1') document.title = 'Formula 1 — Juztin Yuen';
    else if (album === 'sports') document.title = 'Sports & Action — Juztin Yuen';
    else if (album === 'stage') document.title = 'Stage & Performance — Juztin Yuen';
    else if (album === 'events') document.title = 'Events & Publicity — Juztin Yuen';
    else document.title = 'Albums — Juztin Yuen';
  } else if (view === 'videography') {
    document.title = 'Videography — Juztin Yuen';
  } else if (view === 'instagram') {
    document.title = 'Instagram Posts — Juztin Yuen';
  } else if (view === 'about') {
    document.title = 'About — Juztin Yuen';
  } else if (view === 'contact') {
    document.title = 'Contact — Juztin Yuen';
  }
}

export default function App() {
  // State from persistence
  const [photos] = useState<PhotoItem[]>(loadPhotos);
  const [profile] = useState<PortfolioProfile>(loadProfile);
  const [timeline] = useState<TimelineMilestone[]>(loadTimeline);
  const [videos] = useState<VideoItem[]>(loadVideos);

  // Initial route from URL hash
  const initialRoute = parseHash(typeof window !== 'undefined' ? window.location.hash : '');

  // Navigation state matching edz.us with full deep linking
  const [currentView, setCurrentView] = useState<NavView>(initialRoute.view);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumCategory | null>(initialRoute.album);
  const [selectedSubAlbum, setSelectedSubAlbum] = useState<string | null>(initialRoute.subAlbum);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Modal states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Hydrate encrypted client inquiries on mount
  useEffect(() => {
    hydrateEncryptedInquiries();
  }, []);

  // Listen to browser hash changes & history navigation (Back / Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash(window.location.hash);
      setCurrentView(route.view);
      setSelectedAlbum(route.album);
      setSelectedSubAlbum(route.subAlbum);
      updateDocumentTitle(route.view, route.album, route.subAlbum);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Initial page title sync
    updateDocumentTitle(initialRoute.view, initialRoute.album, initialRoute.subAlbum);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Show "Back to Top" floating pill on long scrolls
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewInquiry = (inquiry: ContactInquiry) => {
    saveInquiry(inquiry);
  };

  // Navigation handler with browser history & URL hash synchronization
  const handleNavigate = (view: NavView, album?: AlbumCategory, subAlbum?: string) => {
    setCurrentView(view);
    if (view === 'album' && album) {
      setSelectedAlbum(album);
      setSelectedSubAlbum(subAlbum || null);
    } else if (view === 'photography') {
      setSelectedAlbum(null);
      setSelectedSubAlbum(null);
    } else {
      setSelectedSubAlbum(null);
    }

    const targetHash = getHashForRoute(view, album, subAlbum);
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }

    updateDocumentTitle(view, album, subAlbum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select photo to open Lightbox
  const handleSelectPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  // Scroll to previous / next artwork on edz.us
  const handleScrollArtwork = (direction: 'up' | 'down') => {
    const photoElements = Array.from(document.querySelectorAll('article.list_item'));
    if (photoElements.length === 0) {
      window.scrollBy({
        top: direction === 'down' ? 500 : -500,
        behavior: 'smooth',
      });
      return;
    }

    const scrollY = window.scrollY;
    const threshold = 50;

    if (direction === 'down') {
      const nextElement = photoElements.find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top > threshold;
      });
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollBy({ top: 400, behavior: 'smooth' });
      }
    } else {
      const prevElements = photoElements.filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < -threshold;
      });
      if (prevElements.length > 0) {
        const prevElement = prevElements[prevElements.length - 1];
        prevElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Active photos depending on view
  let displayedPhotos: PhotoItem[] = photos;
  let activeAlbumMeta = null;

  if (currentView === 'album' && selectedAlbum) {
    if (selectedSubAlbum) {
      // Sub-tab: only photos tagged with this subCategory
      displayedPhotos = photos.filter((p) => p.subCategory === selectedSubAlbum);
    } else {
      // Main tab: photos for this category, excluding subTabOnly photos
      displayedPhotos = photos.filter((p) => p.category === selectedAlbum && !p.subTabOnly);
    }
    activeAlbumMeta = ALBUMS.find((a) => a.id === selectedAlbum);
  }


  return (
    <div className="min-h-screen bg-white text-[#666666] font-sans antialiased selection:bg-black selection:text-white">
      {/* Accessible Skip to Content Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:bg-black focus:text-white focus:text-[11px] focus:font-mono focus:uppercase focus:tracking-wider focus:shadow-lg focus:outline-none"
      >
        Skip to Content
      </a>

      {/* Madison / edz.us Fixed Left Sidebar */}
      <EdzSidebar
        profile={profile}
        currentView={currentView}
        selectedAlbum={selectedAlbum}
        selectedSubAlbum={selectedSubAlbum}
        onNavigate={handleNavigate}
        onScrollPrevious={() => handleScrollArtwork('up')}
        onScrollNext={() => handleScrollArtwork('down')}
      />

      {/* Main Canvas Area (#main matching edz.us) */}
      <main
        id="main"
        className="md:ml-[250px] min-h-screen pt-20 md:pt-[50px] px-6 md:px-10 lg:px-12 pb-20 max-w-[1600px]"
      >
        <div id="main_wrap" className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentView}-${selectedAlbum || 'all'}-${selectedSubAlbum || 'none'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {/* 1. Home View: JustinLe Card Reveal, Highlight Carousel, Logos & Action Cards */}
              {currentView === 'home' && (
                <JustinLeHomeView
                  currentView={currentView}
                  onNavigate={handleNavigate}
                  photos={photos}
                />
              )}

              {/* 2. Photography View: Full photo stream */}
              {currentView === 'photography' && !selectedAlbum && (
                <EdzPhotoStream
                  photos={photos}
                  onSelectPhoto={handleSelectPhoto}
                />
              )}

              {/* 3a. Main Album View: Reverted back to sequential photo stream */}
              {currentView === 'album' && selectedAlbum && !selectedSubAlbum && (
                <div className="space-y-6">
                  {/* Header with breadcrumbs and sub-tabs for Sports */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-8 gap-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#888888] font-mono">
                      <button
                        type="button"
                        onClick={() => handleNavigate('photography')}
                        className="hover:text-black cursor-pointer underline transition-colors"
                      >
                        Photography
                      </button>
                      <span>/</span>
                      <span className="text-black font-semibold">
                        {activeAlbumMeta?.label || selectedAlbum}
                      </span>
                    </div>

                    {/* Sub-tab shortcuts if in Sports & Action */}
                    {selectedAlbum === 'sports' && (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-[#aaaaaa] text-[10px] uppercase">Sub-tabs:</span>
                        <button
                          type="button"
                          onClick={() => handleNavigate('album', 'sports', 'muay-thai')}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-gray-100 hover:bg-black hover:text-white transition-all cursor-pointer"
                        >
                          Muay Thai
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNavigate('album', 'sports', 'formula-1')}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-gray-100 hover:bg-black hover:text-white transition-all cursor-pointer"
                        >
                          Formula 1
                        </button>
                      </div>
                    )}
                  </div>

                  <EdzPhotoStream
                    photos={displayedPhotos}
                    onSelectPhoto={(idx) => {
                      const globalIdx = photos.findIndex((p) => p.id === displayedPhotos[idx].id);
                      handleSelectPhoto(globalIdx !== -1 ? globalIdx : idx);
                    }}
                    title={activeAlbumMeta?.label}
                    subtitle={`${displayedPhotos.length} Photos · ${activeAlbumMeta?.countDesc || ''}`}
                  />
                </div>
              )}

              {/* 3b. Sub-Tab Album View: Displayed in the new edz.us 3-column masonry format */}
              {currentView === 'album' && selectedAlbum && selectedSubAlbum && (
                <EdzAlbumGridView
                  photos={displayedPhotos}
                  currentAlbum={selectedAlbum}
                  selectedSubAlbum={selectedSubAlbum}
                  onSelectPhoto={(idx) => {
                    const globalIdx = photos.findIndex((p) => p.id === displayedPhotos[idx].id);
                    handleSelectPhoto(globalIdx !== -1 ? globalIdx : idx);
                  }}
                  onNavigateBack={() => handleNavigate('album', selectedAlbum)}
                  onSelectSubAlbum={(sub) => {
                    if (sub === 'all') {
                      handleNavigate('album', selectedAlbum);
                    } else {
                      handleNavigate('album', selectedAlbum, sub);
                    }
                  }}
                />
              )}

              {/* 4. Videography View */}
              {currentView === 'videography' && (
                <EdzVideoView videos={videos} />
              )}

              {/* 4b. Instagram Posts View */}
              {currentView === 'instagram' && (
                <EdzInstagramView />
              )}

              {/* 5. About View matching edz.us/pages/about/ */}
              {currentView === 'about' && (
                <EdzAboutView
                  profile={profile}
                  timeline={timeline}
                  onNavigateToContact={() => handleNavigate('contact')}
                />
              )}

              {/* 6. Contact View matching edz.us contact form */}
              {currentView === 'contact' && (
                <EdzContactView
                  profile={profile}
                  onSubmitInquiry={handleNewInquiry}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Back to Top Pill */}
      <AnimatePresence>
        {showBackToTop && currentView !== 'home' && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 px-3.5 py-2 bg-white/95 hover:bg-black text-zinc-700 hover:text-white border border-zinc-200/90 shadow-md backdrop-blur-md rounded-full text-[10.5px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer select-none"
            title="Scroll to Top"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* High-Resolution Lightbox */}
      <Lightbox
        photos={photos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setCurrentPhotoIndex(newIdx)}
      />
    </div>
  );
}
