/**
 * Arabic date formatting utilities.
 * Provides full Arabic day/month names without external locale dependencies.
 */

const ARABIC_DAYS = [
  'الأحد',      // Sunday
  'الإثنين',    // Monday
  'الثلاثاء',   // Tuesday
  'الأربعاء',   // Wednesday
  'الخميس',     // Thursday
  'الجمعة',     // Friday
  'السبت',      // Saturday
];

const ARABIC_MONTHS = [
  'يناير',    // January
  'فبراير',   // February
  'مارس',     // March
  'أبريل',    // April
  'مايو',     // May
  'يونيو',    // June
  'يوليو',    // July
  'أغسطس',    // August
  'سبتمبر',   // September
  'أكتوبر',   // October
  'نوفمبر',   // November
  'ديسمبر',   // December
];

/**
 * Convert western digits to Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩).
 */
export const toArabicDigits = (num: number | string): string => {
  return String(num).replaceAll(/\d/g, (d) =>
    String.fromCodePoint(0x0660 + Number(d)),
  );
};

/**
 * Format a date fully in Arabic.
 * Example: "الخميس، 19 فبراير 2026"
 */
export const formatArabicDate = (date: Date): string => {
  const dayName = ARABIC_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}، ${dayNum} ${month} ${year}`;
};

/**
 * Get the Arabic day name only.
 */
export const getArabicDayName = (date: Date): string => {
  return ARABIC_DAYS[date.getDay()];
};

/**
 * Get the Arabic month name only.
 */
export const getArabicMonthName = (date: Date): string => {
  return ARABIC_MONTHS[date.getMonth()];
};
