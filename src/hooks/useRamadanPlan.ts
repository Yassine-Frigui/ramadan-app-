import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RamadanPlan, DailyProgress } from '../types';
import { QURAN_TOTAL_PAGES, STORAGE_KEYS, RAMADAN_START_DATE } from '../constants';
import {
  generateRamadanPlan,
  calculatePageRanges,
  saveRamadanPlan,
  getRamadanPlan,
  getDailyProgress,
  saveDailyProgress,
} from '../storage/storage';

/** Returns current Ramadan day (1-based), clamped to 1..totalDays */
const getCurrentRamadanDay = (totalDays: number): number => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - RAMADAN_START_DATE.getTime()) / 86_400_000) + 1;
  return Math.max(1, Math.min(diff, totalDays));
};

export type ReadingStatus = 'ahead' | 'onTime' | 'behind';

export const useRamadanPlan = (totalDays: 29 | 30 = 30) => {
  const [plan, setPlan] = useState<RamadanPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastReadPage, setLastReadPage] = useState<number>(0);

  /** Bootstrap or load the plan & initial page ranges */
  const initializePlan = useCallback(async () => {
    setIsLoading(true);

    // Get last-read page from storage (same key the reader uses)
    const savedPage = await AsyncStorage.getItem(STORAGE_KEYS.LAST_READ_PAGE);
    const readPage = savedPage ? Number.parseInt(savedPage, 10) : 0;
    setLastReadPage(readPage);

    let savedPlan = await getRamadanPlan();

    if (savedPlan?.totalDays === totalDays) {
      let savedProgress = await getDailyProgress();
      if (savedProgress.length === 0) {
        savedProgress = calculatePageRanges(savedPlan);
        await saveDailyProgress(savedProgress);
      }
      // Auto-mark days based on lastReadPage
      const updated = autoMarkProgress(savedProgress, readPage);
      await saveDailyProgress(updated);
      setProgress(updated);
    } else {
      savedPlan = generateRamadanPlan(totalDays);
      await saveRamadanPlan(savedPlan);
      const pageRanges = calculatePageRanges(savedPlan);
      const updated = autoMarkProgress(pageRanges, readPage);
      await saveDailyProgress(updated);
      setProgress(updated);
    }

    setPlan(savedPlan);
    setIsLoading(false);
  }, [totalDays]);

  useEffect(() => {
    initializePlan();
  }, [initializePlan]);

  /** Re-sync progress whenever lastReadPage might have changed (e.g., returning from reader) */
  const refreshProgress = useCallback(async () => {
    const savedPage = await AsyncStorage.getItem(STORAGE_KEYS.LAST_READ_PAGE);
    const readPage = savedPage ? Number.parseInt(savedPage, 10) : 0;
    setLastReadPage(readPage);

    if (progress.length > 0) {
      const updated = autoMarkProgress(progress, readPage);
      await saveDailyProgress(updated);
      setProgress(updated);
    }
  }, [progress]);

  // Derived values
  const completedDays = progress.filter((p) => p.completed).length;
  const progressPercentage = plan ? Math.round((completedDays / plan.totalDays) * 100) : 0;
  const pagesRead = lastReadPage > 0 ? lastReadPage - 1 : 0; // page 44 means 1-43 read
  const remainingPages = Math.max(QURAN_TOTAL_PAGES - pagesRead, 0);
  const currentRamadanDay = getCurrentRamadanDay(totalDays);

  // "Reading day" = how many days' worth of reading is complete
  const readingDay = completedDays;

  // Status: compare readingDay to currentRamadanDay
  const getStatus = (): ReadingStatus => {
    if (readingDay >= currentRamadanDay) return 'ahead';
    if (currentRamadanDay - readingDay <= 1) return 'onTime';
    return 'behind';
  };

  const incompleteDays = progress.filter((p) => !p.completed);
  const pagesPerRemainingDay =
    incompleteDays.length > 0 ? Math.ceil(remainingPages / incompleteDays.length) : 0;

  return {
    plan,
    progress,
    isLoading,
    completedDays,
    progressPercentage,
    refreshProgress,
    refreshPlan: initializePlan,
    remainingPages,
    remainingDays: incompleteDays.length,
    pagesPerRemainingDay,
    lastReadPage,
    pagesRead,
    currentRamadanDay,
    readingDay,
    status: getStatus(),
  };
};

/**
 * Auto-mark days as complete/incomplete based on the furthest page read.
 * If lastReadPage = 44 → pages 1-43 are read → any day whose pagesEnd ≤ 43 is complete.
 */
function autoMarkProgress(progress: DailyProgress[], lastReadPage: number): DailyProgress[] {
  const pagesRead = lastReadPage > 0 ? lastReadPage - 1 : 0;
  return progress.map((p) => ({
    ...p,
    completed: p.pagesEnd <= pagesRead,
    completedAt: p.pagesEnd <= pagesRead ? (p.completedAt ?? new Date().toISOString()) : undefined,
  }));
}
