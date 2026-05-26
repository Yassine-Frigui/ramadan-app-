import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuranPlan, DailyProgress } from '../types';
import { QURAN_TOTAL_PAGES, STORAGE_KEYS, RAMADAN_START_DATE, isWithinRamadan } from '../constants';
import {
  generateQuranPlan,
  calculatePageRangesForPlan,
  saveQuranPlan,
  getQuranPlan,
  getDailyProgress,
  saveDailyProgress,
} from '../storage/storage';

/** Format Date → "YYYY-MM-DD" */
const toISO = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Current plan day (1-based), clamped to [1..totalDays] */
const getCurrentPlanDay = (startDate: string, totalDays: number): number => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.max(1, Math.min(diff, totalDays));
};

export type ReadingStatus = 'ahead' | 'onTime' | 'behind';

export interface UseQuranPlanOptions {
  /** Override total days (ignored during Ramadan where 30 is forced). */
  totalDays?: number;
  /** Override start date ISO string (ignored during Ramadan). */
  startDate?: string;
}

export const useQuranPlan = (opts: UseQuranPlanOptions = {}) => {
  const [plan, setPlan] = useState<QuranPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastReadPage, setLastReadPage] = useState<number>(0);

  const ramadan = isWithinRamadan();

  /** Bootstrap or load existing plan */
  const initializePlan = useCallback(async () => {
    setIsLoading(true);

    // Last-read page
    const savedPage = await AsyncStorage.getItem(STORAGE_KEYS.LAST_READ_PAGE);
    const readPage = savedPage ? Number.parseInt(savedPage, 10) : 0;
    setLastReadPage(readPage);

    let savedPlan = await getQuranPlan();

    // ── Determine desired config ──
    let desiredDays: number;
    let desiredStart: string;
    let desiredIsRamadan: boolean;

    if (ramadan) {
      desiredDays = 30;
      desiredStart = toISO(RAMADAN_START_DATE);
      desiredIsRamadan = true;
    } else {
      desiredDays = opts.totalDays ?? 30;
      desiredStart = opts.startDate ?? toISO(new Date());
      desiredIsRamadan = false;
    }

    // ── Decide whether to reuse existing plan ──
    const planMatchesCurrent =
      savedPlan?.totalDays === desiredDays &&
      savedPlan?.startDate === desiredStart;

    if (planMatchesCurrent && savedPlan) {
      let savedProgress = await getDailyProgress();
      if (savedProgress.length === 0) {
        savedProgress = calculatePageRangesForPlan(savedPlan);
        await saveDailyProgress(savedProgress);
      }
      const planDay = getCurrentPlanDay(savedPlan.startDate, savedPlan.totalDays);
      const updated = updateProgressWithRedistribution(savedProgress, readPage, planDay);
      await saveDailyProgress(updated);
      setProgress(updated);
      setPlan(savedPlan);
    } else {
      // Create fresh plan
      const newPlan = generateQuranPlan(desiredDays, desiredStart, desiredIsRamadan);
      await saveQuranPlan(newPlan);
      const pageRanges = calculatePageRangesForPlan(newPlan);
      const planDay = getCurrentPlanDay(desiredStart, desiredDays);
      const updated = updateProgressWithRedistribution(pageRanges, readPage, planDay);
      await saveDailyProgress(updated);
      setProgress(updated);
      setPlan(newPlan);
    }

    setIsLoading(false);
  }, [ramadan, opts.totalDays, opts.startDate]);

  useEffect(() => {
    initializePlan();
  }, [initializePlan]);

  /** Re-sync progress (e.g., returning from reader) */
  const refreshProgress = useCallback(async () => {
    const savedPage = await AsyncStorage.getItem(STORAGE_KEYS.LAST_READ_PAGE);
    const readPage = savedPage ? Number.parseInt(savedPage, 10) : 0;
    setLastReadPage(readPage);

    if (progress.length > 0 && plan) {
      const planDay = getCurrentPlanDay(plan.startDate, plan.totalDays);
      const updated = updateProgressWithRedistribution(progress, readPage, planDay);
      await saveDailyProgress(updated);
      setProgress(updated);
    }
  }, [progress, plan]);

  /** Reset plan with new parameters */
  const resetPlan = useCallback(async (totalDays: number, startDate?: string) => {
    const start = startDate ?? toISO(new Date());
    const newPlan = generateQuranPlan(totalDays, start, false);
    await saveQuranPlan(newPlan);

    // Reset last-read page
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_READ_PAGE, '0');
    setLastReadPage(0);

    const pageRanges = calculatePageRangesForPlan(newPlan);
    await saveDailyProgress(pageRanges);
    setProgress(pageRanges);
    setPlan(newPlan);
  }, []);

  // ── Derived values ──
  const completedDays = progress.filter((p) => p.completed).length;
  const totalDays = plan?.totalDays ?? 30;
  const progressPercentage = plan ? Math.round((completedDays / totalDays) * 100) : 0;
  const pagesRead = lastReadPage > 0 ? lastReadPage - 1 : 0;
  const remainingPages = Math.max(QURAN_TOTAL_PAGES - pagesRead, 0);
  const currentPlanDay = plan ? getCurrentPlanDay(plan.startDate, totalDays) : 1;
  const readingDay = completedDays;

  const getStatus = (): ReadingStatus => {
    if (readingDay >= currentPlanDay) return 'ahead';
    if (currentPlanDay - readingDay <= 1) return 'onTime';
    return 'behind';
  };

  const calendarRemainingDays = Math.max(0, totalDays - currentPlanDay + 1);
  const pagesPerRemainingDay =
    calendarRemainingDays > 0 ? Math.ceil(remainingPages / calendarRemainingDays) : 0;

  return {
    plan,
    progress,
    isLoading,
    completedDays,
    progressPercentage,
    refreshProgress,
    refreshPlan: initializePlan,
    resetPlan,
    remainingPages,
    remainingDays: calendarRemainingDays,
    pagesPerRemainingDay,
    lastReadPage,
    pagesRead,
    currentPlanDay,
    readingDay,
    status: getStatus(),
    isRamadan: ramadan,
  };
};

