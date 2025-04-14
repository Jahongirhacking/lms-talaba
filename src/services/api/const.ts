import { getLocalStorage, localStorageNames } from '@/utils/storageFunc';

export const hostName = 'https://student.hemis.uz';
export const baseUrl = `${hostName}/rest/v1`;
export const apiTagTypes = ['Auth', 'Team', 'Organizations'];
export const uniLibraryBaseApi = 'https://api.unilibrary.uz';

export const getBaseUrl = (path: string, hasLang = true): string => {
  const basePath = getLocalStorage(localStorageNames.universityApi) || baseUrl;
  const lang = getLocalStorage(localStorageNames.language);
  return `${basePath}${path}${lang && hasLang ? `?l=${lang}` : ''}`;
};
