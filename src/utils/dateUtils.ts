import { format, parseISO, isToday } from 'date-fns';

export const formatTime = (time: string): string => {
  return time;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy');
};

export const getCurrentRamadanDay = (startDate: Date): number => {
  const today = new Date();
  const start = new Date(startDate);
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

export const isRamadanToday = (): boolean => {
  return isToday(new Date());
};

export const getCurrentDateString = (): string => {
  return format(new Date(), 'dd-MM-yyyy');
};
