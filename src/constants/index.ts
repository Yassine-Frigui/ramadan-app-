export const QURAN_TOTAL_PAGES = 604;

export const PRAYER_NAMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

/**
 * Ramadan 1447 AH start date (Gregorian).
 * Adjust this each year. Ramadan 2026 begins Feb 19.
 */
export const RAMADAN_START_DATE = new Date(2026, 1, 19); // Month is 0-indexed → Feb 19, 2026

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
  QURAN_PLAN: '@quran_plan',
  QURAN_PLAN_CONFIG: '@quran_plan_config',
  DAILY_PROGRESS: '@daily_progress',
  SETTINGS: '@settings',
  LOCATION: '@location',
  LANGUAGE: '@language',
  LAST_READ_PAGE: '@last_read_page',
  PRAYER_TIMES_CACHE: '@prayer_times_cache',
  NOTIFICATION_MINUTES_BEFORE: '@notification_minutes_before',
};

/**
 * Ramadan 1447 end date (30 days from start).
 */
export const RAMADAN_END_DATE = new Date(
  RAMADAN_START_DATE.getFullYear(),
  RAMADAN_START_DATE.getMonth(),
  RAMADAN_START_DATE.getDate() + 29,
);

/** Check whether a given date falls within the current Ramadan window. */
export const isWithinRamadan = (date: Date = new Date()): boolean => {
  const start = new Date(RAMADAN_START_DATE);
  start.setHours(0, 0, 0, 0);
  const end = new Date(RAMADAN_END_DATE);
  end.setHours(23, 59, 59, 999);
  return date >= start && date <= end;
};

export const API_ENDPOINTS = {
  QURAN_BY_PAGE: 'https://api.alquran.cloud/v1/page',
  PRAYER_TIMINGS: 'https://aladhan.api.islamic.network/v1/timings',
};
