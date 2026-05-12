from __future__ import annotations

from typing import Any, Mapping

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from hantavirus_risk.data import infer_region
from hantavirus_risk.settings import CATEGORICAL_FEATURES, FEATURE_COLUMNS, NUMERIC_FEATURES


def make_model(random_state: int = 42) -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("numeric", StandardScaler(), NUMERIC_FEATURES),
        ]
    )
    classifier = RandomForestClassifier(
        n_estimators=250,
        max_depth=7,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=random_state,
    )
    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", classifier),
        ]
    )


def payload_to_frame(payload: Mapping[str, Any]) -> pd.DataFrame:
    row = dict(payload)
    row["state"] = str(row["state"])
    row["season"] = str(row["season"]).lower()
    row["region"] = row.get("region") or infer_region(row["state"])
    return pd.DataFrame([{column: row[column] for column in FEATURE_COLUMNS}])


def get_feature_names(model: Pipeline) -> list[str]:
    preprocessor = model.named_steps["preprocessor"]
    names = preprocessor.get_feature_names_out()
    return [name.replace("categorical__", "").replace("numeric__", "") for name in names]

