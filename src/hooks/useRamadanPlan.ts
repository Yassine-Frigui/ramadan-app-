import { useState, useEffect, useCallback } from 'react';
import { RamadanPlan, DailyProgress } from '../types';
import {
  generateRamadanPlan,
  calculatePageRanges,
  saveRamadanPlan,
  getRamadanPlan,
  getDailyProgress,
  toggleDayCompletion as toggleCompletion,
  saveDailyProgress,
} from '../storage/storage';

export const useRamadanPlan = (totalDays: 29 | 30 = 30) => {
  const [plan, setPlan] = useState<RamadanPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializePlan = useCallback(async () => {
    setIsLoading(true);
    
    let savedPlan = await getRamadanPlan();
    
    if (!savedPlan || savedPlan.totalDays !== totalDays) {
      savedPlan = generateRamadanPlan(totalDays);
      await saveRamadanPlan(savedPlan);
      
      const pageRanges = calculatePageRanges(savedPlan);
      await saveDailyProgress(pageRanges);
      setProgress(pageRanges);
    } else {
      const savedProgress = await getDailyProgress();
      if (savedProgress.length === 0) {
        const pageRanges = calculatePageRanges(savedPlan);
        await saveDailyProgress(pageRanges);
        setProgress(pageRanges);
      } else {
        setProgress(savedProgress);
      }
    }
    
    setPlan(savedPlan);
    setIsLoading(false);
  }, [totalDays]);

  useEffect(() => {
    initializePlan();
  }, [initializePlan]);

  const toggleDayCompletion = useCallback(async (day: number) => {
    const updatedProgress = await toggleCompletion(day);
    setProgress(updatedProgress);
  }, []);

  const completedDays = progress.filter((p) => p.completed).length;
  const progressPercentage = plan ? Math.round((completedDays / plan.totalDays) * 100) : 0;

  return {
    plan,
    progress,
    isLoading,
    completedDays,
    progressPercentage,
    toggleDayCompletion,
    refreshPlan: initializePlan,
  };
};
