import { INITIAL_PHOTOS } from '../data/initialPortfolio';
import { INSTAGRAM_POSTS } from '../components/EdzInstagramView';

/**
 * Intelligent Idle Background Preloader
 * Progressively caches all portfolio photos in background threads
 * optimized specifically for mobile devices and fast responsiveness.
 */

// Track loaded URLs so we never request the same asset twice
const preloadedUrls = new Set<string>();

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check for background updates
          reg.update().catch(() => {});
        })
        .catch(() => {
          // Silently handle if unsupported in current context
        });
    });
  }
}

export function initBackgroundPreloader() {
  if (typeof window === 'undefined') return;

  // Start Service Worker
  registerServiceWorker();

  // Helper to schedule work during browser idle periods
  const scheduleIdle = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void }).requestIdleCallback(
        callback,
        { timeout: 1500 }
      );
    } else {
      setTimeout(callback, 250);
    }
  };

  // Wait until the initial page has finished mounting and painting
  scheduleIdle(() => {
    // Check if user has "Data Saver" enabled on mobile (Save-Data header / connection)
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const isSaveData = conn?.saveData === true;
    const isSlowConnection = conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';

    // 1. Queue all album thumbnails (small ~40-60KB WebPs - instant for phone browsing)
    const thumbnailUrls = INITIAL_PHOTOS
      .map((p) => p.thumbnailSrc || p.src)
      .filter((url): url is string => Boolean(url));

    // 2. Queue Instagram graphics (~40-60KB WebPs)
    const instagramUrls = INSTAGRAM_POSTS.map((p) => p.image);

    // 3. Queue full-resolution photos (for zero-lag enlarged viewing)
    const fullResUrls = INITIAL_PHOTOS.map((p) => p.src);

    // If on strict data-saving connection, only preload thumbnails
    const fullQueue = isSaveData || isSlowConnection
      ? [...thumbnailUrls, ...instagramUrls]
      : [...thumbnailUrls, ...instagramUrls, ...fullResUrls];

    // Deduplicate
    const uniqueQueue = Array.from(new Set(fullQueue)).filter((url) => !preloadedUrls.has(url));

    if (uniqueQueue.length === 0) return;

    // Concurrency limit: 2 concurrent image downloads on mobile/low-core CPUs, 4 on desktop
    const cores = navigator.hardwareConcurrency || 4;
    const MAX_CONCURRENT = cores <= 4 ? 2 : 4;

    let queueIndex = 0;
    let activeWorkers = 0;

    const pumpQueue = () => {
      while (activeWorkers < MAX_CONCURRENT && queueIndex < uniqueQueue.length) {
        const url = uniqueQueue[queueIndex++];
        if (!url || preloadedUrls.has(url)) continue;

        preloadedUrls.add(url);
        activeWorkers++;

        const img = new Image();
        img.decoding = 'async';

        const onComplete = () => {
          activeWorkers--;
          scheduleIdle(pumpQueue);
        };

        img.onload = onComplete;
        img.onerror = onComplete;
        img.src = url;
      }
    };

    // Kick off queue
    pumpQueue();
  });
}
