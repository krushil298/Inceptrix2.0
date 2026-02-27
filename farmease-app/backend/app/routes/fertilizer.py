"""
Fertilizer Advisory Endpoint
──────────────────────────────
POST /predict/fertilizer
Accepts soil nutrient levels and crop type, returns fertilizer recommendations.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings

router = APIRouter()
settings = get_settings()

# ── Request schema ────────────────────────────────────────────

class FertilizerInput(BaseModel):
    """Input features for fertilizer recommendation."""
    nitrogen: float = Field(..., ge=0, le=200, description="Current soil nitrogen (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Current soil phosphorus (kg/ha)")
    potassium: float = Field(..., ge=0, le=200, description="Current soil potassium (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    moisture: float = Field(..., ge=0, le=100, description="Soil moisture (%)")
    soil_type: str = Field(..., description="Soil type (e.g. Loam, Clay, Sandy)")
    crop_type: str = Field(..., description="Target crop name")


# ── Fertilizer knowledge base ────────────────────────────────
FERTILIZER_DB: dict[str, dict] = {
    "high_N": {
        "fertilizer": "Urea (46-0-0)",
        "description": "Soil has excess nitrogen. Reduce nitrogen fertilizer application.",
        "advice": [
            "Skip nitrogen top-dressing this season",
            "Consider growing nitrogen-fixing cover crops to balance",
            "Monitor leaf color — dark green indicates excess N",
            "Excess nitrogen can delay maturity and attract pests",
        ],
        "type": "reduce",
    },
    "low_N": {
        "fertilizer": "Urea (46-0-0) or Ammonium Sulphate",
        "description": "Soil nitrogen is deficient. Apply nitrogen-rich fertilizer.",
        "advice": [
            "Apply 40–60 kg/ha Urea in split doses",
            "First dose at sowing, second at 30 days",
            "Incorporate organic manure (FYM) at 5–10 t/ha",
            "Intercrop with legumes for natural N fixation",
        ],
        "type": "add",
    },
    "high_P": {
        "fertilizer": "None (reduce phosphorus)",
        "description": "Soil has excess phosphorus. Avoid phosphatic fertilizers.",
        "advice": [
            "Skip DAP/SSP application this season",
            "Excess P can block zinc and iron uptake",
            "Use zinc sulphate foliar spray if deficiency symptoms appear",
            "Avoid bone meal or rock phosphate amendments",
        ],
        "type": "reduce",
    },
    "low_P": {
        "fertilizer": "DAP (18-46-0) or Single Super Phosphate",
        "description": "Soil phosphorus is deficient. Apply phosphatic fertilizer.",
        "advice": [
            "Apply 50–60 kg/ha DAP at sowing time",
            "Mix with organic compost for better availability",
            "Phosphorus is immobile — place near root zone",
            "Consider rock phosphate for acidic soils",
        ],
        "type": "add",
    },
    "high_K": {
        "fertilizer": "None (reduce potassium)",
        "description": "Soil potassium is adequate/excess. Reduce K application.",
        "advice": [
            "Skip Muriate of Potash (MOP) this season",
            "Excess K can interfere with Mg and Ca uptake",
            "Monitor for magnesium deficiency symptoms",
        ],
        "type": "reduce",
    },
    "low_K": {
        "fertilizer": "Muriate of Potash (MOP 0-0-60)",
        "description": "Soil potassium is deficient. Apply potassic fertilizer.",
        "advice": [
            "Apply 40–50 kg/ha MOP at sowing/transplanting",
            "Split application: 50 % basal + 50 % top-dress",
            "Use Sulphate of Potash (SOP) for chloride-sensitive crops",
            "Wood ash is a good organic K source",
        ],
        "type": "add",
    },
}

# Optimal NPK ranges for common crops (N, P, K — kg/ha)
CROP_NPK_OPTIMAL: dict[str, tuple[tuple[float, float], tuple[float, float], tuple[float, float]]] = {
    "rice":       ((60, 120), (30, 60), (30, 60)),
    "wheat":      ((80, 120), (40, 60), (30, 50)),
    "maize":      ((80, 140), (40, 70), (30, 60)),
    "cotton":     ((60, 100), (30, 50), (30, 50)),
    "sugarcane":  ((120, 200), (60, 80), (60, 80)),
    "potato":     ((80, 120), (50, 70), (60, 100)),
    "tomato":     ((80, 120), (60, 80), (60, 100)),
    "banana":     ((100, 150), (40, 60), (100, 150)),
    "mango":      ((40, 80),  (20, 40), (40, 80)),
}

DEFAULT_OPTIMAL = ((60, 100), (30, 60), (30, 60))

# ── Lazy-loaded model ─────────────────────────────────────────
_model = None


def _load_model():
    global _model
    if _model is not None:
        return _model

    model_path = settings.fertilizer_model_abs
    if model_path.exists():
        try:
            import joblib
            _model = joblib.load(str(model_path))
            return _model
        except Exception as e:
            print(f"⚠️  Could not load fertilizer model: {e}")
            return None
    else:
        print(f"⚠️  Fertilizer model not found at {model_path} — using rule-based fallback")
        return None


def _rule_based_advice(data: FertilizerInput) -> dict:
    """Generate fertilizer advice from simple nutrient thresholds."""
    crop_key = data.crop_type.lower().strip()
    optimal = CROP_NPK_OPTIMAL.get(crop_key, DEFAULT_OPTIMAL)
    n_range, p_range, k_range = optimal

    recommendations = []

    # Nitrogen
    if data.nitrogen > n_range[1]:
        recommendations.append(FERTILIZER_DB["high_N"])
    elif data.nitrogen < n_range[0]:
        recommendations.append(FERTILIZER_DB["low_N"])

    # Phosphorus
    if data.phosphorus > p_range[1]:
        recommendations.append(FERTILIZER_DB["high_P"])
    elif data.phosphorus < p_range[0]:
        recommendations.append(FERTILIZER_DB["low_P"])

    # Potassium
    if data.potassium > k_range[1]:
        recommendations.append(FERTILIZER_DB["high_K"])
    elif data.potassium < k_range[0]:
        recommendations.append(FERTILIZER_DB["low_K"])

    if not recommendations:
        recommendations.append({
            "fertilizer": "Balanced NPK (10-26-26 or 20-20-0)",
            "description": "Soil nutrients are within optimal range. Apply balanced maintenance dose.",
            "advice": [
                "Apply a low-dose balanced NPK fertilizer",
                "Supplement with organic compost or vermicompost",
                "Conduct soil test again before next season",
            ],
            "type": "maintain",
        })

    return {
        "crop": data.crop_type,
        "soil_type": data.soil_type,
        "current_npk": {
            "nitrogen": data.nitrogen,
            "phosphorus": data.phosphorus,
            "potassium": data.potassium,
        },
        "optimal_npk": {
            "nitrogen": list(n_range),
            "phosphorus": list(p_range),
            "potassium": list(k_range),
        },
        "recommendations": recommendations,
    }


# ── Endpoint ──────────────────────────────────────────────────
@router.post("/fertilizer")
async def recommend_fertilizer(data: FertilizerInput):
    """
    Submit soil nutrients + crop → get fertilizer recommendations.
    """
    model = _load_model()

    if model is not None:
        try:
            import numpy as np
            # Encode soil type simply
            soil_types = ["loam", "clay", "sandy", "silt", "peat", "chalk", "red soil", "black soil", "alluvial", "laterite"]
            soil_idx = soil_types.index(data.soil_type.lower()) if data.soil_type.lower() in soil_types else 0

            features = np.array([[
                data.nitrogen, data.phosphorus, data.potassium,
                data.temperature, data.humidity, data.moisture, soil_idx,
            ]])
            prediction = model.predict(features)[0]
            return {
                "success": True,
                "prediction": str(prediction),
                "details": _rule_based_advice(data),
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    else:
        result = _rule_based_advice(data)
        return {"success": True, **result}
