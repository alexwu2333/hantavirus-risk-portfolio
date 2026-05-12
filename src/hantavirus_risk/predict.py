from __future__ import annotations

from pathlib import Path
from typing import Any, Mapping

import joblib

from hantavirus_risk.features import payload_to_frame
from hantavirus_risk.settings import MODEL_PATH


def ensure_model(model_path: Path = MODEL_PATH) -> Any:
    if not model_path.exists():
        from hantavirus_risk.train import train_model

        train_model(model_path=model_path)
    return joblib.load(model_path)


def explain_drivers(payload: Mapping[str, Any]) -> list[str]:
    drivers: list[str] = []
    if float(payload["historical_cases"]) >= 5:
        drivers.append("Elevated historical state case signal")
    if float(payload["rodent_habitat_score"]) >= 75:
        drivers.append("High rodent habitat suitability proxy")
    if float(payload["drought_index"]) >= 3:
        drivers.append("Dry conditions that may increase human-rodent contact")
    if float(payload["rural_population_pct"]) >= 30:
        drivers.append("Higher rural exposure proxy")
    if str(payload["season"]).lower() in {"spring", "summer"}:
        drivers.append("Seasonal timing associated with more outdoor and cleanup exposure")
    if not drivers:
        drivers.append("No single dominant elevated-risk feature in the scenario")
    return drivers[:4]


def recommend_actions(risk_level: str) -> list[str]:
    base = [
        "Use CDC-safe cleanup practices around rodent droppings",
        "Seal food storage and building entry points to reduce rodent contact",
    ]
    if risk_level == "high":
        return base + [
            "Prioritize local surveillance review before high-exposure activities",
            "Monitor CDC/NNDSS updates for changes in regional reporting",
        ]
    if risk_level == "medium":
        return base + ["Re-check risk after updated weather or surveillance data arrives"]
    return base


def predict_risk(payload: Mapping[str, Any], model_path: Path = MODEL_PATH) -> dict[str, Any]:
    model = ensure_model(model_path)
    X = payload_to_frame(payload)
    risk_level = str(model.predict(X)[0])

    probabilities = {}
    if hasattr(model, "predict_proba"):
        classes = model.named_steps["classifier"].classes_
        values = model.predict_proba(X)[0]
        probabilities = {
            str(label): round(float(probability), 4)
            for label, probability in zip(classes, values)
        }

    confidence = probabilities.get(risk_level, 0.0)
    return {
        "risk_level": risk_level,
        "confidence": round(float(confidence), 4),
        "probabilities": probabilities,
        "drivers": explain_drivers(payload),
        "recommendations": recommend_actions(risk_level),
    }

