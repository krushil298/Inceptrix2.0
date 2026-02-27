"""
FarmEase Backend — Supabase Python Client
Uses the service-role key for full DB access (bypasses RLS).
"""

from functools import lru_cache

from supabase import create_client, Client

from app.config import get_settings


@lru_cache()
def get_supabase() -> Client:
    """Return a cached Supabase client (service-role — server-side only)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_key)
