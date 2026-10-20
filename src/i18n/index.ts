import { getLocales } from 'expo-localization';
import i18n, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { useSettings, type LanguageSetting } from '@/features/settings/store';

import en from './en.json';
import hu from './hu.json';

export const languages = ['en', 'hu'] as const;
export type Language = (typeof languages)[number];

export function resolveLanguage(setting: LanguageSetting): Language {
  if (setting !== 'system') return setting;
  return getLocales()[0]?.languageCode === 'hu' ? 'hu' : 'en';
}

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hu: { translation: hu } },
  lng: resolveLanguage(useSettings.getState().language),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Follow the language setting.
useSettings.subscribe((state, previous) => {
  if (state.language !== previous.language) changeLanguage(resolveLanguage(state.language));
});

export default i18n;
