import { Users, PoundSterling } from 'lucide-react';
import { ROICalculation, formatCurrency } from '@/lib/roiCalculations';

interface ROIOutputProps {
  calculation: ROICalculation;
}

export function ROIOutput({ calculation }: ROIOutputProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-sm animate-fade-in">
      {/* Practice Name Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {calculation.practiceName}
        </h2>
      </div>

      {/* Practice Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Patient list size</p>
            <p className="text-lg font-semibold text-foreground">{calculation.listSize.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <PoundSterling className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly licence fee</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(calculation.monthlyLicenseCost)}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground bg-muted/30 uppercase tracking-wide">
                Hours saved/month
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-accent bg-accent/10 uppercase tracking-wide">
                Monthly savings
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-accent bg-accent/10 uppercase tracking-wide">
                ROI
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-5 text-2xl font-semibold text-foreground">
                {Math.round(calculation.monthlyHoursSaved)}
              </td>
              <td className="px-4 py-5 text-2xl font-bold text-accent bg-accent/10">
                {formatCurrency(calculation.netMonthlySavings)}
              </td>
              <td className="px-4 py-5 text-2xl font-bold text-accent bg-accent/10">
                {calculation.roi.toFixed(1)}x
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footnote */}
      <p className="text-xs text-muted-foreground">
        Based on estimated usage for your practice size. Adjust figures in Detailed Breakdown below.
      </p>
    </div>
  );
}
