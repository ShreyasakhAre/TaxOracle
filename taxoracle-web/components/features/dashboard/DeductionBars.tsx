import { Card } from "@/components/ui/Card"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { DeductionBar } from "./DeductionBar"

export function DeductionBars({
  extracted,
}: {
  extracted: {
    deductions_80c: number
    deductions_other: number
  }
}) {
  const cap80c = 150000
  const used80cPct =
    cap80c > 0 ? Math.min(100, (extracted.deductions_80c / cap80c) * 100) : 0
  const capOther = 100000
  const otherPct =
    capOther > 0 ? Math.min(100, (extracted.deductions_other / capOther) * 100) : 0

  return (
    <Card className="p-8 glass-dark border-white/5 space-y-6">
      <SectionTitle title="Exemption & Deduction Index" subtitle="Optimization of Chapter VI-A investments" />

      <div className="mt-6 flex flex-col gap-6">
        <DeductionBar label="Section 80C Investments" usedPct={used80cPct} />
        <DeductionBar label="Supplemental Deductions" usedPct={otherPct} />
      </div>
    </Card>
  )
}

