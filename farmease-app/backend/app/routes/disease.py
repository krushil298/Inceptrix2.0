"""
Disease Detection Endpoint
──────────────────────────
POST /predict/disease
Accepts an image file, runs it through a pre-trained PlantVillage CNN,
and returns the disease name, confidence, and treatment steps.
"""

import io
from pathlib import Path

import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image

from app.config import get_settings
from app.supabase_client import get_supabase

router = APIRouter()
settings = get_settings()

# ── Class labels from PlantVillage dataset ────────────────────
DISEASE_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry___Powdery_mildew",
    "Cherry___healthy",
    "Corn___Cercospora_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper___Bacterial_spot",
    "Pepper___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]

# ── Treatment database (demo data) ───────────────────────────
TREATMENTS: dict[str, dict] = {
    "Apple___Apple_scab": {
        "disease": "Apple Scab",
        "cause": "Fungus Venturia inaequalis",
        "symptoms": ["Olive-green or brown spots on leaves", "Scabby fruit lesions"],
        "treatment": [
            "Apply fungicide (Mancozeb or Captan) during early spring",
            "Remove and destroy fallen infected leaves",
            "Prune trees to improve air circulation",
            "Plant scab-resistant apple varieties",
        ],
    },
    "Tomato___Late_blight": {
        "disease": "Late Blight",
        "cause": "Oomycete Phytophthora infestans",
        "symptoms": ["Water-soaked lesions on leaves", "White mold on leaf undersides", "Brown firm rot on fruit"],
        "treatment": [
            "Apply copper-based fungicide immediately",
            "Remove and destroy infected plants",
            "Avoid overhead irrigation",
            "Ensure proper plant spacing for airflow",
        ],
    },
    "Tomato___Early_blight": {
        "disease": "Early Blight",
        "cause": "Fungus Alternaria solani",
        "symptoms": ["Dark concentric rings on lower leaves", "Yellowing around spots", "Leaf drop"],
        "treatment": [
            "Apply chlorothalonil or copper fungicide",
            "Mulch around plant base to prevent soil splash",
            "Practice crop rotation (3-year cycle)",
            "Remove infected leaves promptly",
        ],
    },
    "Potato___Late_blight": {
        "disease": "Potato Late Blight",
        "cause": "Oomycete Phytophthora infestans",
        "symptoms": ["Dark water-soaked lesions on leaves", "White fungal growth on undersides"],
        "treatment": [
            "Apply Metalaxyl-based fungicide",
            "Destroy infected tubers and plant debris",
            "Use certified disease-free seed potatoes",
            "Avoid excessive irrigation",
        ],
    },
    "Corn___Common_rust": {
        "disease": "Common Rust",
        "cause": "Fungus Puccinia sorghi",
        "symptoms": ["Small reddish-brown pustules on both leaf surfaces"],
        "treatment": [
            "Apply foliar fungicide (Azoxystrobin)",
            "Plant rust-resistant hybrids",
            "Plant early to avoid peak infection period",
        ],
    },
}

# Default treatment for diseases not in our lookup
DEFAULT_TREATMENT = {
    "disease": "Unknown Disease",
    "cause": "Requires further analysis",
    "symptoms": ["Visible abnormalities on plant tissue"],
    "treatment": [
        "Consult a local agricultural extension officer",
        "Take clear photographs and send to plant pathology lab",
        "Isolate affected plants to prevent spread",
        "Avoid overhead watering until diagnosed",
    ],
}

# ── Lazy-loaded model ─────────────────────────────────────────
_model = None


def _load_model():
    """Load TensorFlow model lazily on first request."""
    global _model
    if _model is not None:
        return _model

    model_path = settings.disease_model_abs
    if model_path.exists():
        try:
            import tensorflow as tf
            _model = tf.keras.models.load_model(str(model_path))
            return _model
        except Exception as e:
            print(f"⚠️  Could not load disease model: {e}")
            return None
    else:
        print(f"⚠️  Disease model not found at {model_path} — using mock predictions")
        return None


def _preprocess_image(image: Image.Image) -> np.ndarray:
    """Resize and normalize image for the CNN."""
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    return np.expand_dims(img_array, axis=0)


def _get_treatment(class_name: str) -> dict:
    """Look up treatment info, fall back to default."""
    info = TREATMENTS.get(class_name, DEFAULT_TREATMENT).copy()
    if info["disease"] == "Unknown Disease":
        # Parse a readable name from class label
        parts = class_name.split("___")
        plant = parts[0] if len(parts) > 0 else "Plant"
        disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
        info["disease"] = f"{plant} — {disease}"
    return info


# ── Endpoint ──────────────────────────────────────────────────
@router.post("/disease")
async def predict_disease(file: UploadFile = File(...)):
    """
    Upload a leaf image → get disease prediction + treatment.
    Returns JSON with disease name, confidence %, and treatment steps.
    """
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images are accepted.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    model = _load_model()

    if model is not None:
        # ── Real prediction ───────────────────────────────────
        img_array = _preprocess_image(image)
        predictions = model.predict(img_array, verbose=0)
        predicted_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_idx])
        class_name = DISEASE_CLASSES[predicted_idx] if predicted_idx < len(DISEASE_CLASSES) else "Unknown"
    else:
        # ── Mock prediction for demo ──────────────────────────
        import random
        predicted_idx = random.randint(0, len(DISEASE_CLASSES) - 1)
        class_name = DISEASE_CLASSES[predicted_idx]
        confidence = round(random.uniform(0.80, 0.98), 4)

    is_healthy = "healthy" in class_name.lower()
    treatment = _get_treatment(class_name)

    return {
        "success": True,
        "prediction": {
            "class": class_name,
            "disease": treatment["disease"],
            "confidence": round(confidence * 100, 2),
            "is_healthy": is_healthy,
        },
        "treatment": None if is_healthy else treatment,
    }
