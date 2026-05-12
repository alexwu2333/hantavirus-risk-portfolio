from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

from hantavirus_risk.data import build_processed_dataset
from hantavirus_risk.features import get_feature_names, make_model
from hantavirus_risk.settings import (
    FEATURE_COLUMNS,
    METRICS_PATH,
    MODEL_CARD_PATH,
    MODEL_PATH,
    TARGET_COLUMN,
)


def _top_feature_importances(model: Any, limit: int = 12) -> list[dict[str, Any]]:
    names = get_feature_names(model)
    importances = model.named_steps["classifier"].feature_importances_
    ranked = sorted(zip(names, importances), key=lambda item: item[1], reverse=True)
    return [
        {"feature": feature, "importance": round(float(score), 5)}
        for feature, score in ranked[:limit]
    ]


def train_model(
    model_path: Path = MODEL_PATH,
    metrics_path: Path = METRICS_PATH,
    model_card_path: Path = MODEL_CARD_PATH,
) -> dict[str, Any]:
    df = build_processed_dataset()
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.28,
        random_state=42,
        stratify=y,
    )

    model = make_model()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "classification_report": classification_report(
            y_test,
            y_pred,
            output_dict=True,
            zero_division=0,
        ),
        "confusion_matrix": confusion_matrix(
            y_test,
            y_pred,
            labels=["low", "medium", "high"],
        ).tolist(),
        "labels": ["low", "medium", "high"],
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "source_type": sorted(df["source_type"].unique().tolist())
        if "source_type" in df.columns
        else ["unknown"],
    }

    model_path.parent.mkdir(parents=True, exist_ok=True)
    metrics_path.parent.mkdir(parents=True, exist_ok=True)
    model_card_path.parent.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, model_path)
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    model_card = {
        "model_name": "hantavirus-risk-random-forest",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "task": "state-level public-health risk classification",
        "target": TARGET_COLUMN,
        "features": FEATURE_COLUMNS,
        "risk_levels": ["low", "medium", "high"],
        "model_path": str(model_path),
        "metrics_path": str(metrics_path),
        "top_feature_importances": _top_feature_importances(model),
        "limitations": [
            "Demo data is not official surveillance data.",
            "Predictions are not clinical guidance.",
            "Sparse case counts make exact outbreak prediction inappropriate.",
        ],
    }
    model_card_path.write_text(json.dumps(model_card, indent=2), encoding="utf-8")
    return metrics


def main() -> None:
    metrics = train_model()
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()

