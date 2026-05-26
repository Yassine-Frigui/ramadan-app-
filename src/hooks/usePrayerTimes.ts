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

  /**
   * Load prayer times with offline-first strategy:
   * 1. If today's cache exists → use it, do NOT hit the network.
   * 2. If no cache → fetch from network once, save, schedule notifications.
   * @param forceRefresh  bypass the cache and fetch fresh data (manual refresh)
   */
  const loadPrayerTimes = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey();

      // ── Offline path: return cache if available (unless forced) ──
      if (!forceRefresh) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const cachedTimes: PrayerTimes = JSON.parse(cached);
          setPrayerTimes(cachedTimes);
          setIsLoading(false);
          return; // No network call at all
        }
      }

      // ── Online path: fetch once, cache, schedule notifications ──
      let loc = location;
      loc ??= await fetchLocation();
      setLocation(loc);

      const times = await fetchPrayerTimes(loc);
      setPrayerTimes(times);

      // Persist for the rest of the day
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

  /** Manual refresh — forces a network fetch even if cache exists */
  const refresh = useCallback(() => {
    loadPrayerTimes(true);
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
      // Force refresh after location change so we get times for the new coords
      loadPrayerTimes(true);
    },
  };
};
