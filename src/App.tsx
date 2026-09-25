import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
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
import { MobileNextPageCue } from './components/MobileNextPageCue';
import { MobilePrevPageCue } from './components/MobilePrevPageCue';
import { PhotoProtectionNotice } from './components/PhotoProtectionNotice';
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

interface MobileRouteInfo {
  view: NavView;
  album?: AlbumCategory;
  subAlbum?: string;
  title: string;
  subtitle: string;
  pageNumber: number;
}

// Sequential mobile page chain: Home (1) -> Photography (2) -> Videography (3) -> Instagram (4) -> About (5) -> Contact (6)
function getNextMobileRoute(currentView: NavView): MobileRouteInfo | null {
  if (currentView === 'home') {
    return {
      view: 'photography',
      title: 'Photography',
      subtitle: 'Explore photo collections & ringside sports',
      pageNumber: 2,
    };
  }
  if (currentView === 'photography' || currentView === 'album') {
    return {
      view: 'videography',
      title: 'Videography',
      subtitle: 'Watch documentary films & event reels',
      pageNumber: 3,
    };
  }
  if (currentView === 'videography') {
    return {
      view: 'instagram',
      title: 'Instagram',
      subtitle: 'View social highlights & featured stories',
      pageNumber: 4,
    };
  }
  if (currentView === 'instagram') {
    return {
      view: 'about',
      title: 'About',
      subtitle: 'Read biography, credentials & equipment',
      pageNumber: 5,
    };
  }
  if (currentView === 'about') {
    return {
      view: 'contact',
      title: 'Contact',
      subtitle: 'Get in touch for inquiries & bookings',
      pageNumber: 6,
    };
  }
  return null; // contact is the final page
}

function getPrevMobileRoute(
  currentView: NavView,
  selectedAlbum?: AlbumCategory | null,
  selectedSubAlbum?: string | null
): MobileRouteInfo | null {
  // If inside a sub-album (like Muay Thai), go back to main album overview
  if (currentView === 'album' && selectedSubAlbum) {
    return {
      view: 'album',
      album: selectedAlbum || undefined,
      title: 'Album Overview',
      subtitle: 'Return to album overview',
      pageNumber: 2,
    };
  }

  // If inside an album (Sports, Stage, Events), go back to Photography
  if (currentView === 'album') {
    return {
      view: 'photography',
      title: 'Photography',
      subtitle: 'Return to photography gallery',
      pageNumber: 2,
    };
  }

  // If on main Photography tab, go back to Home
  if (currentView === 'photography') {
    return {
      view: 'home',
      title: 'Home',
      subtitle: 'Return to home highlights',
      pageNumber: 1,
    };
  }

  // If on Videography, go back to Photography (never directly home)
  if (currentView === 'videography') {
    return {
      view: 'photography',
      title: 'Photography',
      subtitle: 'Return to photography gallery',
      pageNumber: 2,
    };
  }

  // If on Instagram, go back to Videography
  if (currentView === 'instagram') {
    return {
      view: 'videography',
      title: 'Videography',
      subtitle: 'Return to video reel',
      pageNumber: 3,
    };
  }

  // If on About, go back to Instagram
  if (currentView === 'about') {
    return {
      view: 'instagram',
      title: 'Instagram',
      subtitle: 'Return to social media posts',
      pageNumber: 4,
    };
  }

  // If on Contact, go back to About
  if (currentView === 'contact') {
    return {
      view: 'about',
      title: 'About',
      subtitle: 'Return to credentials & about section',
      pageNumber: 5,
    };
  }

  return null; // Home is the first page
}

