from hantavirus_risk.data import infer_region, load_demo_data
from hantavirus_risk.settings import FEATURE_COLUMNS, TARGET_COLUMN


def test_demo_data_has_required_columns():
    df = load_demo_data()
    assert set(FEATURE_COLUMNS + [TARGET_COLUMN]).issubset(df.columns)
    assert set(df[TARGET_COLUMN].unique()) == {"low", "medium", "high"}


def test_region_inference_for_supported_state():
    assert infer_region("New Mexico") == "Southwest"

