import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { getQuranPage, QuranPage } from '../data';

const LAST_READ_KEY = STORAGE_KEYS.LAST_READ_PAGE;

export const useQuranReader = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quranPage, setQuranPage] = useState<QuranPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load last read page on mount
  useEffect(() => {
    const loadLastPage = async () => {
      try {
        const saved = await AsyncStorage.getItem(LAST_READ_KEY);
        const page = saved ? Number.parseInt(saved, 10) : 1;
        setCurrentPage(page);
        setQuranPage(getQuranPage(page));
      } catch {
        setQuranPage(getQuranPage(1));
      } finally {
        setIsLoading(false);
      }
    };
    loadLastPage();
  }, []);

  // Save & load page whenever currentPage changes
  useEffect(() => {
    if (!isLoading) {
      const page = getQuranPage(currentPage);
      setQuranPage(page);
      AsyncStorage.setItem(LAST_READ_KEY, currentPage.toString());
    }
  }, [currentPage, isLoading]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= 604) {
      setCurrentPage(page);
    }
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, 604));
  }, []);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    quranPage,
    isLoading,
    goToPage,
    nextPage,
    previousPage,
  };
};
