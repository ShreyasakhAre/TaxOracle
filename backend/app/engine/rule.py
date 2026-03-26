from __future__ import annotations

from dataclasses import dataclass

from app.models.process import FinancialData, TaxResult


DEDUCTION_80C_CAP = 150_000


@dataclass(frozen=True)
class RuleEngineResult:
    tax_result: TaxResult
    total_income: int
    deductions_applied: int
    taxable_old: int
    taxable_new: int


def total_income(data: FinancialData) -> int:
    """
    Total income for MVP = salary + other.
    """
    return int(data.income_salary + data.income_other)


def apply_deductions_old_regime(data: FinancialData) -> int:
    """
    Old regime deductions:
    - 80C capped at 1.5L
    - other deductions included as-is for MVP
    """
    d80c = min(int(data.deductions_80c), DEDUCTION_80C_CAP)
    other = int(data.deductions_other)
    return max(0, d80c + other)


def compute_tax_old_regime(taxable: int) -> int:
    """
    Old regime slab tax (simplified, no cess/surcharge):
    - 0–2.5L: 0%
    - 2.5–5L: 5%
    - 5–10L: 20%
    - >10L: 30%
    """
    t = max(0, int(taxable))
    tax = 0.0

    if t <= 250_000:
        tax = 0.0
    elif t <= 500_000:
        tax = (t - 250_000) * 0.05
    elif t <= 1_000_000:
        tax = (250_000 * 0.05) + (t - 500_000) * 0.20
    else:
        tax = (250_000 * 0.05) + (500_000 * 0.20) + (t - 1_000_000) * 0.30

    return max(0, int(round(tax)))


def compute_tax_new_regime(taxable: int) -> int:
    """
    New regime slab tax (simplified, no cess/surcharge):
    - 0–3L: 0%
    - 3–6L: 5%
    - 6–9L: 10%
    - 9–12L: 15%
    - 12–15L: 20%
    - >15L: 30%
    """
    t = max(0, int(taxable))
    tax = 0.0

    slabs = [
        (300_000, 0.00),
        (600_000, 0.05),
        (900_000, 0.10),
        (1_200_000, 0.15),
        (1_500_000, 0.20),
        (10**18, 0.30),
    ]

    prev = 0
    for limit, rate in slabs:
        if t <= prev:
            break
        upper = min(t, limit)
        tax += max(0, upper - prev) * rate
        prev = limit

    return max(0, int(round(tax)))


def compare_and_recommend(data: FinancialData) -> RuleEngineResult:
    """
    Compares old vs new regime and recommends the lower tax.
    """
    ti = total_income(data)

    std_deduction = 50_000 if data.income_salary > 0 else 0
    deductions = apply_deductions_old_regime(data) + std_deduction
    taxable_old = max(0, ti - deductions)
    taxable_new = max(0, ti - std_deduction)  # New regime standard deduction

    old_tax = compute_tax_old_regime(taxable_old)
    new_tax = compute_tax_new_regime(taxable_new)

    recommended = "old" if old_tax <= new_tax else "new"

    return RuleEngineResult(
        tax_result=TaxResult(old_tax=old_tax, new_tax=new_tax, recommended=recommended),
        total_income=ti,
        deductions_applied=deductions,
        taxable_old=taxable_old,
        taxable_new=taxable_new,
    )

