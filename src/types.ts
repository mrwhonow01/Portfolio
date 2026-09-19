export interface CameraInfo {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  focalLength?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'sports' | 'events' | 'stage' | 'cinematic';
  src: string;
  thumbnailSrc?: string;
  aspectRatio: 'landscape' | 'portrait' | 'square' | 'panoramic';
  featured: boolean;
  date?: string;
  location?: string;
  cameraInfo: CameraInfo;
  clientOrProject?: string;
  story?: string;
  subCategory?: 'muay-thai' | 'formula-1' | string;
  subTabOnly?: boolean;
  tags: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  tagline: string;
  thumbnail: string;
  youtubeId?: string;
  duration: string;
  resolution: string;
  device: string;
  description: string;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  role: string;
  organization: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  highlightImage?: string;
  badge?: string;
}

export interface PortfolioProfile {
  name: string;
  signatureText: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  youtube: string;
  instagram: string;
  availableForWork: boolean;
  avatar?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  eventDate?: string;
  budget?: string;
  message: string;
  timestamp: string;
}