/**
 * Mark past days complete/incomplete and redistribute remaining pages across
 * current + future calendar days so the schedule adapts when behind.
 */
function updateProgressWithRedistribution(
  progress: DailyProgress[],
  lastReadPage: number,
  currentPlanDay: number,
): DailyProgress[] {
  const pagesRead = lastReadPage > 0 ? lastReadPage - 1 : 0;
  const remaining = Math.max(0, QURAN_TOTAL_PAGES - pagesRead);

  // Everything read — mark all complete
  if (remaining <= 0) {
    return progress.map((p) => ({
      ...p,
      completed: true,
      completedAt: p.completedAt ?? new Date().toISOString(),
    }));
  }

  // Count days from today onwards
  const futureDayCount = progress.filter((p) => p.day >= currentPlanDay).length;

  // Distribute remaining pages evenly across future calendar days
  const base = futureDayCount > 0 ? Math.floor(remaining / futureDayCount) : 0;
  const extra = futureDayCount > 0 ? remaining % futureDayCount : 0;

  let nextPage = pagesRead + 1;
  let futureIdx = 0;

  return progress.map((p) => {
    if (p.day < currentPlanDay) {
      // Past day — keep original range, check if actually read
      const done = p.pagesEnd <= pagesRead;
      return {
        ...p,
        completed: done,
        completedAt: done ? (p.completedAt ?? new Date().toISOString()) : undefined,
      };
    }

    // Current or future day — recalculate page range
    const bonus = futureIdx < extra ? 1 : 0;
    const pagesForDay = base + bonus;
    futureIdx++;

    const start = nextPage;
    const end = start + pagesForDay - 1;
    nextPage += pagesForDay;

    return {
      ...p,
      pagesStart: start,
      pagesEnd: end,
      completed: false,
      completedAt: undefined,
    };
  });
}
