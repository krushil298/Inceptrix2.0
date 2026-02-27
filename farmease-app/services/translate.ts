/**
 * Translation service — wraps the FastAPI /api/translate endpoint.
 * Caches results in memory so repeated strings don't hit the network.
 */

import { FASTAPI_BASE_URL } from '../utils/constants';

// In-memory cache: { "hi:Hello" -> "नमस्ते" }
const cache: Record<string, string> = {};

function cacheKey(lang: string, text: string): string {
    return `${lang}:${text}`;
}

/**
 * Translate a batch of English strings to the target language.
 * Returns original strings if the API fails (graceful fallback).
 */
export async function translateBatch(
    texts: string[],
    targetLang: string
): Promise<string[]> {
    // English → return as-is
    if (targetLang === 'en') return texts;

    const results: string[] = new Array(texts.length);
    const uncachedIndices: number[] = [];
    const uncachedTexts: string[] = [];

    // Check cache first
    texts.forEach((text, i) => {
        const key = cacheKey(targetLang, text);
        if (cache[key] !== undefined) {
            results[i] = cache[key];
        } else {
            uncachedIndices.push(i);
            uncachedTexts.push(text);
        }
    });

    // Nothing new to fetch
    if (uncachedTexts.length === 0) return results;

    try {
        const response = await fetch(`${FASTAPI_BASE_URL}/api/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: uncachedTexts, target_lang: targetLang }),
        });

        if (!response.ok) throw new Error('Translation API error');

        const data: { translations: string[] } = await response.json();

        // Fill results and populate cache
        uncachedIndices.forEach((originalIdx, i) => {
            const translated = data.translations[i] ?? texts[originalIdx];
            results[originalIdx] = translated;
            cache[cacheKey(targetLang, texts[originalIdx])] = translated;
        });
    } catch {
        // Fallback: return original text for all uncached entries
        uncachedIndices.forEach((originalIdx) => {
            results[originalIdx] = texts[originalIdx];
        });
    }

    return results;
}

/**
 * Translate a single string. Convenience wrapper.
 */
export async function translateOne(text: string, targetLang: string): Promise<string> {
    const results = await translateBatch([text], targetLang);
    return results[0];
}
