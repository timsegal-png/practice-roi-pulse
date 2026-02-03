import { useState } from 'react';
import { Clock, Edit3, Timer, PoundSterling, TrendingUp } from 'lucide-react';
import { ODSInput } from './ODSInput';
import { PracticeInfo } from './PracticeInfo';
import { MetricCard } from './MetricCard';
import { ROISummary } from './ROISummary';
import { ROITable } from './ROITable';
import { calculateROI, formatTime, formatHours, formatCurrency, formatPercentage } from '@/lib/roiCalculations';
import type { PracticeData } from '@/lib/odsData';
import type { ROICalculation } from '@/lib/roiCalculations';

export function Calculator() {
  const [practice, setPractice] = useState<PracticeData | null>(null);
  const [calculation, setCalculation] = useState<ROICalculation | null>(null);

  const handlePracticeFound = (foundPractice: PracticeData) => {
    setPractice(foundPractice);
    const roi = calculateROI(foundPractice.name, foundPractice.listSize);
    setCalculation(roi);
  };

  const handleReset = () => {
    setPractice(null);
    setCalculation(null);
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-card rounded-2xl border border-border p-8 shadow-card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Enter your practice details
          </h2>
          <p className="text-muted-foreground">
            Input your ODS code to calculate potential savings with Scribe
          </p>
        </div>
        <ODSInput onPracticeFound={handlePracticeFound} onReset={handleReset} />
      </section>

      {/* Results Section */}
      {practice && calculation && (
        <div className="space-y-8 animate-fade-in">
          {/* Practice Info */}
          <PracticeInfo 
            name={practice.name} 
            odsCode={practice.odsCode} 
            listSize={practice.listSize} 
          />

          {/* Key Metrics Grid */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                label="Avg Edit Time"
                value={formatTime(calculation.avgEditTime)}
                icon={<Edit3 className="w-4 h-4 text-primary" />}
                subValue="Per scribe"
              />
              <MetricCard
                label="Time Saved"
                value={formatTime(calculation.timeSavedPerScribe)}
                icon={<Clock className="w-4 h-4 text-primary" />}
                subValue="Per appointment"
              />
              <MetricCard
                label="Monthly Hours"
                value={formatHours(calculation.monthlyHoursSaved)}
                icon={<Timer className="w-4 h-4 text-primary" />}
                subValue="Recovered time"
              />
              <MetricCard
                label="Monthly Savings"
                value={formatCurrency(calculation.netMonthlySavings)}
                icon={<PoundSterling className="w-4 h-4 text-success" />}
                highlight
                subValue="Net of license"
              />
              <MetricCard
                label="ROI"
                value={formatPercentage(calculation.roi)}
                icon={<TrendingUp className="w-4 h-4 text-success" />}
                highlight
                subValue="Return on investment"
              />
            </div>
          </section>

          {/* ROI Summary Card */}
          <ROISummary calculation={calculation} />

          {/* Detailed Table */}
          <ROITable calculation={calculation} />
        </div>
      )}
    </div>
  );
}
