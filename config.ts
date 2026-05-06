// Backend URL
// Change this single value to point the app at a different backend.
// - https://opspilot-pqwd.onrender.com/  current Render deployment
// - https://yourdomain.com/              custom domain
// - http://192.168.1.x:8000/             local Flask dev server
export const BASE_URL = 'https://opspilot-pqwd.onrender.com/';

export function cleanBaseUrl(url: string = BASE_URL): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function apiBaseUrl(url: string = BASE_URL): string {
  return `${cleanBaseUrl(url)}/api`;
}

export function webUrl(path = '', url: string = BASE_URL): string {
  const base = cleanBaseUrl(url);
  const cleanPath = path.replace(/^\/+/, '');
  return cleanPath ? `${base}/${cleanPath}` : base;
}

export default BASE_URL;
