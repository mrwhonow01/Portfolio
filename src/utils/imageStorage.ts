// Client-side image compression and persistent storage using IndexedDB + localStorage fallback

const DB_NAME = 'JuztinPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_assets';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Resizes and compresses high-resolution camera photos (e.g. 10MB-30MB JPEGs from Sony Alpha)
 * down to web-optimized dimensions (~200KB-400KB) while maintaining crisp display quality.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 2000,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not in browser or canvas unsupported, fallback to basic data URL
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate constrained dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to FileReader if canvas context unavailable
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Output as clean JPEG
      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // If tainted or fails, fallback to basic read
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Saves image data to IndexedDB with safe try/catch on localStorage.
 * Guaranteed never to throw QuotaExceededError.
 */
export async function saveStoredImage(key: string, dataUrl: string): Promise<void> {
  // 1. Save to IndexedDB (virtually unlimited quota for user assets)
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (idbErr) {
    console.warn('IndexedDB write warning, falling back to localStorage:', idbErr);
  }

  // 2. Also try localStorage safely for fast synchronous hydration, catching QuotaExceededError
  try {
    localStorage.setItem(key, dataUrl);
  } catch (storageErr) {
    // Gracefully ignore QuotaExceededError — IndexedDB already stores the full image
    console.warn('LocalStorage quota reached, image preserved in IndexedDB.');
  }
}

/**
 * Retrieves image from IndexedDB, falling back to localStorage.
 */
export async function getStoredImage(key: string): Promise<string | null> {
  // 1. Try IndexedDB first
  try {
    const db = await openDatabase();
    const result = await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch (err) {
    console.warn('IndexedDB read failed, trying localStorage:', err);
  }

  // 2. Fallback to localStorage safely
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return null;
  }
}
