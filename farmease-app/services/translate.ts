/**
 * Translation service — powered by MyMemory NLP Translation API.
 *
 * Calls https://api.mymemory.translated.net directly from the app.
 * No backend required. Free up to 5000 words/day.
 * Supports all Indian regional languages (hi, ta, te, kn, mr, bn, gu, pa, ml, or).
 *
 * In-memory cache ensures each string is only translated once per session.
 */

// In-memory cache: { "hi:Hello" -> "नमस्ते" }
const cache: Record<string, string> = {};

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

function cacheKey(lang: string, text: string): string {
    return `${lang}:${text}`;
}

/**
 * Translate a single string using the MyMemory NLP API.
 * Returns original text on failure.
 */
async function translateSingle(text: string, targetLang: string): Promise<string> {
    if (!text?.trim()) return text;

    const key = cacheKey(targetLang, text);
    if (cache[key] !== undefined) return cache[key];

    try {
        const params = new URLSearchParams({
            q: text,
            langpair: `en|${targetLang}`,
        });

        const response = await fetch(`${MYMEMORY_URL}?${params.toString()}`, {
            method: 'GET',
        });

        if (!response.ok) {
            cache[key] = text;
            return text;
        }

        const data = await response.json();

        // MyMemory returns { responseStatus: 200, responseData: { translatedText: "..." } }
        const translated: string =
            data?.responseData?.translatedText ?? text;

        // MyMemory sometimes returns the language code on failure — fall back to original
        const result = translated && translated !== targetLang ? translated : text;

        cache[key] = result;
        return result;
    } catch {
        cache[key] = text;
        return text;
    }
}

/**
 * Translate a batch of English strings to the target language.
 * Now runs translations sequentially with a tiny delay to avoid rate limiting/network overhead.
 */
export async function translateBatch(
    texts: string[],
    targetLang: string
): Promise<string[]> {
    if (targetLang === 'en') return texts;
    if (!texts.length) return texts;

    console.log(`[Translate] Batch translating ${texts.length} strings to ${targetLang}...`);

    const results: string[] = [];
    for (const text of texts) {
        const result = await translateSingle(text, targetLang);
        results.push(result);
        // Tiny 20ms delay to prevent hammering the API/network
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    return results;
}

/**
 * Translate a single string. Convenience wrapper.
 */
export async function translateOne(text: string, targetLang: string): Promise<string> {
    return translateSingle(text, targetLang);
}
