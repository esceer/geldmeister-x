import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import hu from './hu.json';

export const languages = ['en', 'hu'] as const;
export type Language = (typeof languages)[number];

const deviceLanguage = getLocales()[0]?.languageCode;

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hu: { translation: hu } },
  lng: deviceLanguage === 'hu' ? 'hu' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
