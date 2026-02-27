"""
FarmEase — Translation Route
────────────────────────────
POST /api/translate
Translates a batch of English strings into an Indian regional language
using deep-translator (Google Translate under the hood).

Supports: hi, ta, te, kn, mr, bn, gu, pa, ml, or
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from deep_translator import GoogleTranslator

router = APIRouter()

# Languages accepted by this endpoint
SUPPORTED_LANGUAGES = {
    "en": "english",
    "hi": "hindi",
    "ta": "tamil",
    "te": "telugu",
    "kn": "kannada",
    "mr": "marathi",
    "bn": "bengali",
    "gu": "gujarati",
    "pa": "punjabi",
    "ml": "malayalam",
    "or": "odia",
}


class TranslateRequest(BaseModel):
    texts: List[str]          # Batch of strings to translate
    target_lang: str          # ISO 639-1 code, e.g. "hi"


class TranslateResponse(BaseModel):
    translations: List[str]
    target_lang: str


@router.post("/translate", response_model=TranslateResponse)
async def translate_texts(request: TranslateRequest):
    """
    Translate a batch of English strings into the requested Indian language.
    Returns original text if translation fails for a given string.
    """
    lang = request.target_lang.lower()

    # If English is requested just return as-is (no API call needed)
    if lang == "en":
        return TranslateResponse(
            translations=request.texts,
            target_lang="en",
        )

    if lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language '{lang}'. Supported: {list(SUPPORTED_LANGUAGES.keys())}",
        )

    if not request.texts:
        return TranslateResponse(translations=[], target_lang=lang)

    translations: List[str] = []

    try:
        translator = GoogleTranslator(source="en", target=lang)

        for text in request.texts:
            if not text or not text.strip():
                translations.append(text)
                continue
            try:
                translated = translator.translate(text)
                translations.append(translated or text)
            except Exception:
                # Fallback: return original text if individual translation fails
                translations.append(text)

    except Exception as e:
        # If we can't even init the translator, return originals
        return TranslateResponse(
            translations=request.texts,
            target_lang=lang,
        )

    return TranslateResponse(translations=translations, target_lang=lang)
