// useTranslation.ts — hook to get the t() function for the current language
import { translations } from '../utils/i18n';
import { useLanguageStore } from '../store/useLanguageStore';

type NestedKeyOf<T> = {
    [K in keyof T & string]: T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K;
}[keyof T & string];

// Simple recursive getter
function getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : path), obj);
}

export function useTranslation() {
    const { language } = useLanguageStore();
    const dict = translations[language];

    const t = (key: string): string => {
        return getNestedValue(dict, key) as string;
    };

    return { t, language };
}
