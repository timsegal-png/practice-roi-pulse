import { ROICalculation, formatCurrency, formatHours, formatTime, formatPercentage } from '@/lib/roiCalculations';

interface ROITableProps {
  calculation: ROICalculation;
}

export function ROITable({ calculation }: ROITableProps) {
  const rows = [
    { label: 'Baseline note writing time', value: formatTime(calculation.baselineNoteTime), description: 'Time to write notes without Scribe' },
    { label: 'Average edit time with Scribe', value: formatTime(calculation.avgEditTime), description: 'Time to review & edit AI-generated notes' },
    { label: 'Time saved per scribe', value: formatTime(calculation.timeSavedPerScribe), description: 'Net time savings per appointment' },
    { label: 'Estimated monthly scribes', value: calculation.monthlyScribes.toLocaleString(), description: 'Based on patient list size' },
    { label: 'Monthly hours saved', value: formatHours(calculation.monthlyHoursSaved), description: 'Total clinician time recovered' },
    { label: 'Clinician hourly cost', value: formatCurrency(calculation.clinicianHourlyCost), description: 'Average cost per hour' },
    { label: 'Gross monthly savings', value: formatCurrency(calculation.grossMonthlySavings), description: 'Value of time saved' },
    { label: 'License cost per scribe', value: formatCurrency(calculation.licenseCostPerScribe, 2), description: 'Based on practice size band' },
    { label: 'Monthly license cost', value: formatCurrency(calculation.monthlyLicenseCost), description: 'Total Scribe subscription' },
    { label: 'Net monthly savings', value: formatCurrency(calculation.netMonthlySavings), description: 'After license costs', highlight: true },
    { label: 'Return on Investment', value: formatPercentage(calculation.roi), description: 'Net savings ÷ license cost', highlight: true },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card animate-slide-up">
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Detailed Breakdown</h3>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row, index) => (
          <div 
            key={row.label} 
            className={`px-6 py-4 flex items-center justify-between transition-colors hover:bg-muted/20 ${row.highlight ? 'bg-success/5' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div>
              <span className={`font-medium ${row.highlight ? 'text-success' : 'text-foreground'}`}>
                {row.label}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
            </div>
            <span className={`font-semibold text-lg ${row.highlight ? 'text-success' : 'text-foreground'}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
