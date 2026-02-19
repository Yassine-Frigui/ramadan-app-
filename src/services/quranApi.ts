import { API_ENDPOINTS } from '../constants';

export interface QuranPageResponse {
  data: {
    surahs: Array<{
      name: string;
      englishName: string;
      ayahs: Array<{
        text: string;
        number: number;
        page: number;
      }>;
    }>;
  };
}

export const fetchQuranPage = async (page: number): Promise<QuranPageResponse> => {
  const response = await fetch(`${API_ENDPOINTS.QURAN_BY_PAGE}/${page}/ar.alafasy`);
  if (!response.ok) {
    throw new Error('Failed to fetch Quran page');
  }
  return response.json();
};

export const fetchQuranPages = async (startPage: number, endPage: number): Promise<QuranPageResponse[]> => {
  const pages: QuranPageResponse[] = [];
  
  for (let page = startPage; page <= endPage; page++) {
    try {
      const data = await fetchQuranPage(page);
      pages.push(data);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }
  
  return pages;
};
