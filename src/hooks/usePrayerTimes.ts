import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTimes, LocationData } from '../types';
import { fetchPrayerTimes } from '../services/prayerTimesApi';
import { schedulePrayerNotifications, requestNotificationPermissions } from '../services/notifications';
import { getLocation, saveLocation } from '../storage/storage';
import { STORAGE_KEYS } from '../constants';
import { t } from '../i18n';

// Default fallback: Tunis
const DEFAULT_LOCATION: LocationData = {
  latitude: 36.8065,
  longitude: 10.1815,
  city: 'تونس',
  country: 'تونس',
};

/** Date-keyed cache key for prayer times */
const getCacheKey = () => {
  const d = new Date();
  return `${STORAGE_KEYS.PRAYER_TIMES_CACHE}_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async (): Promise<LocationData> => {
    try {
      // On web, expo-location may not work; try browser geolocation
      if (Platform.OS === 'web') {
        const saved = await getLocation();
        if (saved) return saved;
        return DEFAULT_LOCATION;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const savedLocation = await getLocation();
        return savedLocation || DEFAULT_LOCATION;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      await saveLocation(locationData);
      return locationData;
    } catch (err) {
      console.warn('Location fetch failed, using fallback:', err);
      const savedLocation = await getLocation();
      return savedLocation || DEFAULT_LOCATION;
    }
  }, []);

  const loadPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Try loading from cache immediately for instant UI
      const cacheKey = getCacheKey();
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const cachedTimes: PrayerTimes = JSON.parse(cached);
        setPrayerTimes(cachedTimes);
        setIsLoading(false);
        // Fire-and-forget: refresh in background
        refreshInBackground(cacheKey);
        return;
      }

      // 2. No cache — load fresh
      let loc = location;
      loc ??= await fetchLocation();
      setLocation(loc);

      const times = await fetchPrayerTimes(loc);
      setPrayerTimes(times);

      // Cache for today
      await AsyncStorage.setItem(cacheKey, JSON.stringify(times));

      // Schedule notifications (fire-and-forget)
      scheduleNotificationsAsync(times);
    } catch (err) {
      setError(t('failedToLoadPrayerTimes'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [location, fetchLocation]);

  /** Background refresh: fetch fresh data and update cache + state silently */
  const refreshInBackground = async (cacheKey: string) => {
    try {
      let loc = location;
      loc ??= await fetchLocation();
      setLocation(loc);
      const times = await fetchPrayerTimes(loc);
      setPrayerTimes(times);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(times));
      scheduleNotificationsAsync(times);
    } catch {
      // Silently ignore — we already have cached data displayed
    }
  };

  const scheduleNotificationsAsync = async (times: PrayerTimes) => {
    try {
      const minutesStr = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_MINUTES_BEFORE);
      const minutesBefore = minutesStr ? Number(minutesStr) : 15;
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await schedulePrayerNotifications(times, minutesBefore);
      }
    } catch {
      // Silently ignore notification errors
    }
  };

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const refresh = useCallback(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  return {
    prayerTimes,
    location,
    isLoading,
    error,
    refresh,
    setManualLocation: async (loc: LocationData) => {
      await saveLocation(loc);
      setLocation(loc);
      loadPrayerTimes();
    },
  };
};
