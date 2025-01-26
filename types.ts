interface FAQ {
  id: number;
  category: {
    en: string;
    fr: string;
  };
  question: {
    en: string;
    fr: string;
  };
  answer: {
    en: string;
    fr: string;
  };
}

interface Translations {
  en: {
    placeholder: string;
    send: string;
  };
  fr: {
    placeholder: string;
    send: string;
  };
}
