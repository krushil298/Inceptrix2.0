"""
Weather Proxy Endpoint
───────────────────────
GET  /api/weather?lat=...&lon=...
GET  /api/weather/forecast?lat=...&lon=...

Proxies OpenWeatherMap API so the mobile app doesn't expose the API key.
"""

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.config import get_settings

router = APIRouter()
settings = get_settings()

OWM_BASE = "https://api.openweathermap.org/data/2.5"


@router.get("/weather")
async def get_current_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    units: str = Query("metric", description="Units: metric / imperial"),
):
    """Get current weather for a location (proxies OpenWeatherMap)."""
    api_key = settings.openweather_api_key

    if api_key == "your-openweathermap-api-key":
        # Return demo data when no key is set
        return _mock_current_weather(lat, lon)

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(
                f"{OWM_BASE}/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": api_key,
                    "units": units,
                },
            )
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Weather API error")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Weather service unavailable")


@router.get("/weather/forecast")
async def get_forecast(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    units: str = Query("metric", description="Units: metric / imperial"),
):
    """Get 5-day / 3-hour forecast (proxies OpenWeatherMap)."""
    api_key = settings.openweather_api_key

    if api_key == "your-openweathermap-api-key":
        return _mock_forecast(lat, lon)

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(
                f"{OWM_BASE}/forecast",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": api_key,
                    "units": units,
                },
            )
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Forecast API error")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Forecast service unavailable")


# ── Mock data for demo ────────────────────────────────────────
def _mock_current_weather(lat: float, lon: float) -> dict:
    return {
        "coord": {"lat": lat, "lon": lon},
        "weather": [
            {
                "id": 802,
                "main": "Clouds",
                "description": "scattered clouds",
                "icon": "03d",
            }
        ],
        "main": {
            "temp": 28.5,
            "feels_like": 31.2,
            "temp_min": 26.0,
            "temp_max": 31.0,
            "pressure": 1012,
            "humidity": 65,
        },
        "visibility": 10000,
        "wind": {"speed": 3.5, "deg": 180},
        "clouds": {"all": 40},
        "name": "Bengaluru",
        "sys": {"country": "IN"},
        "_mock": True,
    }


def _mock_forecast(lat: float, lon: float) -> dict:
    return {
        "city": {"name": "Bengaluru", "country": "IN", "coord": {"lat": lat, "lon": lon}},
        "cnt": 5,
        "list": [
            {
                "dt_txt": "2026-02-28 09:00:00",
                "main": {"temp": 27.0, "humidity": 60},
                "weather": [{"main": "Clear", "description": "clear sky", "icon": "01d"}],
            },
            {
                "dt_txt": "2026-02-28 15:00:00",
                "main": {"temp": 32.0, "humidity": 45},
                "weather": [{"main": "Clouds", "description": "few clouds", "icon": "02d"}],
            },
            {
                "dt_txt": "2026-03-01 09:00:00",
                "main": {"temp": 26.0, "humidity": 70},
                "weather": [{"main": "Rain", "description": "light rain", "icon": "10d"}],
            },
            {
                "dt_txt": "2026-03-01 15:00:00",
                "main": {"temp": 29.0, "humidity": 55},
                "weather": [{"main": "Clouds", "description": "scattered clouds", "icon": "03d"}],
            },
            {
                "dt_txt": "2026-03-02 09:00:00",
                "main": {"temp": 28.0, "humidity": 58},
                "weather": [{"main": "Clear", "description": "clear sky", "icon": "01d"}],
            },
        ],
        "_mock": True,
    }
