from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

NonNegativeInt = Annotated[int, Field(default=0, ge=0)]
NonNegativeFloat = Annotated[float, Field(default=0.0, ge=0)]


class FinancialData(BaseModel):
    model_config = ConfigDict(strict=True)

    income_salary: NonNegativeInt = 0
    income_other: NonNegativeInt = 0
    deductions_80c: NonNegativeInt = 0
    deductions_other: NonNegativeInt = 0
    tds: NonNegativeInt = 0


class TaxResult(BaseModel):
    model_config = ConfigDict(strict=True)

    old_tax: NonNegativeInt = 0
    new_tax: NonNegativeInt = 0
    recommended: Literal["old", "new"] = "old"


class Risk(BaseModel):
    model_config = ConfigDict(strict=True)

    score: Annotated[int, Field(default=0, ge=0, le=100)] = 0
    level: Literal["low", "medium", "high"] = "low"
    flags: list[str] = Field(default_factory=list)


class ActionItem(BaseModel):
    model_config = ConfigDict(strict=True)
    title: str
    description: str
    type: Literal["tax", "compliance", "error", "suggestion"] = "suggestion"


class ReportData(BaseModel):
    model_config = ConfigDict(strict=True)
    summary: str
    download_url: str | None = None
    generated_at: str | None = None


class ProcessResponse(BaseModel):
    model_config = ConfigDict(strict=True)

    session_id: str = "0"
    extracted_data: FinancialData = Field(default_factory=FinancialData)
    tax_result: TaxResult = Field(default_factory=TaxResult)
    risk: Risk = Field(default_factory=Risk)
    compliance_score: Annotated[int, Field(default=0, ge=0, le=100)] = 0
    savings_score: Annotated[int, Field(default=0, ge=0, le=100)] = 0
    insights: list[str] = Field(default_factory=list)
    actions: list[ActionItem] = Field(default_factory=list)
    confidence: Annotated[float, Field(default=0.0, ge=0.0, le=1.0)] = 0.0
    explanation: str = ""
    report: ReportData | None = None