const pageVariants: Variants = {
  initial: (direction: 'next' | 'prev' | 'standard') => ({
    opacity: 0,
    y: direction === 'next' ? 44 : direction === 'prev' ? -44 : 8,
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: (direction: 'next' | 'prev' | 'standard') => ({
    opacity: 0,
    y: direction === 'next' ? -32 : direction === 'prev' ? 32 : -8,
    transition: {
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

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

  // Mobile detection for mobile-only sequential scroll progression
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | 'standard'>('standard');
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    let timeoutId: number | null = null;
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };
    const debouncedCheck = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkMobile, 120);
    };
    checkMobile();
    window.addEventListener('resize', debouncedCheck, { passive: true });
    window.addEventListener('orientationchange', checkMobile, { passive: true });
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheck);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Image Protection & Anti-Inspect Security System
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'CANVAS' ||
        target.tagName === 'VIDEO' ||
        target.classList.contains('photo-shield') ||
        target.closest('.photo-shield') ||
        target.closest('.imgframe') ||
        target.closest('#portfolio-lightbox') ||
        target.closest('#subalbum-enlarged-modal') ||
        target.closest('#instagram-enlarged-modal')
      ) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('photo-protection-alert'));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('photo-protection-alert'));
        return;
      }

      // Ctrl/Cmd + Shift + I (Inspect)
      // Ctrl/Cmd + Shift + C (Inspect Element tool)
      // Ctrl/Cmd + Shift + J (Console)
      if (
        modifier &&
        e.shiftKey &&
        (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')
      ) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('photo-protection-alert'));
        return;
      }

      // Ctrl/Cmd + U (View Source)
      if (modifier && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('photo-protection-alert'));
        return;
      }

      // Ctrl/Cmd + S (Save Page)
      if (modifier && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('photo-protection-alert'));
        return;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    // DevTools Console Warning Banner
    if (typeof console !== 'undefined') {
      console.log(
        '%c⚠️ RESTRICTED MEDIA',
        'color: #e11d48; font-size: 20px; font-weight: bold; font-family: sans-serif;'
      );
      console.log(
        '%cAll photographic works on this website are protected by copyright laws (© Juztin Yuen). Extracting, hotlinking, or downloading without prior written consent is strictly prohibited.',
        'font-size: 12px; color: #777; font-family: sans-serif;'
      );
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Modal states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Track whether the user has scrolled past the hero cards on the home page
  const [isPastHeroCards, setIsPastHeroCards] = useState(false);

  useEffect(() => {
    if (currentView !== 'home') {
      setIsPastHeroCards(false);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const threshold = Math.max(280, window.innerHeight * 0.35);
          const past = window.scrollY > threshold;
          setIsPastHeroCards((prev) => (prev !== past ? past : prev));
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

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


  const handleNewInquiry = (inquiry: ContactInquiry) => {
    saveInquiry(inquiry);
  };

  // Navigation handler with browser history & URL hash synchronization
  const handleNavigate = (view: NavView, album?: AlbumCategory, subAlbum?: string, isNextAdvance = false) => {
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

    if (!isNextAdvance) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextMobileRoute = isMobile ? getNextMobileRoute(currentView) : null;
  const prevMobileRoute = isMobile ? getPrevMobileRoute(currentView, selectedAlbum, selectedSubAlbum) : null;

  // Mobile pull-to-advance and pull-to-return confirmation feedback state
  const [pullFeedback, setPullFeedback] = useState<{
    direction: 'next' | 'prev';
    progress: number;
    isConfirmed: boolean;
    targetTitle: string;
  } | null>(null);

  const pullConfirmedRef = useRef(false);
  const activePullDirectionRef = useRef<'next' | 'prev' | null>(null);

  const triggerMobileAdvance = () => {
    if (isTransitioningRef.current) return;
    const next = getNextMobileRoute(currentView);
    if (!next) return;

    isTransitioningRef.current = true;
    setPullFeedback(null);
    pullConfirmedRef.current = false;
    activePullDirectionRef.current = null;
    setTransitionDirection('next');
    handleNavigate(next.view, next.album, next.subAlbum, false);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch { /* ignore */ }
    }

    setTimeout(() => {
      isTransitioningRef.current = false;
      setTransitionDirection('standard');
    }, 900);
  };

  const triggerMobileBack = () => {
    if (isTransitioningRef.current) return;
    const prev = getPrevMobileRoute(currentView, selectedAlbum, selectedSubAlbum);
    if (!prev) return;

    isTransitioningRef.current = true;
    setPullFeedback(null);
    pullConfirmedRef.current = false;
    activePullDirectionRef.current = null;
    setTransitionDirection('prev');
    handleNavigate(prev.view, prev.album, prev.subAlbum, false);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch { /* ignore */ }
    }

    setTimeout(() => {
      isTransitioningRef.current = false;
      setTransitionDirection('standard');
    }, 900);
  };

  // Mobile-only: Detect scrolling to the end (next page) or scrolling to top (previous page)
  // Requires pulling further beyond edge (confirm threshold ~70px) and releasing to confirm!
  useEffect(() => {
    if (!isMobile) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let isAtBottom = false;
    let isAtTop = false;
    let cachedDocHeight = 0;
    let cachedWinHeight = 0;
    let accumulatedWheelDelta = 0;
    let wheelTimer: number | null = null;

    const measureDimensions = () => {
      cachedWinHeight = window.innerHeight;
      cachedDocHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    };

    const checkIsAtBottom = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      return scrollY + cachedWinHeight >= cachedDocHeight - 20;
    };

    const checkIsAtTop = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      return scrollY <= 10;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || isTransitioningRef.current) {
        setPullFeedback(null);
        activePullDirectionRef.current = null;
        pullConfirmedRef.current = false;
        return;
      }
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      measureDimensions();
      isAtBottom = checkIsAtBottom();
      isAtTop = checkIsAtTop();
      pullConfirmedRef.current = false;
      activePullDirectionRef.current = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || isTransitioningRef.current) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY - currentY;
      const deltaX = Math.abs(currentX - touchStartX);

      // If user is predominantly swiping horizontally, cancel vertical pull intent
      if (deltaX > Math.abs(deltaY) && Math.abs(deltaY) < 30) {
        if (activePullDirectionRef.current) {
          activePullDirectionRef.current = null;
          pullConfirmedRef.current = false;
          setPullFeedback(null);
        }
        return;
      }

      // Check current scroll position in case user scrolled to edge during this drag
      if (!isAtBottom && deltaY > 0 && checkIsAtBottom()) {
        isAtBottom = true;
        touchStartY = currentY;
        return;
      }
      if (!isAtTop && deltaY < 0 && checkIsAtTop()) {
        isAtTop = true;
        touchStartY = currentY;
        return;
      }

      // 1. Pulling UP at the bottom (intent to advance to next tab / scroll down)
      // Configured to be smooth, natural and easy to browse forward (threshold ~55px)
      if (isAtBottom && deltaY > 12) {
        const next = getNextMobileRoute(currentView);
        if (next) {
          activePullDirectionRef.current = 'next';
          const pullDist = deltaY - 12;
          const progress = Math.min(1, Math.max(0, pullDist / 55));
          const isConfirmed = progress >= 1;

          if (isConfirmed && !pullConfirmedRef.current) {
            pullConfirmedRef.current = true;
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(15); } catch { /* ignore */ }
            }
          } else if (!isConfirmed) {
            pullConfirmedRef.current = false;
          }

          setPullFeedback({
            direction: 'next',
            progress,
            isConfirmed,
            targetTitle: next.title,
          });
          return;
        }
      }

      // 2. Pulling DOWN at the top (intent to return to previous tab / scroll up)
      // Configured to be substantially harder and more weighted (deadzone 30px, threshold 120px, total ~150px)
      // to prevent any accidental backward navigation while scrolling near the top
      if (isAtTop && deltaY < -30) {
        const prev = getPrevMobileRoute(currentView, selectedAlbum, selectedSubAlbum);
        if (prev) {
          activePullDirectionRef.current = 'prev';
          const pullDist = -deltaY - 30;
          const progress = Math.min(1, Math.max(0, pullDist / 120));
          const isConfirmed = progress >= 1;

          if (isConfirmed && !pullConfirmedRef.current) {
            pullConfirmedRef.current = true;
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(15); } catch { /* ignore */ }
            }
          } else if (!isConfirmed) {
            pullConfirmedRef.current = false;
          }

          setPullFeedback({
            direction: 'prev',
            progress,
            isConfirmed,
            targetTitle: prev.title,
          });
          return;
        }
      }

      // If moved back inside bounds or not overscrolling
      if (activePullDirectionRef.current === 'next' && deltaY <= 10) {
        activePullDirectionRef.current = null;
        pullConfirmedRef.current = false;
        setPullFeedback(null);
      } else if (activePullDirectionRef.current === 'prev' && deltaY >= -25) {
        activePullDirectionRef.current = null;
        pullConfirmedRef.current = false;
        setPullFeedback(null);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isTransitioningRef.current) {
        setPullFeedback(null);
        activePullDirectionRef.current = null;
        pullConfirmedRef.current = false;
        return;
      }

      if (pullConfirmedRef.current) {
        if (activePullDirectionRef.current === 'next') {
          triggerMobileAdvance();
        } else if (activePullDirectionRef.current === 'prev') {
          triggerMobileBack();
        }
      }

      setPullFeedback(null);
      activePullDirectionRef.current = null;
      pullConfirmedRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return;
      measureDimensions();

      if (e.deltaY > 0 && checkIsAtBottom()) {
        const next = getNextMobileRoute(currentView);
        if (!next) return;
        accumulatedWheelDelta += e.deltaY;
        const progress = Math.min(1, accumulatedWheelDelta / 90);
        const isConfirmed = progress >= 1;
        setPullFeedback({
          direction: 'next',
          progress,
          isConfirmed,
          targetTitle: next.title,
        });

        if (wheelTimer) window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => {
          if (accumulatedWheelDelta >= 90) {
            triggerMobileAdvance();
          }
          accumulatedWheelDelta = 0;
          setPullFeedback(null);
        }, 220);
      } else if (e.deltaY < 0 && checkIsAtTop()) {
        const prev = getPrevMobileRoute(currentView, selectedAlbum, selectedSubAlbum);
        if (!prev) return;
        accumulatedWheelDelta += Math.abs(e.deltaY);
        // Requires 240 wheel delta to go back (significantly more resistant)
        const progress = Math.min(1, accumulatedWheelDelta / 240);
        const isConfirmed = progress >= 1;
        setPullFeedback({
          direction: 'prev',
          progress,
          isConfirmed,
          targetTitle: prev.title,
        });

        if (wheelTimer) window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => {
          if (accumulatedWheelDelta >= 240) {
            triggerMobileBack();
          }
          accumulatedWheelDelta = 0;
          setPullFeedback(null);
        }, 220);
      } else {
        accumulatedWheelDelta = 0;
      }
    };

    measureDimensions();

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      if (wheelTimer) window.clearTimeout(wheelTimer);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
    };
  }, [isMobile, currentView, selectedAlbum, selectedSubAlbum]);

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
        isPastHeroCards={isPastHeroCards}
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
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
          >
            <motion.div
              key={`${currentView}-${selectedAlbum || 'all'}-${selectedSubAlbum || 'none'}`}
              custom={transitionDirection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {/* Mobile-Only Sequential Previous Page Arrow Cue */}
              {isMobile && prevMobileRoute && (
                <MobilePrevPageCue
                  prevTitle={prevMobileRoute.title}
                  onBack={triggerMobileBack}
                  isPulling={pullFeedback?.direction === 'prev'}
                  pullProgress={pullFeedback?.direction === 'prev' ? pullFeedback.progress : 0}
                  isConfirmed={pullFeedback?.direction === 'prev' ? pullFeedback.isConfirmed : false}
                />
              )}

              {/* 1. Home View: JustinLe Card Reveal, Highlight Carousel, Logos & Action Cards */}
              {currentView === 'home' && (
                <JustinLeHomeView
                  currentView={currentView}
                  onNavigate={handleNavigate}
                  photos={photos}
                  isPastHeroCards={isPastHeroCards}
                />
              )}

              {/* 2. Photography View: Full photo stream */}
              {currentView === 'photography' && !selectedAlbum && (
                <EdzPhotoStream
                  photos={photos}
                  onSelectPhoto={handleSelectPhoto}
                  title="Photography"
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

              {/* Mobile-Only Sequential Next Page Arrow Cue */}
              {isMobile && nextMobileRoute && (
                <MobileNextPageCue
                  nextTitle={nextMobileRoute.title}
                  onAdvance={triggerMobileAdvance}
                  isPulling={pullFeedback?.direction === 'next'}
                  pullProgress={pullFeedback?.direction === 'next' ? pullFeedback.progress : 0}
                  isConfirmed={pullFeedback?.direction === 'next' ? pullFeedback.isConfirmed : false}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* High-Resolution Lightbox */}
      <Lightbox
        photos={photos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setCurrentPhotoIndex(newIdx)}
      />
      {/* Copyright & Image Protection Alert Notice */}
      <PhotoProtectionNotice />
    </div>
  );
}
