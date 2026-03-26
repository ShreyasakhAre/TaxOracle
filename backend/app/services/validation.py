from dataclasses import dataclass
from app.models.process import FinancialData


@dataclass(frozen=True)
class ValidationResult:
    data: FinancialData
    flags: list[str]


def _cap_non_negative_int(value: int | None) -> int:
    if value is None:
        return 0
    return value if value >= 0 else 0


def validate_financial_data(data: FinancialData) -> ValidationResult:
    """
    Ensures:
    - no negative values
    - missing -> 0 (handled by models + defensive normalization)
    - unrealistic values flagged
    """
    flags: list[str] = []

    normalized = FinancialData(
        income_salary=_cap_non_negative_int(data.income_salary),
        income_other=_cap_non_negative_int(data.income_other),
        deductions_80c=_cap_non_negative_int(data.deductions_80c),
        deductions_other=_cap_non_negative_int(data.deductions_other),
        tds=_cap_non_negative_int(data.tds),
    )

    total_income = normalized.income_salary + normalized.income_other
    if total_income > 50_000_000:
        flags.append("Unrealistically high total income detected")

    if normalized.deductions_80c > 1_500_000:
        flags.append("Unrealistically high 80C deduction value detected")

    if normalized.tds > total_income and total_income > 0:
        flags.append("TDS exceeds total income (possible mismatch)")

    return ValidationResult(data=normalized, flags=flags)

