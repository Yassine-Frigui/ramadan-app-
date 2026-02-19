import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { PrayerTimes, LocationData } from '../types';
import { fetchPrayerTimes } from '../services/prayerTimesApi';
import { schedulePrayerNotifications, requestNotificationPermissions } from '../services/notifications';
import { getLocation, saveLocation } from '../storage/storage';
import { t } from '../i18n';

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async (): Promise<LocationData | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const savedLocation = await getLocation();
        return savedLocation;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      await saveLocation(locationData);
      return locationData;
    } catch (err) {
      const savedLocation = await getLocation();
      return savedLocation;
    }
  }, []);

  const loadPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let loc = location;
      
      if (!loc) {
        loc = await fetchLocation();
      }

      if (!loc) {
        setError(t('locationNotAvailable'));
        setIsLoading(false);
        return;
      }

      setLocation(loc);

      const times = await fetchPrayerTimes(loc);
      setPrayerTimes(times);

      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await schedulePrayerNotifications(times);
      }
    } catch (err) {
      setError(t('failedToLoadPrayerTimes'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [location, fetchLocation]);

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
