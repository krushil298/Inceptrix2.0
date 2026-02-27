/**
 * useTranslation / usePreloadTranslations
 *
 * Architecture:
 * - translationCache: shared in-memory store (lang -> { original -> translated })
 * - usePreloadTranslations: fetches all strings for a screen when language changes
 *   and forces a re-render once translations arrive
 * - t(): reads from cache synchronously — shows original text until cache is ready
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translateBatch } from '../services/translate';

// Shared per-language cache across all components
const translationCache: Record<string, Record<string, string>> = {};

// Listeners notified when a language's cache is updated
type CacheListener = () => void;
const cacheListeners = new Set<CacheListener>();

function notifyCacheUpdated() {
    cacheListeners.forEach((fn) => fn());
}

export function useTranslation() {
    const { language } = useLanguageStore();

    // Subscribe to cache updates so t() returns fresh values after fetch
    const [, setTick] = useState(0);

    useEffect(() => {
        const listener: CacheListener = () => setTick((n) => n + 1);
        cacheListeners.add(listener);
        return () => { cacheListeners.delete(listener); };
    }, []);

    const t = useCallback(
        (text: string): string => {
            if (language === 'en' || !text) return text;
            return translationCache[language]?.[text] ?? text;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [language, translationCache[language]]
    );

    return { t, language };
}

/**
 * Pre-warm the translation cache for a given set of strings.
 * Call at the top of each screen with the list of strings it displays.
 *
 * Usage:
 *   const { t, isTranslating } = usePreloadTranslations(['Dashboard', 'Scan Crop']);
 */
export function usePreloadTranslations(strings: string[]) {
    const { language } = useLanguageStore();
    const [isTranslating, setIsTranslating] = useState(false);
    const prevLang = useRef<string>('');
    const prevStringsKey = useRef<string>('');

    // Subscribe to cache updates to re-render after translations arrive
    const [, setTick] = useState(0);

    useEffect(() => {
        const listener: CacheListener = () => setTick((n) => n + 1);
        cacheListeners.add(listener);
        return () => { cacheListeners.delete(listener); };
    }, []);

    useEffect(() => {
        if (language === 'en') {
            setIsTranslating(false);
            return;
        }

        const stringsKey = strings.join('||');

        // Skip if nothing changed
        if (prevLang.current === language && prevStringsKey.current === stringsKey) return;

        prevLang.current = language;
        prevStringsKey.current = stringsKey;

        // Only fetch strings not yet cached for this language
        const cached = translationCache[language] ?? {};
        const toFetch = strings.filter((s) => s && cached[s] === undefined);

        if (toFetch.length === 0) {
            setIsTranslating(false);
            return;
        }

        setIsTranslating(true);

        translateBatch(toFetch, language).then((translations) => {
            if (!translationCache[language]) translationCache[language] = {};
            toFetch.forEach((original, i) => {
                translationCache[language][original] = translations[i];
            });
            setIsTranslating(false);
            // Notify all subscribed components to re-render with new translations
            notifyCacheUpdated();
        });
    }, [language, strings]);

    const t = useCallback(
        (text: string): string => {
            if (language === 'en' || !text) return text;
            return translationCache[language]?.[text] ?? text;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [language, translationCache[language]]
    );

    return { t, isTranslating, language };
}
