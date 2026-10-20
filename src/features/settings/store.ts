import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LanguageSetting = 'system' | 'en' | 'hu';

type SettingsState = {
  currency: string; // active currency code; every screen is scoped to it
  language: LanguageSetting;
  setCurrency: (currency: string) => void;
  setLanguage: (language: LanguageSetting) => void;
};

// Synchronous storage, so settings are available before the first render.
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'HUF',
      language: 'system',
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => ({
        getItem: (key) => Storage.getItemSync(key),
        setItem: (key, value) => Storage.setItemSync(key, value),
        removeItem: (key) => Storage.removeItemSync(key),
      })),
    },
  ),
);
