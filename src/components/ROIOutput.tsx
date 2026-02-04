import { Users, PoundSterling, Mic } from 'lucide-react';
import { ROICalculation, formatCurrency } from '@/lib/roiCalculations';
interface ROIOutputProps {
  calculation: ROICalculation;
}
export function ROIOutput({
  calculation
}: ROIOutputProps) {
  return <div className="bg-card rounded-2xl border border-border p-8 shadow-card animate-fade-in">
      {/* Practice Name Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {calculation.practiceName}
        </h2>
      </div>

      {/* Practice Info Rows */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground">
            Patient list: <span className="font-semibold">{calculation.listSize.toLocaleString()}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <PoundSterling className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground">
            License fee cost: <span className="font-semibold">{formatCurrency(calculation.monthlyLicenseCost)}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground">Average Monthly Scribes*: 1,200<span className="font-semibold">{calculation.monthlyScribes.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground bg-muted/30">
                Avg edit time per scribe (in seconds)
              </th>
              <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground bg-muted/30">Time saved per scribe (seconds)**</th>
              <th className="px-4 py-4 text-left text-sm font-medium text-muted-foreground bg-muted/30">
                Monthly time saved (hours)
              </th>
              <th className="px-4 py-4 text-left text-sm font-medium text-primary bg-success/10">Monthly savings***</th>
              <th className="px-4 py-4 text-left text-sm font-medium text-primary bg-success/10">
                ROI
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-5 text-2xl font-semibold text-foreground">
                {calculation.avgEditTime}
              </td>
              <td className="px-4 py-5 text-2xl font-semibold text-foreground">
                {calculation.timeSavedPerScribe}
              </td>
              <td className="px-4 py-5 text-2xl font-semibold text-foreground">
                {Math.round(calculation.monthlyHoursSaved)}
              </td>
              <td className="px-4 py-5 text-2xl font-bold text-primary bg-success/10">
                {formatCurrency(calculation.netMonthlySavings)}
              </td>
              <td className="px-4 py-5 text-2xl font-bold text-primary bg-success/10">
                {calculation.roi.toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footnotes */}
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>*Average number of scribes for a practice with this list size
**Assumes 420 second - or 7 minute - time spent to write notes after an appointment</p>
        <p>***Clinician time saved in hours multiplied by an estimated £80 per hour cost for a clinician, minus the monthly cost of Scribe</p>
      </div>
    </div>;
}