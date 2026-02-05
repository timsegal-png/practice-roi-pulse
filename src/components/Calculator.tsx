import { useState } from 'react';
import { ODSInput } from './ODSInput';
import { ROIOutput } from './ROIOutput';
import { ROITable } from './ROITable';
import { 
  calculateROI, 
  estimateMonthlyScribes, 
  DEFAULT_CLINICIAN_HOURLY_COST,
  BASELINE_NOTE_TIME_SECONDS,
  AVG_EDIT_TIME_SECONDS,
} from '@/lib/roiCalculations';
import type { PracticeData } from '@/lib/odsData';
import type { ROICalculation } from '@/lib/roiCalculations';

export function Calculator() {
  const [practice, setPractice] = useState<PracticeData | null>(null);
  const [calculation, setCalculation] = useState<ROICalculation | null>(null);
  
  // Editable overrides
  const [useActualValues, setUseActualValues] = useState(false);
  const [baselineNoteTime, setBaselineNoteTime] = useState<number>(BASELINE_NOTE_TIME_SECONDS);
  const [timeSavedPerScribe, setTimeSavedPerScribe] = useState<number>(BASELINE_NOTE_TIME_SECONDS - AVG_EDIT_TIME_SECONDS);
  const [monthlyScribes, setMonthlyScribes] = useState<number>(500);
  const [clinicianHourlyCost, setClinicianHourlyCost] = useState<number>(DEFAULT_CLINICIAN_HOURLY_COST);

  const recalculate = (
    foundPractice: PracticeData,
    isActual: boolean,
    baseline: number,
    timeSaved: number,
    scribes: number,
    hourlyCost: number
  ) => {
    // When using actual values, derive avgEditTime from baseline - timeSaved
    const avgEditTime = baseline - timeSaved;
    
    const roi = calculateROI(foundPractice.name, foundPractice.listSize, {
      monthlyScribes: isActual ? scribes : undefined,
      clinicianHourlyCost: hourlyCost,
      baselineNoteTime: isActual ? baseline : undefined,
      avgEditTime: isActual ? avgEditTime : undefined,
    });
    setCalculation(roi);
  };

  const handlePracticeFound = (foundPractice: PracticeData) => {
    setPractice(foundPractice);
    const estimatedScribes = estimateMonthlyScribes(foundPractice.listSize);
    setMonthlyScribes(estimatedScribes);
    setUseActualValues(false);
    setBaselineNoteTime(BASELINE_NOTE_TIME_SECONDS);
    setTimeSavedPerScribe(BASELINE_NOTE_TIME_SECONDS - AVG_EDIT_TIME_SECONDS);
    setClinicianHourlyCost(DEFAULT_CLINICIAN_HOURLY_COST);
    recalculate(foundPractice, false, BASELINE_NOTE_TIME_SECONDS, BASELINE_NOTE_TIME_SECONDS - AVG_EDIT_TIME_SECONDS, estimatedScribes, DEFAULT_CLINICIAN_HOURLY_COST);
  };

  const handleReset = () => {
    setPractice(null);
    setCalculation(null);
    setUseActualValues(false);
    setBaselineNoteTime(BASELINE_NOTE_TIME_SECONDS);
    setTimeSavedPerScribe(BASELINE_NOTE_TIME_SECONDS - AVG_EDIT_TIME_SECONDS);
    setMonthlyScribes(500);
    setClinicianHourlyCost(DEFAULT_CLINICIAN_HOURLY_COST);
  };

  const handleToggleActual = (isActual: boolean) => {
    setUseActualValues(isActual);
    if (practice) {
      if (!isActual) {
        // Reset to estimated values
        const estimatedScribes = estimateMonthlyScribes(practice.listSize);
        setMonthlyScribes(estimatedScribes);
        setBaselineNoteTime(BASELINE_NOTE_TIME_SECONDS);
        setTimeSavedPerScribe(BASELINE_NOTE_TIME_SECONDS - AVG_EDIT_TIME_SECONDS);
      }
      recalculate(practice, isActual, baselineNoteTime, timeSavedPerScribe, monthlyScribes, clinicianHourlyCost);
    }
  };

  const handleBaselineChange = (value: number) => {
    setBaselineNoteTime(value);
    if (practice && useActualValues) {
      recalculate(practice, true, value, timeSavedPerScribe, monthlyScribes, clinicianHourlyCost);
    }
  };

  const handleTimeSavedChange = (value: number) => {
    setTimeSavedPerScribe(value);
    if (practice && useActualValues) {
      recalculate(practice, true, baselineNoteTime, value, monthlyScribes, clinicianHourlyCost);
    }
  };

  const handleScribesChange = (value: number) => {
    setMonthlyScribes(value);
    if (practice && useActualValues) {
      recalculate(practice, true, baselineNoteTime, timeSavedPerScribe, value, clinicianHourlyCost);
    }
  };

  const handleClinicianCostChange = (value: number) => {
    setClinicianHourlyCost(value);
    if (practice && useActualValues) {
      recalculate(practice, true, baselineNoteTime, timeSavedPerScribe, monthlyScribes, value);
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
          <ROIOutput calculation={calculation} />

          {/* Detailed Breakdown Table */}
          <ROITable 
            calculation={calculation}
            useActualValues={useActualValues}
            baselineNoteTime={baselineNoteTime}
            timeSavedPerScribe={timeSavedPerScribe}
            monthlyScribes={monthlyScribes}
            clinicianHourlyCost={clinicianHourlyCost}
            onToggleActual={handleToggleActual}
            onBaselineChange={handleBaselineChange}
            onTimeSavedChange={handleTimeSavedChange}
            onScribesChange={handleScribesChange}
            onClinicianCostChange={handleClinicianCostChange}
          />
        </div>
      )}
    </div>
  );
}
