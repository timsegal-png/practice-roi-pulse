import { useState } from 'react';
import { ODSInput } from './ODSInput';
import { ROIOutput } from './ROIOutput';
import { ROITable } from './ROITable';
import { calculateROI } from '@/lib/roiCalculations';
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
          {/* ROI Output - Main summary */}
          <ROIOutput calculation={calculation} />

          {/* Detailed Breakdown Table */}
          <ROITable calculation={calculation} />
        </div>
      )}
    </div>
  );
}
