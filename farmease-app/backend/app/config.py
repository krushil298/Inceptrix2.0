"""
FarmEase Backend — Configuration
Loads environment variables with sensible defaults.
"""

import os
from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve paths relative to this file → backend/app/
BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    """Application settings loaded from .env or environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Supabase ──────────────────────────────────────────────
    supabase_url: str = "https://your-project.supabase.co"
    supabase_service_key: str = "your-service-role-key"

    # ── OpenWeatherMap ────────────────────────────────────────
    openweather_api_key: str = "your-openweathermap-api-key"

    # ── Server ────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    # ── ML Model Paths (relative to backend/app/) ────────────
    disease_model_path: str = "models/disease_model.h5"
    crop_model_path: str = "models/crop_model.pkl"
    fertilizer_model_path: str = "models/fertilizer_model.pkl"

    # ── CORS ──────────────────────────────────────────────────
    allowed_origins: list[str] = ["*"]

    @property
    def disease_model_abs(self) -> Path:
        return BASE_DIR / self.disease_model_path

    @property
    def crop_model_abs(self) -> Path:
        return BASE_DIR / self.crop_model_path

    @property
    def fertilizer_model_abs(self) -> Path:
        return BASE_DIR / self.fertilizer_model_path


@lru_cache()
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
