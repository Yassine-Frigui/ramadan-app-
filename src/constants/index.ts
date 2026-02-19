export const QURAN_TOTAL_PAGES = 604;

export const PRAYER_NAMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

/**
 * Dynamic prayer labels based on current language.
 * Use getPrayerLabel() for real-time translations.
 * This static map is kept for backward compatibility.
 */
export const PRAYER_LABELS: Record<string, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

export const STORAGE_KEYS = {
  RAMADAN_PLAN: '@ramadan_plan',
  DAILY_PROGRESS: '@daily_progress',
  SETTINGS: '@settings',
  LOCATION: '@location',
  LANGUAGE: '@language',
};

export const API_ENDPOINTS = {
  QURAN_BY_PAGE: 'https://api.alquran.cloud/v1/page',
  PRAYER_TIMINGS: 'https://api.aladhan.com/v1/timings',
};
