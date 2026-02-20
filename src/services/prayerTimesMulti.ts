import { format } from 'date-fns';
import { PrayerTimes, LocationData } from '../types';

/**
 * Calculation method IDs used by AlAdhan API.
 * Each method has different fiqh-based Fajr/Isha angles.
 */
export interface PrayerMethod {
  id: number;
  key: string;
  nameAr: string;
  nameEn: string;
}

export const PRAYER_METHODS: PrayerMethod[] = [
  { id: 4, key: 'ummAlQura', nameAr: 'أم القرى (مكة)', nameEn: 'Umm Al-Qura (Makkah)' },
  { id: 3, key: 'mwl', nameAr: 'رابطة العالم الإسلامي', nameEn: 'Muslim World League' },
  { id: 2, key: 'isna', nameAr: 'ISNA (أمريكا الشمالية)', nameEn: 'ISNA (North America)' },
  { id: 5, key: 'egypt', nameAr: 'الهيئة المصرية', nameEn: 'Egyptian Authority' },
  { id: 1, key: 'karachi', nameAr: 'جامعة كراتشي', nameEn: 'University of Karachi' },
];

export interface MultiSourceResult {
  method: PrayerMethod;
  times: PrayerTimes | null;
  error: string | null;
}

/**
 * Hardcoded approximate Mecca prayer times for Ramadan period (late Feb).
 * Used as absolute last-resort fallback when all API calls fail.
 */
export const MECCA_FALLBACK_TIMES: PrayerTimes = {
  fajr: '05:27',
  dhuhr: '12:27',
  asr: '15:48',
  maghrib: '18:17',
  isha: '19:47',
  date: 'Fallback (Mecca approx.)',
};

interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    date: {
      readable: string;
      hijri: {
        date: string;
        day: string;
        month: { number: number; en: string; ar: string };
        year: string;
      };
    };
  };
}

/**
 * Strip timezone suffix like " (EET)" from AlAdhan time strings.
 */
const cleanTime = (raw: string): string => raw.split(' ')[0];

/**
 * Fetch prayer times from AlAdhan API for a specific calculation method.
 */
export const fetchPrayerTimesForMethod = async (
  method: PrayerMethod,
  location: LocationData,
  date?: Date,
): Promise<MultiSourceResult> => {
  try {
    const targetDate = date || new Date();
    const dateString = format(targetDate, 'dd-MM-yyyy');
    const url = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${location.latitude}&longitude=${location.longitude}&method=${method.id}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json: AlAdhanResponse = await response.json();

    if (json.code !== 200) {
      throw new Error(`API error: ${json.status}`);
    }

    const t = json.data.timings;
    const hijri = json.data.date.hijri;
    const hijriDate = `${hijri.day} ${hijri.month.ar} ${hijri.year}`;

    return {
      method,
      times: {
        fajr: cleanTime(t.Fajr),
        dhuhr: cleanTime(t.Dhuhr),
        asr: cleanTime(t.Asr),
        maghrib: cleanTime(t.Maghrib),
        isha: cleanTime(t.Isha),
        date: `${json.data.date.readable} — ${hijriDate}`,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      method,
      times: null,
      error: message,
    };
  }
};

/**
 * Fetch prayer times from ALL methods in parallel.
 * Returns array of results (some may have errors).
 */
export const fetchAllPrayerSources = async (
  location: LocationData,
  date?: Date,
): Promise<MultiSourceResult[]> => {
  const promises = PRAYER_METHODS.map((method) =>
    fetchPrayerTimesForMethod(method, location, date),
  );
  return Promise.all(promises);
};
