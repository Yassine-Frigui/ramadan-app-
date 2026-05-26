/**
 * @deprecated Use useQuranPlan instead — this is a backward-compatible wrapper.
 */
import { useQuranPlan } from './useQuranPlan';

export type { ReadingStatus } from './useQuranPlan';

export const useRamadanPlan = (totalDays: 29 | 30 = 30) => {
  const result = useQuranPlan({ totalDays });
  return {
    ...result,
    // Keep the old property name for backward compat
    currentRamadanDay: result.currentPlanDay,
  };
};

