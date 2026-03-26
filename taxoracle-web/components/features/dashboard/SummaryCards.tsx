import { SummaryCard } from "./SummaryCard"

export function SummaryCards({
  savings,
  savingsScore,
  riskScore,
  complianceScore,
  confidence,
}: {
  savings: number
  savingsScore: number
  riskScore: number
  complianceScore: number
  confidence: number
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard 
        label="Potential Savings" 
        value={savings} 
        prefix="₹" 
        progress={savingsScore}
        color="blue"
        subtitle="Optimization yield"
      />
      <SummaryCard 
        label="Compliance Health" 
        value={complianceScore} 
        suffix="%" 
        progress={complianceScore}
        color="emerald"
        subtitle="Slab-accuracy check"
      />
      <SummaryCard 
        label="Audit Risk" 
        value={riskScore} 
        progress={riskScore}
        color={riskScore > 60 ? "amber" : "blue"}
        subtitle="Exposure level"
      />
      <SummaryCard 
        label="AI Confidence" 
        value={Math.round(confidence * 100)} 
        suffix="%" 
        progress={Math.round(confidence * 100)}
        color="blue"
        subtitle="Extraction reliability"
      />
    </div>
  )
}

