import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuranPlan, DailyProgress, AppSettings, LocationData } from '../types';
import { STORAGE_KEYS, QURAN_TOTAL_PAGES } from '../constants';

/**
 * Generate a flexible Quran reading plan.
 * @param totalDays  Number of days to complete the Quran
 * @param startDate  ISO date string for day 1
 * @param isRamadan  Whether this plan was auto-created for Ramadan
 */
export const generateQuranPlan = (
  totalDays: number,
  startDate: string,
  isRamadan: boolean = false,
): QuranPlan => {
  const pagesPerDay: number[] = [];
  const basePages = Math.floor(QURAN_TOTAL_PAGES / totalDays);
  const remainder = QURAN_TOTAL_PAGES % totalDays;

  for (let day = 1; day <= totalDays; day++) {
    const extraPage = day <= remainder ? 1 : 0;
    pagesPerDay.push(basePages + extraPage);
  }

  return { totalDays, startDate, pagesPerDay, isRamadan };
};

export const calculatePageRangesForPlan = (plan: QuranPlan): DailyProgress[] => {
  const progress: DailyProgress[] = [];
  let currentPage = 1;

  for (let day = 1; day <= plan.totalDays; day++) {
    const pagesForDay = plan.pagesPerDay[day - 1];
    progress.push({
      day,
      pagesStart: currentPage,
      pagesEnd: currentPage + pagesForDay - 1,
      completed: false,
    });
    currentPage += pagesForDay;
  }

  return progress;
};

export const saveQuranPlan = async (plan: QuranPlan): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.QURAN_PLAN, JSON.stringify(plan));
};

export const getQuranPlan = async (): Promise<QuranPlan | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.QURAN_PLAN);
  return data ? JSON.parse(data) : null;
};

export const saveDailyProgress = async (progress: DailyProgress[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
};

export const getDailyProgress = async (): Promise<DailyProgress[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  return data ? JSON.parse(data) : [];
};

export const toggleDayCompletion = async (day: number): Promise<DailyProgress[]> => {
  const progress = await getDailyProgress();
  const updated = progress.map((p) => {
    if (p.day === day) {
      return {
        ...p,
        completed: !p.completed,
        completedAt: p.completed ? undefined : new Date().toISOString(),
      };
    }
    return p;
  });
  await saveDailyProgress(updated);
  return updated;
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = async (): Promise<AppSettings | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : null;
};

export const saveLocation = async (location: LocationData): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
};

export const getLocation = async (): Promise<LocationData | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
  return data ? JSON.parse(data) : null;
};
