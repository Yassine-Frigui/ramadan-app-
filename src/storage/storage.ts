import AsyncStorage from '@react-native-async-storage/async-storage';
import { RamadanPlan, DailyProgress, AppSettings, LocationData } from '../types';
import { STORAGE_KEYS, QURAN_TOTAL_PAGES } from '../constants';

export const generateRamadanPlan = (totalDays: 29 | 30): RamadanPlan => {
  const pagesPerDay: number[] = [];
  const basePages = Math.floor(QURAN_TOTAL_PAGES / totalDays);
  const remainder = QURAN_TOTAL_PAGES % totalDays;

  for (let day = 1; day <= totalDays; day++) {
    const extraPage = day <= remainder ? 1 : 0;
    pagesPerDay.push(basePages + extraPage);
  }

  return { totalDays, pagesPerDay };
};

export const calculatePageRanges = (plan: RamadanPlan): DailyProgress[] => {
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

/**
 * Recalculate remaining days' page ranges based on actual progress.
 * If user read faster/slower, distribute remaining pages evenly across remaining incomplete days.
 */
export const recalculateProgress = (
  progress: DailyProgress[],
  plan: RamadanPlan
): { progress: DailyProgress[]; plan: RamadanPlan } => {
  const completedDays = progress.filter((p) => p.completed);
  const incompleteDays = progress.filter((p) => !p.completed);

  if (incompleteDays.length === 0) return { progress, plan };

  // Find the last completed page
  let pagesAlreadyCovered = 0;
  if (completedDays.length > 0) {
    const lastCompleted = completedDays.reduce((max, p) => (p.pagesEnd > max.pagesEnd ? p : max), completedDays[0]);
    pagesAlreadyCovered = lastCompleted.pagesEnd;
  }

  const remainingPages = QURAN_TOTAL_PAGES - pagesAlreadyCovered;
  const remainingDayCount = incompleteDays.length;

  if (remainingPages <= 0 || remainingDayCount <= 0) return { progress, plan };

  const basePagesPerDay = Math.floor(remainingPages / remainingDayCount);
  const extraPages = remainingPages % remainingDayCount;

  // Rebuild page ranges for incomplete days
  let currentPage = pagesAlreadyCovered + 1;
  const newPagesPerDay = [...plan.pagesPerDay];

  let extraIndex = 0;
  const updatedProgress = progress.map((p) => {
    if (p.completed) return p;

    const extra = extraIndex < extraPages ? 1 : 0;
    const pagesForThisDay = basePagesPerDay + extra;
    extraIndex++;

    newPagesPerDay[p.day - 1] = pagesForThisDay;

    const updated: DailyProgress = {
      ...p,
      pagesStart: currentPage,
      pagesEnd: currentPage + pagesForThisDay - 1,
    };
    currentPage += pagesForThisDay;
    return updated;
  });

  return {
    progress: updatedProgress,
    plan: { ...plan, pagesPerDay: newPagesPerDay },
  };
};

export const saveRamadanPlan = async (plan: RamadanPlan): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.RAMADAN_PLAN, JSON.stringify(plan));
};

export const getRamadanPlan = async (): Promise<RamadanPlan | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.RAMADAN_PLAN);
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
