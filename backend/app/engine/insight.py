from __future__ import annotations

from app.models.process import ActionItem, FinancialData, Risk, TaxResult


def generate_insights(data: FinancialData, tax: TaxResult, risk: Risk) -> tuple[list[str], int]:
    """
    Returns (insights, savings_score)
    """
    insights: list[str] = []
    
    # Savings insight
    save = abs(tax.old_tax - tax.new_tax)
    if save > 0:
        insights.append(f"Optimized strategy found: ₹{save:,} annual savings potential")
    
    # Contextual insights
    income = int(data.income_salary + data.income_other)
    if income > 1_500_000 and tax.recommended == "new":
        insights.append("High income profile detected: New regime offers structural benefit")
    
    if int(data.deductions_80c) < 150_000:
        gap = 150_000 - int(data.deductions_80c)
        insights.append(f"Tax efficiency gap: ₹{gap:,} unused 80C headroom")

    # Score calculation
    savings_score = 0
    if income > 0:
        savings_score = min(100, int((save / income) * 500)) # Weighted score
    
    return insights, savings_score


def generate_actions(data: FinancialData, tax: TaxResult, risk: Risk) -> list[ActionItem]:
    actions: list[ActionItem] = []

    if tax.recommended == "new" and tax.old_tax > tax.new_tax:
        actions.append(ActionItem(
            title="Switch to New Regime",
            description=f"Switching will save you ₹{abs(tax.old_tax - tax.new_tax):,} instantly.",
            type="tax"
        ))

    if int(data.deductions_80c) < 150_000:
        actions.append(ActionItem(
            title="Maximize 80C",
            description="Invest ₹1.5L in ELSS/PPF to minimize old regime liability.",
            type="suggestion"
        ))

    if risk.score > 50:
        actions.append(ActionItem(
            title="Rectify TDS Mismatch",
            description="Your reported TDS is low. Verify against Form 26AS to avoid notices.",
            type="compliance"
        ))

    if not actions:
        actions.append(ActionItem(
            title="All Clear",
            description="Your tax profile looks optimized and compliant.",
            type="suggestion"
        ))

    return actions

