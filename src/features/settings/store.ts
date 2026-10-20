import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  currency: string; // active currency code; every screen is scoped to it
  setCurrency: (currency: string) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'HUF',
      setCurrency: (currency) => set({ currency }),
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
