/**
 * Helper utility to normalize image/video/media URLs
 * Handles relative backend paths like `/uploads/...` by prefixing BASE_URL,
 * handles full web URLs (http/https), and provides fallback placeholder.
 */

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('vercel.app') || (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1') && !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname))) {
      return 'https://electionapp-backend-jai8.onrender.com';
    }
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname)) {
      return `http://${window.location.hostname}:3001`;
    }
  }
  return envUrl || 'https://electionapp-backend-jai8.onrender.com';
};

const BACKEND_BASE = getBaseUrl().replace(/\/+$/, '');

export function getMediaUrl(url, fallback = '/image copy 3.png') {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  let clean = url.trim();

  // If the path contains youtube / youtu.be, dummy domains (like example.com), or invalid URLs, return fallback
  if (
    clean.includes('youtube.com') ||
    clean.includes('youtu.be') ||
    clean.includes('example.com') ||
    clean.includes('sample.com')
  ) {
    return fallback;
  }

  // If a web URL got accidentally prefixed with /uploads/tenant/module/https://...
  const embeddedHttpIndex = clean.indexOf('http://');
  const embeddedHttpsIndex = clean.indexOf('https://');
  if (embeddedHttpsIndex > 0) {
    clean = clean.substring(embeddedHttpsIndex);
  } else if (embeddedHttpIndex > 0) {
    clean = clean.substring(embeddedHttpIndex);
  }

  // If already absolute URL (http / https / blob / data)
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:') || clean.startsWith('data:')) {
    return clean;
  }

  // If it's a backend relative path starting with /uploads or uploads
  if (clean.startsWith('/uploads') || clean.startsWith('uploads/')) {
    const path = clean.startsWith('/') ? clean : `/${clean}`;
    return `${BACKEND_BASE}${path}`;
  }

  // If it starts with a leading slash for frontend public assets (e.g. /profile_avatar.jpg)
  if (clean.startsWith('/')) {
    return clean;
  }

  // Default prefix backend base
  return `${BACKEND_BASE}/${clean}`;
}
