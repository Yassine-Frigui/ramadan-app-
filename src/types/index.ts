export interface RamadanPlan {
  totalDays: 29 | 30;
  pagesPerDay: number[];
}

export interface DailyProgress {
  day: number;
  pagesStart: number;
  pagesEnd: number;
  completed: boolean;
  completedAt?: string;
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface AppSettings {
  ramadanDays: 29 | 30;
  location: LocationData | null;
  notificationsEnabled: boolean;
}
