import 'server-only';

export type AvailableLocale = 'en' | 'fi' | 'sv';

const dictionaries: Record<AvailableLocale, () => Promise<unknown>> = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  fi: () => import('../dictionaries/fi.json').then((module) => module.default),
  sv: () => import('../dictionaries/sv.json').then((module) => module.default),
};

export interface Dictionary {
  lander: {
    callToActionDownload: {
      title: string;
      description: string;
    };
    contractorLogoCarousel: {
      title: string;
    };
    heroSection: {
      title: string;
      description: string;
      actionPrimary: string;
      actionSecondary: string;
    };
    secondaryHero: {
      title: string;
      description: string;
      actionPrimary: string;
    };
    findNearYouSection: {
      title: string;
      description: string;
    };
    yourSupportSection: {
      title: string;
      description: string;
      additionalDescription: string;
      actionPrimary: string;
      imageTitle: string;
      imageDescription: string;
    };
    recomendedSection: {
      title: string;
      description: string;
      additionalDescription: string;
      actionPrimary: string;
    };
    faqSection: {
      title: string;
      description: string;
      faq1: {
        question: string;
        answer: string;
      };
      faq2: {
        question: string;
        answer: string;
      };
      faq3: {
        question: string;
        answer: string;
      };
      faq4: {
        question: string;
        answer: string;
      };
      faq5: {
        question: string;
        answer: string;
      };
      faq6: {
        question: string;
        answer: string;
      };
      faq7: {
        question: string;
        answer: string;
      };
    };
  };
  navigation: {
    dashboard: string;
    newRequest: string;
    orders: string;
    settings: string;
    logout: string;
    sendRequest: string;
    aboutUs: string;
    joinUs: string;
    customerService: string;
  };
  promotionHeader: string;
 
}


export const getDictionary = async (locale: AvailableLocale): Promise<Dictionary> => {
  let safeLocale = locale;
  if (!dictionaries[locale]) {
    safeLocale = 'fi';
  }
  return dictionaries[safeLocale]() as Promise<Dictionary>;
};
