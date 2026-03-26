from __future__ import annotations

from app.models.process import FinancialData, Risk


def compute_risk(data: FinancialData, validation_flags: list[str]) -> tuple[Risk, int]:
    """
    Returns (Risk, compliance_score)
    """
    flags: list[str] = []
    score = 0

    if validation_flags:
        score += min(40, 15 * len(validation_flags))
        flags.extend(validation_flags)

    # Compliance specific: 80C check
    cap_80c = 150_000
    used_80c = int(data.deductions_80c)
    if used_80c < cap_80c * 0.3:
        score += 15
        flags.append("Significant 80C headroom unused (Compliance gap)")

    # Income validation
    income = int(data.income_salary + data.income_other)
    if income == 0:
        score += 50
        flags.append("No income sources detected - unable to verify tax liability")

    # TDS check
    if income > 0:
        tds_ratio = float(data.tds) / float(income)
        if tds_ratio < 0.01:
            score += 30
            flags.append("Critical TDS mismatch: tax paid is < 1% of income")

    score = max(0, min(100, score))
    compliance_score = max(0, 100 - score)

    if score < 30:
        level = "low"
    elif score <= 60:
        level = "medium"
    else:
        level = "high"

    return Risk(score=score, level=level, flags=flags), compliance_score

