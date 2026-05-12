from __future__ import annotations

from pathlib import Path
from typing import Mapping

import pandas as pd

from hantavirus_risk.settings import (
    DEMO_DATA_PATH,
    FEATURE_COLUMNS,
    PROCESSED_DATA_PATH,
    TARGET_COLUMN,
)

STATE_REGIONS: Mapping[str, str] = {
    "Arizona": "Southwest",
    "New Mexico": "Southwest",
    "Colorado": "Mountain West",
    "Utah": "Mountain West",
    "Nevada": "Mountain West",
    "California": "West Coast",
    "Oregon": "Pacific Northwest",
    "Washington": "Pacific Northwest",
    "Texas": "South Central",
    "Montana": "Northern Rockies",
    "New York": "Northeast",
}


def infer_region(state: str) -> str:
    """Return a coarse region label for supported demo states."""
    return STATE_REGIONS.get(state, "Other")


def load_demo_data(path: Path = DEMO_DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)
    validate_training_frame(df)
    return df


def validate_training_frame(df: pd.DataFrame) -> None:
    missing = sorted(set(FEATURE_COLUMNS + [TARGET_COLUMN]) - set(df.columns))
    if missing:
        raise ValueError(f"Training data is missing required columns: {missing}")


def build_processed_dataset(
    input_path: Path = DEMO_DATA_PATH,
    output_path: Path = PROCESSED_DATA_PATH,
) -> pd.DataFrame:
    df = load_demo_data(input_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    return df


def fetch_cdc_nndss_weekly_hantavirus(limit: int = 50000) -> pd.DataFrame:
    """Fetch provisional NNDSS rows that mention hantavirus.

    This function is intentionally separate from the MVP training path because
    weekly NNDSS data is provisional and needs careful cleaning before modeling.
    """
    url = (
        "https://data.cdc.gov/resource/x9gk-5huc.json"
        f"?$limit={limit}&$where=upper(label) like '%25HANTAVIRUS%25'"
    )
    return pd.read_json(url)

