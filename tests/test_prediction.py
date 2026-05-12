from hantavirus_risk.predict import predict_risk


def test_prediction_contract():
    payload = {
        "state": "New Mexico",
        "year": 2026,
        "season": "summer",
        "avg_temp_f": 77,
        "precip_in": 1.1,
        "drought_index": 3.5,
        "rural_population_pct": 36,
        "forest_cover_pct": 31,
        "rodent_habitat_score": 82,
        "historical_cases": 7,
        "region": "Southwest",
    }
    result = predict_risk(payload)
    assert result["risk_level"] in {"low", "medium", "high"}
    assert 0 <= result["confidence"] <= 1
    assert result["drivers"]
