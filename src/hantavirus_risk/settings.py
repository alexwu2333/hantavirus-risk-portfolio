from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DEMO_DATA_PATH = PROJECT_ROOT / "data" / "demo" / "hantavirus_risk_demo.csv"
PROCESSED_DATA_PATH = PROJECT_ROOT / "data" / "processed" / "training_dataset.csv"
MODEL_PATH = PROJECT_ROOT / "models" / "risk_model.joblib"
MODEL_CARD_PATH = PROJECT_ROOT / "models" / "model_card.json"
METRICS_PATH = PROJECT_ROOT / "reports" / "metrics.json"
STATIC_DIR = PROJECT_ROOT / "app" / "static"

CATEGORICAL_FEATURES = ["state", "season", "region"]
NUMERIC_FEATURES = [
    "year",
    "avg_temp_f",
    "precip_in",
    "drought_index",
    "rural_population_pct",
    "forest_cover_pct",
    "rodent_habitat_score",
    "historical_cases",
]
FEATURE_COLUMNS = CATEGORICAL_FEATURES + NUMERIC_FEATURES
TARGET_COLUMN = "risk_level"
RISK_LEVELS = ["low", "medium", "high"]

