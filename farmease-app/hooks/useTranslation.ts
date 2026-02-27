/**
 * useTranslation — the main hook for translating UI strings.
 *
 * Usage:
 *   const { t, language, isTranslating } = useTranslation();
 *   <Text>{t('Dashboard')}</Text>
 *
 * When language === 'en': t() returns the string immediately, no API call.
 * When language changes: all registered strings are re-translated in one batch.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translateBatch } from '../services/translate';

// Global registry — every mounted component registers its strings here
// so we can batch-translate all at once when language changes.
type Listener = () => void;
const registry = new Map<string, Set<Listener>>();

function registerString(text: string, listener: Listener) {
    if (!registry.has(text)) registry.set(text, new Set());
    registry.get(text)!.add(listener);
    return () => registry.get(text)?.delete(listener);
}

// Per-language translation store (in-memory, shared across components)
const translationCache: Record<string, Record<string, string>> = {};

export function useTranslation() {
    const { language } = useLanguageStore();
    const [, forceUpdate] = useState(0);

    // Expose a t() function that returns translated text synchronously from cache
    const t = useCallback(
        (text: string): string => {
            if (language === 'en' || !text) return text;
            return translationCache[language]?.[text] ?? text; // return original while loading
        },
        [language]
    );

    return { t, language };
}

/**
 * Pre-warm the translation cache for a given set of strings.
 * Call this at the top of each screen so translations are ready before render.
 *
 * Usage:
 *   usePreloadTranslations(['Dashboard', 'Scan Crop', 'Marketplace']);
 */
export function usePreloadTranslations(strings: string[]) {
    const { language } = useLanguageStore();
    const [isTranslating, setIsTranslating] = useState(false);
    const prevLang = useRef<string>('');
    const prevStrings = useRef<string[]>([]);

    useEffect(() => {
        // Skip if English or nothing to translate
        if (language === 'en') {
            setIsTranslating(false);
            return;
        }

        // Skip if language and strings haven't changed
        const stringsKey = strings.join('||');
        if (prevLang.current === language && prevStrings.current.join('||') === stringsKey) return;

        prevLang.current = language;
        prevStrings.current = strings;

        // Only fetch strings not already in cache for this language
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
        });
    }, [language, strings]);

    const { language: lang } = useLanguageStore();
    const t = useCallback(
        (text: string): string => {
            if (lang === 'en' || !text) return text;
            return translationCache[lang]?.[text] ?? text;
        },
        [lang]
    );

    return { t, isTranslating, language };
}
