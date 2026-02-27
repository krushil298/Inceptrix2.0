/**
 * Language Store — persists the user's selected language across sessions.
 * Uses AsyncStorage via zustand/middleware persist.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr' | 'bn' | 'gu' | 'pa' | 'ml' | 'or';

interface LanguageState {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'farmease-language',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
