import { format } from 'date-fns';
import { PrayerTimes, LocationData } from '../types';
import { API_ENDPOINTS, PRAYER_NAMES } from '../constants';

interface AlAdhanResponse {
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
    };
  };
}

export const fetchPrayerTimes = async (
  location: LocationData,
  date?: Date
): Promise<PrayerTimes> => {
  const targetDate = date || new Date();
  const dateString = format(targetDate, 'dd-MM-yyyy');
  
  const url = `${API_ENDPOINTS.PRAYER_TIMINGS}/${dateString}?latitude=${location.latitude}&longitude=${location.longitude}&method=4`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch prayer times');
  }
  
  const data: AlAdhanResponse = await response.json();
  
  return {
    fajr: data.data.timings.Fajr.split(' ')[0],
    dhuhr: data.data.timings.Dhuhr.split(' ')[0],
    asr: data.data.timings.Asr.split(' ')[0],
    maghrib: data.data.timings.Maghrib.split(' ')[0],
    isha: data.data.timings.Isha.split(' ')[0],
    date: data.data.date.readable,
  };
};

export const getPrayerTimeArray = (prayers: PrayerTimes): { name: string; time: string }[] => {
  return PRAYER_NAMES.map((name) => ({
    name,
    time: prayers[name],
  }));
};
