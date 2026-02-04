import { useState, useEffect } from 'react';
import { ODSInput } from './ODSInput';
import { ROIOutput } from './ROIOutput';
import { ROITable } from './ROITable';
import { calculateROI, estimateMonthlyScribes, DEFAULT_CLINICIAN_HOURLY_COST } from '@/lib/roiCalculations';
import type { PracticeData } from '@/lib/odsData';
import type { ROICalculation } from '@/lib/roiCalculations';

export function Calculator() {
  const [practice, setPractice] = useState<PracticeData | null>(null);
  const [calculation, setCalculation] = useState<ROICalculation | null>(null);
  
  // Editable overrides
  const [useActualScribes, setUseActualScribes] = useState(false);
  const [actualScribes, setActualScribes] = useState<number>(1200);
  const [clinicianHourlyCost, setClinicianHourlyCost] = useState<number>(DEFAULT_CLINICIAN_HOURLY_COST);

  const recalculate = (
    foundPractice: PracticeData,
    isActual: boolean,
    scribes: number,
    hourlyCost: number
  ) => {
    const roi = calculateROI(foundPractice.name, foundPractice.listSize, {
      monthlyScribes: isActual ? scribes : undefined,
      clinicianHourlyCost: hourlyCost,
    });
    setCalculation(roi);
  };

  const handlePracticeFound = (foundPractice: PracticeData) => {
    setPractice(foundPractice);
    const estimatedScribes = estimateMonthlyScribes(foundPractice.listSize);
    setActualScribes(estimatedScribes);
    setUseActualScribes(false);
    setClinicianHourlyCost(DEFAULT_CLINICIAN_HOURLY_COST);
    recalculate(foundPractice, false, estimatedScribes, DEFAULT_CLINICIAN_HOURLY_COST);
  };

  const handleReset = () => {
    setPractice(null);
    setCalculation(null);
    setUseActualScribes(false);
    setActualScribes(1200);
    setClinicianHourlyCost(DEFAULT_CLINICIAN_HOURLY_COST);
  };

  const handleScribesToggle = (isActual: boolean) => {
    setUseActualScribes(isActual);
    if (practice) {
      recalculate(practice, isActual, actualScribes, clinicianHourlyCost);
    }
  };

  const handleScribesChange = (value: number) => {
    setActualScribes(value);
    if (practice && useActualScribes) {
      recalculate(practice, true, value, clinicianHourlyCost);
    }
  };

  const handleClinicianCostChange = (value: number) => {
    setClinicianHourlyCost(value);
    if (practice) {
      recalculate(practice, useActualScribes, actualScribes, value);
    }
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
          <ROIOutput 
            calculation={calculation}
            useActualScribes={useActualScribes}
            actualScribes={actualScribes}
            clinicianHourlyCost={clinicianHourlyCost}
            onScribesToggle={handleScribesToggle}
            onScribesChange={handleScribesChange}
            onClinicianCostChange={handleClinicianCostChange}
          />

          {/* Detailed Breakdown Table */}
          <ROITable calculation={calculation} />
        </div>
      )}
    </div>
  );
}
