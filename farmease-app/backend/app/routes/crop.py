"""
Crop Recommendation Endpoint
─────────────────────────────
POST /predict/crop
Accepts soil and climate parameters, runs through a pre-trained
Random Forest model, and returns top crop suggestions.
"""

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings

router = APIRouter()
settings = get_settings()

# ── Request / Response schemas ────────────────────────────────

class CropInput(BaseModel):
    """Input features for crop recommendation."""
    nitrogen: float = Field(..., ge=0, le=200, description="Soil nitrogen content (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Soil phosphorus content (kg/ha)")
    potassium: float = Field(..., ge=0, le=200, description="Soil potassium content (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Average temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Average relative humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    rainfall: float = Field(..., ge=0, le=500, description="Average rainfall (mm)")


class CropPrediction(BaseModel):
    crop: str
    confidence: float
    description: str
    season: str
    water_requirement: str


# ── Crop info database (for enriching predictions) ───────────
CROP_INFO: dict[str, dict] = {
    "rice": {
        "description": "Staple cereal crop ideal for wet, tropical climates with abundant water supply.",
        "season": "Kharif (June–November)",
        "water_requirement": "High (1200–2000 mm)",
    },
    "wheat": {
        "description": "Major cereal crop suited for cool, dry climates. Grows best in loamy soil.",
        "season": "Rabi (November–April)",
        "water_requirement": "Medium (450–650 mm)",
    },
    "maize": {
        "description": "Versatile cereal crop grown across varied climates. Good for rotation farming.",
        "season": "Kharif / Rabi (year-round in some regions)",
        "water_requirement": "Medium (500–800 mm)",
    },
    "cotton": {
        "description": "Cash crop requiring warm climate and black soil. Important for textile industry.",
        "season": "Kharif (April–October)",
        "water_requirement": "Medium (700–1300 mm)",
    },
    "jute": {
        "description": "Natural fiber crop that grows well in warm, humid climates with alluvial soil.",
        "season": "Kharif (March–July)",
        "water_requirement": "High (1500–2000 mm)",
    },
    "coffee": {
        "description": "Plantation crop grown in tropical highlands. Requires shade and well-drained soil.",
        "season": "Year-round (harvest Nov–Feb)",
        "water_requirement": "Medium (1500–2500 mm)",
    },
    "mungbean": {
        "description": "Short-duration pulse crop rich in protein. Suitable for intercropping.",
        "season": "Kharif / Summer",
        "water_requirement": "Low (300–500 mm)",
    },
    "lentil": {
        "description": "Cool-season pulse crop high in protein. Grows well in loamy soil.",
        "season": "Rabi (October–March)",
        "water_requirement": "Low (250–500 mm)",
    },
    "pomegranate": {
        "description": "Drought-tolerant fruit crop. Thrives in semi-arid climates.",
        "season": "Year-round (3 seasons)",
        "water_requirement": "Low (500–700 mm)",
    },
    "banana": {
        "description": "Tropical fruit crop requiring rich soil, warmth, and consistent moisture.",
        "season": "Year-round",
        "water_requirement": "High (1200–2200 mm)",
    },
    "mango": {
        "description": "King of fruits. Deep-rooted tropical tree suited for warm, dry winters.",
        "season": "Summer (April–July harvest)",
        "water_requirement": "Medium (600–1000 mm)",
    },
    "chickpea": {
        "description": "Important pulse crop for dryland farming. Fixes nitrogen in soil.",
        "season": "Rabi (October–March)",
        "water_requirement": "Low (200–400 mm)",
    },
    "kidneybeans": {
        "description": "Protein-rich legume suited for cooler hill climates.",
        "season": "Kharif (June–September)",
        "water_requirement": "Medium (400–700 mm)",
    },
    "pigeonpeas": {
        "description": "Hardy pulse crop with deep root system. Excellent for soil improvement.",
        "season": "Kharif (June–November)",
        "water_requirement": "Low (350–600 mm)",
    },
    "mothbeans": {
        "description": "Drought-resistant pulse crop native to arid regions of India.",
        "season": "Kharif (July–October)",
        "water_requirement": "Very Low (200–400 mm)",
    },
    "blackgram": {
        "description": "Short-duration pulse crop. Grows well in warm, humid conditions.",
        "season": "Kharif / Rabi",
        "water_requirement": "Low (300–500 mm)",
    },
    "coconut": {
        "description": "Tropical crop with year-round yield. Requires sandy, well-drained soil.",
        "season": "Year-round",
        "water_requirement": "High (1500–2500 mm)",
    },
    "papaya": {
        "description": "Fast-growing tropical fruit. Sensitive to waterlogging.",
        "season": "Year-round (10 months to maturity)",
        "water_requirement": "Medium (1000–1500 mm)",
    },
    "orange": {
        "description": "Citrus fruit crop. Requires warm days, cool nights, and well-drained soil.",
        "season": "Winter harvest (Dec–Feb)",
        "water_requirement": "Medium (600–1200 mm)",
    },
    "apple": {
        "description": "Temperate fruit crop requiring chilling hours. Grows in hilly regions.",
        "season": "Summer–Autumn harvest",
        "water_requirement": "Medium (600–800 mm)",
    },
    "grapes": {
        "description": "Vine fruit suited for warm, dry climates. Requires trellising support.",
        "season": "Year-round (harvest Feb–May)",
        "water_requirement": "Low–Medium (500–800 mm)",
    },
    "watermelon": {
        "description": "Summer fruit crop needing warm weather and sandy loam soil.",
        "season": "Summer (Feb–June)",
        "water_requirement": "Medium (400–600 mm)",
    },
    "muskmelon": {
        "description": "Warm-season cucurbit. Requires hot, dry climate for sweetness.",
        "season": "Summer (Feb–May)",
        "water_requirement": "Medium (400–600 mm)",
    },
}

DEFAULT_CROP_INFO = {
    "description": "A suitable crop for your soil and climate conditions.",
    "season": "Consult local agricultural advisor",
    "water_requirement": "Varies — check regional guidelines",
}

# ── Lazy-loaded model ─────────────────────────────────────────
_model = None


def _load_model():
    """Load scikit-learn model lazily."""
    global _model
    if _model is not None:
        return _model

    model_path = settings.crop_model_abs
    if model_path.exists():
        try:
            import joblib
            _model = joblib.load(str(model_path))
            return _model
        except Exception as e:
            print(f"⚠️  Could not load crop model: {e}")
            return None
    else:
        print(f"⚠️  Crop model not found at {model_path} — using rule-based fallback")
        return None


def _rule_based_recommendation(data: CropInput) -> list[dict]:
    """Simple rule-based fallback when no ML model is available."""
    scores: list[tuple[str, float]] = []

    # Rice: high humidity, high rainfall, warm
    if data.humidity > 70 and data.rainfall > 150 and data.temperature > 20:
        scores.append(("rice", 0.90))
    # Wheat: moderate temp, lower humidity, moderate rainfall
    if 15 <= data.temperature <= 30 and data.humidity < 70 and data.rainfall < 150:
        scores.append(("wheat", 0.88))
    # Maize
    if 18 <= data.temperature <= 35 and data.ph >= 5.5:
        scores.append(("maize", 0.82))
    # Cotton: warm, black soil indicators
    if data.temperature > 25 and data.potassium > 30:
        scores.append(("cotton", 0.78))
    # Chickpea: cool, dry, low N demand
    if data.temperature < 30 and data.rainfall < 100 and data.nitrogen < 80:
        scores.append(("chickpea", 0.80))
    # Banana: tropical, high rain, rich soil
    if data.temperature > 25 and data.rainfall > 120 and data.nitrogen > 80:
        scores.append(("banana", 0.77))
    # Mango
    if data.temperature > 24 and data.ph >= 5.5 and data.ph <= 7.5:
        scores.append(("mango", 0.76))
    # Lentil
    if data.temperature < 28 and data.rainfall < 100:
        scores.append(("lentil", 0.75))
    # Coconut
    if data.temperature > 27 and data.humidity > 70 and data.rainfall > 150:
        scores.append(("coconut", 0.74))
    # Pomegranate
    if data.temperature > 25 and data.rainfall < 80:
        scores.append(("pomegranate", 0.73))

    # Sort by confidence descending, take top 5
    scores.sort(key=lambda x: x[1], reverse=True)
    if not scores:
        scores = [("rice", 0.60), ("wheat", 0.55), ("maize", 0.50)]

    results = []
    for crop_name, conf in scores[:5]:
        info = CROP_INFO.get(crop_name, DEFAULT_CROP_INFO)
        results.append({
            "crop": crop_name.capitalize(),
            "confidence": round(conf * 100, 2),
            **info,
        })
    return results


# ── Endpoint ──────────────────────────────────────────────────
@router.post("/crop")
async def recommend_crop(data: CropInput):
    """
    Submit soil & climate parameters → get top crop recommendations.
    """
    model = _load_model()

    if model is not None:
        # ── Real prediction ───────────────────────────────────
        features = np.array([[
            data.nitrogen, data.phosphorus, data.potassium,
            data.temperature, data.humidity, data.ph, data.rainfall,
        ]])
        try:
            probas = model.predict_proba(features)[0]
            classes = model.classes_
            # Top 5 by probability
            top_indices = np.argsort(probas)[::-1][:5]
            results = []
            for idx in top_indices:
                crop_name = str(classes[idx]).lower()
                info = CROP_INFO.get(crop_name, DEFAULT_CROP_INFO)
                results.append({
                    "crop": crop_name.capitalize(),
                    "confidence": round(float(probas[idx]) * 100, 2),
                    **info,
                })
            return {"success": True, "recommendations": results}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    else:
        # ── Rule-based fallback ───────────────────────────────
        results = _rule_based_recommendation(data)
        return {"success": True, "recommendations": results}
