import { TrendingUp, Calendar } from 'lucide-react';
import { ROICalculation, formatCurrency, formatPercentage } from '@/lib/roiCalculations';

interface ROISummaryProps {
  calculation: ROICalculation;
}

export function ROISummary({ calculation }: ROISummaryProps) {
  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-primary-foreground shadow-soft animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary-foreground/20">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">ROI Summary</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-primary-foreground/70 text-sm uppercase tracking-wide">Monthly Net Savings</p>
          <p className="text-4xl font-bold">{formatCurrency(calculation.netMonthlySavings)}</p>
          <p className="text-sm text-primary-foreground/60">
            After {formatCurrency(calculation.monthlyLicenseCost)} license cost
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-primary-foreground/70 text-sm uppercase tracking-wide">Return on Investment</p>
          <p className="text-4xl font-bold">{formatPercentage(calculation.roi)}</p>
          <p className="text-sm text-primary-foreground/60">
            {calculation.monthlyScribes.toLocaleString()} scribes/month
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-primary-foreground/20">
        <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Annual Projection</span>
        </div>
        <p className="text-3xl font-bold">
          {formatCurrency(calculation.annualSavings)}
          <span className="text-lg font-normal text-primary-foreground/70 ml-2">per year</span>
        </p>
      </div>
    </div>
  );
}
