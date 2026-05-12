from __future__ import annotations

from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator

Season = Literal["spring", "summer", "fall", "winter"]
RiskLevel = Literal["low", "medium", "high"]


class RiskInput(BaseModel):
    state: str = Field(..., examples=["New Mexico"])
    year: int = Field(..., ge=1993, le=2100, examples=[2026])
    season: Season = Field(..., examples=["summer"])
    avg_temp_f: float = Field(..., ge=-40, le=130, examples=[77])
    precip_in: float = Field(..., ge=0, le=80, examples=[1.1])
    drought_index: float = Field(..., ge=0, le=5, examples=[3.5])
    rural_population_pct: float = Field(..., ge=0, le=100, examples=[36])
    forest_cover_pct: float = Field(..., ge=0, le=100, examples=[31])
    rodent_habitat_score: float = Field(..., ge=0, le=100, examples=[82])
    historical_cases: int = Field(..., ge=0, le=1000, examples=[7])
    region: Optional[str] = None

    @field_validator("state")
    @classmethod
    def title_case_state(cls, value: str) -> str:
        return value.strip().title()


class RiskResponse(BaseModel):
    risk_level: RiskLevel
    confidence: float
    probabilities: Dict[str, float]
    drivers: List[str]
    recommendations: List[str]

