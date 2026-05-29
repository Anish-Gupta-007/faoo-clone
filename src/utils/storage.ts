// src/utils/storage.ts

const ACCESS_TOKEN_KEY = 'faoo_access_token';
const REFRESH_TOKEN_KEY = 'faoo_refresh_token';
const POPUP_SEEN_KEY = 'faoo_popup_seen';

export const storage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  isPopupSeen: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(POPUP_SEEN_KEY) === 'true';
  },
  markPopupSeen: (): void => {
    localStorage.setItem(POPUP_SEEN_KEY, 'true');
  },
};
