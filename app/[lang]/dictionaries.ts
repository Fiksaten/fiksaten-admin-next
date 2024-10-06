import 'server-only';

export type AvailableLocale = 'en' | 'fi' | 'sv';

const dictionaries: Record<AvailableLocale, () => Promise<unknown>> = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  fi: () => import('../../dictionaries/fi.json').then((module) => module.default),
  sv: () => import('../../dictionaries/sv.json').then((module) => module.default),
};

export const getDictionary = async (locale: AvailableLocale) => {
  let safeLocale = locale;
  if (!dictionaries[locale]) {
    safeLocale = 'fi';
  }
  return dictionaries[safeLocale]();
};
