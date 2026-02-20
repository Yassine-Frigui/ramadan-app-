import * as Notifications from 'expo-notifications';
import { PrayerTimes, PrayerName } from '../types';
import { t, getPrayerLabel } from '../i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

const parseTimeString = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};

const scheduleNotification = async (
  id: string,
  title: string,
  body: string,
  hour: number,
  minute: number
): Promise<void> => {
  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger,
  });
};

export const schedulePrayerNotifications = async (prayers: PrayerTimes, minutesBefore: number = 15): Promise<void> => {
  await cancelAllNotifications();

  const prayerEntries: [PrayerName, string][] = [
    ['fajr', prayers.fajr],
    ['dhuhr', prayers.dhuhr],
    ['asr', prayers.asr],
    ['maghrib', prayers.maghrib],
    ['isha', prayers.isha],
  ];

  for (const [prayer, time] of prayerEntries) {
    const { hours, minutes } = parseTimeString(time);
    const prayerLabel = getPrayerLabel(prayer);

    await scheduleNotification(
      `${prayer}-adhan`,
      `${t('adhan')} - ${prayerLabel}`,
      t('prayerTime', { prayer: prayerLabel }),
      hours,
      minutes
    );

    const beforeHour = minutes >= minutesBefore ? hours : hours - 1;
    const beforeMinute = minutes >= minutesBefore ? minutes - minutesBefore : 60 + minutes - minutesBefore;

    if (beforeHour >= 0) {
      await scheduleNotification(
        `${prayer}-before`,
        t('prayerIn15', { prayer: prayerLabel }),
        t('prepareForPrayer', { prayer: prayerLabel }),
        beforeHour,
        beforeMinute
      );
    }
  }
};
