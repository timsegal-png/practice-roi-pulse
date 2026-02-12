import { useState } from 'react';
import { ODSInput } from './ODSInput';
import { ROIOutput } from './ROIOutput';
import { ROITable } from './ROITable';
import { 
  calculateROI, 
  estimateMonthlyScribes, 
  DEFAULT_CLINICIAN_HOURLY_COST,
} from '@/lib/roiCalculations';
import type { PracticeData } from '@/lib/odsData';
import type { ROICalculation } from '@/lib/roiCalculations';

export function Calculator() {
  const [practice, setPractice] = useState<PracticeData | null>(null);
  const [calculation, setCalculation] = useState<ROICalculation | null>(null);
  
  // Editable overrides (only scribes and clinician cost are editable)
  const [useActualValues, setUseActualValues] = useState(false);
  const [monthlyScribes, setMonthlyScribes] = useState<number>(500);
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
    setMonthlyScribes(estimatedScribes);
    setUseActualValues(false);
    setClinicianHourlyCost(DEFAULT_CLINICIAN_HOURLY_COST);
    recalculate(foundPractice, false, estimatedScribes, DEFAULT_CLINICIAN_HOURLY_COST);
  };

  const handleReset = () => {
    setPractice(null);
    setCalculation(null);
    setUseActualValues(false);
    setMonthlyScribes(500);
    setClinicianHourlyCost(DEFAULT_CLINICIAN_HOURLY_COST);
  };

  const handleToggleActual = (isActual: boolean) => {
    setUseActualValues(isActual);
    if (practice) {
      if (!isActual) {
        const estimatedScribes = estimateMonthlyScribes(practice.listSize);
        setMonthlyScribes(estimatedScribes);
      }
      recalculate(practice, isActual, monthlyScribes, clinicianHourlyCost);
    }
  };

  const handleScribesChange = (value: number) => {
    setMonthlyScribes(value);
    if (practice && useActualValues) {
      recalculate(practice, true, value, clinicianHourlyCost);
    }
  };

  const handleClinicianCostChange = (value: number) => {
    setClinicianHourlyCost(value);
    if (practice && useActualValues) {
      recalculate(practice, true, monthlyScribes, value);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-primary mb-2">
            Enter your practice details
          </h2>
          <p className="text-muted-foreground text-sm">
            Input your ODS code to calculate potential savings with Scribe
          </p>
        </div>
        <ODSInput onPracticeFound={handlePracticeFound} onReset={handleReset} />
      </section>

      {/* Results Section */}
      {practice && calculation && (
        <div className="space-y-8 animate-fade-in">
          {/* ROI Output - Main summary */}
          <ROIOutput calculation={calculation} useActualValues={useActualValues} />

          {/* Detailed Breakdown Table */}
          <ROITable 
            calculation={calculation}
            useActualValues={useActualValues}
            monthlyScribes={monthlyScribes}
            clinicianHourlyCost={clinicianHourlyCost}
            onToggleActual={handleToggleActual}
            onScribesChange={handleScribesChange}
            onClinicianCostChange={handleClinicianCostChange}
          />
        </div>
      )}
    </div>
  );
}
