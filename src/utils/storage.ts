import { PhotoItem, PortfolioProfile, TimelineMilestone, ContactInquiry, VideoItem } from '../types';
import { INITIAL_PHOTOS, INITIAL_PROFILE, INITIAL_TIMELINE, INITIAL_VIDEOS } from '../data/initialPortfolio';
import { encryptData, decryptData } from './crypto';

const STORAGE_KEYS = {
  PHOTOS: 'juztin_portfolio_photos_v14',
  PROFILE: 'juztin_portfolio_profile_v8',
  TIMELINE: 'juztin_portfolio_timeline_v8',
  VIDEOS: 'juztin_portfolio_videos_v7',
  INQUIRIES: 'juztin_portfolio_inquiries_v2',
};

export function loadPhotos(): PhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (!raw) return INITIAL_PHOTOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PHOTOS;
  } catch (err) {
    console.error('Error loading photos from storage:', err);
    return INITIAL_PHOTOS;
  }
}

export function savePhotos(photos: PhotoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch (err) {
    console.error('Error saving photos:', err);
  }
}

export function loadProfile(): PortfolioProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return INITIAL_PROFILE;
    return { ...INITIAL_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading profile from storage:', err);
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: PortfolioProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile:', err);
  }
}

export function loadTimeline(): TimelineMilestone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    if (!raw) return INITIAL_TIMELINE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TIMELINE;
  } catch (err) {
    console.error('Error loading timeline from storage:', err);
    return INITIAL_TIMELINE;
  }
}

export function saveTimeline(timeline: TimelineMilestone[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
  } catch (err) {
    console.error('Error saving timeline:', err);
  }
}

export function loadVideos(): VideoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    if (!raw) return INITIAL_VIDEOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_VIDEOS;
  } catch (err) {
    return INITIAL_VIDEOS;
  }
}

export function saveVideos(videos: VideoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  } catch (err) {
    console.error('Error saving videos:', err);
  }
}

let inMemoryInquiries: ContactInquiry[] | null = null;

// Asynchronously hydrate inquiries from encrypted storage
export async function hydrateEncryptedInquiries(): Promise<ContactInquiry[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) {
      inMemoryInquiries = [];
      return [];
    }
    const decrypted = await decryptData<ContactInquiry[]>(raw);
    inMemoryInquiries = Array.isArray(decrypted) ? decrypted : [];
    return inMemoryInquiries;
  } catch (err) {
    console.error('Error hydrating inquiries:', err);
    inMemoryInquiries = [];
    return [];
  }
}

export function loadInquiries(): ContactInquiry[] {
  if (inMemoryInquiries !== null) {
    return inMemoryInquiries;
  }
  // Try synchronous read if legacy unencrypted or trigger async decrypt
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) return [];
    if (!raw.startsWith('ENC:') && !raw.startsWith('OBF:')) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryInquiries = parsed;
        // Transparently migrate to encrypted storage
        encryptData(parsed)
          .then((enc) => localStorage.setItem(STORAGE_KEYS.INQUIRIES, enc))
          .catch(() => {});
        return parsed;
      }
    } else {
      // Trigger background decryption
      hydrateEncryptedInquiries().catch(() => {});
    }
  } catch {}
  return [];
}

export async function saveInquiry(inquiry: ContactInquiry): Promise<void> {
  try {
    const current = inMemoryInquiries || loadInquiries();
    const updated = [inquiry, ...current];
    inMemoryInquiries = updated;

    // Encrypt before saving to localStorage
    const encrypted = await encryptData(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, encrypted);
  } catch (err) {
    console.error('Error saving encrypted inquiry:', err);
  }
}

export function clearInquiries(): void {
  inMemoryInquiries = [];
  try {
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
  } catch (err) {
    console.error('Error clearing inquiries:', err);
  }
}

export function resetPortfolioToDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
  } catch (err) {
    console.error('Error resetting portfolio:', err);
  }
}
