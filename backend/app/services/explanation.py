from app.models.process import FinancialData, TaxResult


def generate_explanation(
    total_income: int,
    deductions_applied: int,
    tax: TaxResult,
    data: FinancialData,
) -> str:
    """
    Simple deterministic explanation (no external AI).
    """
    regime = "Old regime" if tax.recommended == "old" else "New regime"
    chosen_tax = tax.old_tax if tax.recommended == "old" else tax.new_tax

    lines: list[str] = []
    lines.append(f"Total income considered: ₹{total_income:,}.")
    lines.append(f"Deductions applied (old regime rules): ₹{deductions_applied:,}.")
    lines.append(
        f"Computed tax: old ₹{tax.old_tax:,}, new ₹{tax.new_tax:,}. Recommended: {tax.recommended}."
    )
    lines.append(f"Chosen regime: {regime} (estimated tax ₹{chosen_tax:,}).")

    if int(data.deductions_80c) < 150_000:
        lines.append("You may have unused 80C headroom based on provided inputs.")

    return " ".join(lines)

