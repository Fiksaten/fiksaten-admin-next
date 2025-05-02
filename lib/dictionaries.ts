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
    login: string;
    register: string;
  };
  register: {
      register: string;
      consumer: string;
      contractor: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
      companyName: string;
      companyEmail: string;
      companyPhone: string;
      businessId: string;
      companyDescription: string;
  },
  verification: {
    phone: string;
    enter: string;
    send: string;
    registerSuccess: string;
    registerSuccessDescription: string
    registerFailed: string;
    registerFailedDescription: string;
    verificationSuccess: string;
    verificationSuccessDescription: string;
    verificationFailed: string;
    verificationFailedDescription: string;
  }
  validation: {
    required: string;
    invalid: string;
    password: {
      lowercase: string;
      uppercase: string;
      number: string;
      special: string;
      min: string;
    }
  }
  media: {
    toMedia: string;
    description: string;
    emailFor: string;
  }
  contact: {
    title: string;
    description: string;
    emailFor: string;
    callFor: string;
  }
  privacy: {
    mainTitle: string;
    lastUpdated: string;
    dataControllerTitle: string;
    dataControllerDescription: string;
    privacyPolicyTitle: string;
    privacyPolicyDescription: string;
    section1Title: string;
    section1Intro: string;
    section1DataPoints: {
      personal: string;
      location: string;
      payment: string;
      usage: string;
    };
    section2Title: string;
    section2Intro: string;
    section2Purposes: {
      service: string;
      communication: string;
      payments: string;
      marketing: string;
      analytics: string;
    };
    section3Title: string;
    section3Content: string;
    section4Title: string;
    section4Intro: string;
    section4Conditions: {
      consent: string;
      legal: string;
      providers: string;
    };
    section5Title: string;
    section5Intro: string;
    section5Rights: {
      access: string;
      correction: string;
      restriction: string;
      objection: string;
      portability: string;
    };
    contactInfo: string;

    cookiePolicyTitle: string;
    cookiePolicyIntro: string;

    cookieSection1Title: string;
    cookieSection1Content: string;

    cookieSection2Title: string;
    cookieSection2Functional: string;
    cookieSection2Analytics: string;
    cookieSection2Marketing: string;

    cookieSection3Title: string;
    cookieSection3Content: string;

    cookieSection4Title: string;
    cookieSection4Content: string;

    cookieContact: string;
    cookieChanges: string;
  }
  company: {
    badge: string;
    title: string;
    subtitle: string;
    imageAlt: string;
    about: {
      heading: string;
      description: string;
    };
    citiesHeading: string;
    cities: {
      helsinki: {
        name: string;
        population: string;
      };
      espoo: {
        name: string;
        population: string;
      };
      vantaa: {
        name: string;
        population: string;
      };
    };
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
