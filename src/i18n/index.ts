export { ar } from './ar';
export { en } from './en';

export type Language = 'ar' | 'en';
export type TranslationKey = keyof typeof import('./ar').ar;

const translations: Record<Language, Record<string, string>> = {
  ar: require('./ar').ar,
  en: require('./en').en,
};

let currentLanguage: Language = 'ar'; // Arabic first

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const getLanguage = (): Language => currentLanguage;

export const isRTL = (): boolean => currentLanguage === 'ar';

/**
 * Translate a key with optional interpolation.
 * Usage: t('dayOf', { day: 5, total: 30 }) → "اليوم 5 من 30"
 */
export const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
  let text = translations[currentLanguage][key] || translations['ar'][key] || key;

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replaceAll(`{{${param}}}`, String(value));
    });
  }

  return text;
};

/**
 * Get prayer label in current language
 */
export const getPrayerLabel = (prayerName: string): string => {
  const key = prayerName.toLowerCase() as TranslationKey;
  return t(key);
};
