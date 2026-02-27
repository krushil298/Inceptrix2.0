import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../utils/i18n';

const LANGUAGE_KEY = 'farmease_language';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    initialize: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'en',

    setLanguage: async (lang: Language) => {
        set({ language: lang });
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        } catch {}
    },

    initialize: async () => {
        try {
            const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (saved === 'en' || saved === 'hi') {
                set({ language: saved });
            }
        } catch {}
    },
}));
