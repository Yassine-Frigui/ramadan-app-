import quranPages from './quran.json';

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  juz: number;
  hizb: number;
}

export interface QuranSurahInfo {
  number: number;
  name: string;
  englishName: string;
}

export interface QuranPage {
  pageNumber: number;
  ayahs: QuranAyah[];
  surahInfo: QuranSurahInfo[];
}

const pages: QuranPage[] = quranPages as QuranPage[];

export const getQuranPage = (pageNumber: number): QuranPage | null => {
  if (pageNumber < 1 || pageNumber > 604) return null;
  return pages[pageNumber - 1] || null;
};

export const getTotalPages = (): number => pages.length;

export const getPageSurahNames = (pageNumber: number): string => {
  const page = getQuranPage(pageNumber);
  if (!page) return '';
  return page.surahInfo.map((s) => s.name).join(' - ');
};

export const getPageJuz = (pageNumber: number): number => {
  const page = getQuranPage(pageNumber);
  if (!page || page.ayahs.length === 0) return 0;
  return page.ayahs[0].juz;
};
