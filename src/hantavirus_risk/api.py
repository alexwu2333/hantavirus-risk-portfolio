from __future__ import annotations

import json
from typing import Any

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from hantavirus_risk.data import STATE_REGIONS, load_demo_data
from hantavirus_risk.predict import predict_risk
from hantavirus_risk.schemas import RiskInput, RiskResponse
from hantavirus_risk.settings import METRICS_PATH, MODEL_CARD_PATH, STATIC_DIR

app = FastAPI(
    title="Hantavirus Risk Early-Warning API",
    version="0.1.0",
    description="State-level public-health risk forecasting API.",
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def dashboard() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/states")
def states() -> dict[str, Any]:
    df = load_demo_data()
    return {
        "states": sorted(df["state"].unique().tolist()),
        "regions": STATE_REGIONS,
        "seasons": ["spring", "summer", "fall", "winter"],
    }


@app.get("/metadata")
def metadata() -> dict[str, Any]:
    payload: dict[str, Any] = {}
    if MODEL_CARD_PATH.exists():
        payload["model_card"] = json.loads(MODEL_CARD_PATH.read_text(encoding="utf-8"))
    if METRICS_PATH.exists():
        payload["metrics"] = json.loads(METRICS_PATH.read_text(encoding="utf-8"))
    if not payload:
        payload["message"] = "Model has not been trained yet. POST /predict will train the MVP model lazily."
    return payload


@app.post("/predict", response_model=RiskResponse)
def predict(payload: RiskInput) -> dict[str, Any]:
    return predict_risk(payload.model_dump())

