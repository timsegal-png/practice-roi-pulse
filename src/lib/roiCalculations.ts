export interface ROICalculation {
  practiceName: string;
  listSize: number;
  monthlyScribes: number;
  baselineNoteTime: number;
  avgEditTime: number;
  timeSavedPerScribe: number;
  monthlyHoursSaved: number;
  clinicianHourlyCost: number;
  grossMonthlySavings: number;
  licenseCostPerScribe: number;
  monthlyLicenseCost: number;
  netMonthlySavings: number;
  roi: number;
  annualSavings: number;
}

// Constants
const BASELINE_NOTE_TIME_SECONDS = 210; // 3 minutes 30 seconds
const AVG_EDIT_TIME_SECONDS = 63; // 1 minute 3 seconds
const DEFAULT_CLINICIAN_HOURLY_COST = 185; // £185/hour

// Scribe estimation dataset based on list size ranges
const SCRIBE_ESTIMATES: { min: number; max: number; avg: number }[] = [
  { min: 2000, max: 4000, avg: 259 },
  { min: 4000, max: 6000, avg: 328 },
  { min: 6000, max: 8000, avg: 344 },
  { min: 8000, max: 10000, avg: 387 },
  { min: 10000, max: 12000, avg: 397 },
  { min: 12000, max: 14000, avg: 482 },
  { min: 14000, max: 16000, avg: 556 },
  { min: 16000, max: 18000, avg: 595 },
  { min: 18000, max: 20000, avg: 483 },
  { min: 20000, max: 22000, avg: 476 },
  { min: 22000, max: 24000, avg: 1165 },
  { min: 24000, max: 26000, avg: 531 },
  { min: 26000, max: 28000, avg: 574 },
  { min: 28000, max: 30000, avg: 534 },
  { min: 30000, max: 32000, avg: 976 },
  { min: 32000, max: 34000, avg: 601 },
  { min: 34000, max: 36000, avg: 130 },
  { min: 36000, max: 38000, avg: 233 },
  { min: 38000, max: 40000, avg: 248 },
  { min: 40000, max: 42000, avg: 480 },
  { min: 46000, max: 48000, avg: 695 },
  { min: 48000, max: 50000, avg: 2681 },
  { min: 52000, max: 54000, avg: 713 },
  { min: 54000, max: 56000, avg: 728 },
];

/**
 * Estimate monthly scribes based on patient list size using dataset
 */
export function estimateMonthlyScribes(listSize: number): number {
  // Find matching range
  const match = SCRIBE_ESTIMATES.find(
    (band) => listSize >= band.min && listSize < band.max
  );
  
  if (match) return match.avg;
  
  // Fallback for sizes outside dataset
  if (listSize < 2000) return 200;
  if (listSize >= 56000) return 750;
  
  // Interpolate for gaps (e.g., 42000-46000, 50000-52000)
  const sortedBands = [...SCRIBE_ESTIMATES].sort((a, b) => a.min - b.min);
  for (let i = 0; i < sortedBands.length - 1; i++) {
    if (listSize >= sortedBands[i].max && listSize < sortedBands[i + 1].min) {
      return Math.round((sortedBands[i].avg + sortedBands[i + 1].avg) / 2);
    }
  }
  
  return 500; // Default fallback
}

/**
 * Get price per patient per year based on patient list size bands
 * Bands:
 * - 0–14,999 → £0.50
 * - 15,000–89,999 → £0.47
 * - 90,000–799,999 → £0.43
 * - 800,000+ → £0.40
 */
export function getPricePerPatient(listSize: number): number {
  if (listSize < 15000) return 0.50;
  if (listSize < 90000) return 0.47;
  if (listSize < 800000) return 0.43;
  return 0.40;
}

/**
 * Calculate monthly license fee = (patient_list_size × price_per_patient) / 12
 */
export function calculateMonthlyLicenseFee(listSize: number): number {
  const pricePerPatient = getPricePerPatient(listSize);
  return (listSize * pricePerPatient) / 12;
}

export interface ROIInputOverrides {
  monthlyScribes?: number;
  clinicianHourlyCost?: number;
  baselineNoteTime?: number;
  avgEditTime?: number;
}

export { BASELINE_NOTE_TIME_SECONDS, AVG_EDIT_TIME_SECONDS };

/**
 * Calculate full ROI metrics for a practice
 */
export function calculateROI(
  practiceName: string, 
  listSize: number,
  overrides?: ROIInputOverrides
): ROICalculation {
  const monthlyScribes = overrides?.monthlyScribes ?? estimateMonthlyScribes(listSize);
  const clinicianHourlyCost = overrides?.clinicianHourlyCost ?? DEFAULT_CLINICIAN_HOURLY_COST;
  const baselineNoteTime = overrides?.baselineNoteTime ?? BASELINE_NOTE_TIME_SECONDS;
  const avgEditTime = overrides?.avgEditTime ?? AVG_EDIT_TIME_SECONDS;
  const timeSavedPerScribe = baselineNoteTime - avgEditTime;
  
  // Monthly time saved in hours
  const monthlySecondsSaved = monthlyScribes * timeSavedPerScribe;
  const monthlyHoursSaved = monthlySecondsSaved / 3600;
  
  // Financial calculations
  const grossMonthlySavings = monthlyHoursSaved * clinicianHourlyCost;
  const pricePerPatient = getPricePerPatient(listSize);
  const monthlyLicenseCost = calculateMonthlyLicenseFee(listSize);
  const netMonthlySavings = grossMonthlySavings - monthlyLicenseCost;
  
  // ROI calculation (as multiplier, e.g. 14x)
  const roi = monthlyLicenseCost > 0 ? netMonthlySavings / monthlyLicenseCost : 0;
  
  // Annual projection
  const annualSavings = netMonthlySavings * 12;

  return {
    practiceName,
    listSize,
    monthlyScribes,
    baselineNoteTime,
    avgEditTime,
    timeSavedPerScribe,
    monthlyHoursSaved,
    clinicianHourlyCost,
    grossMonthlySavings,
    licenseCostPerScribe: pricePerPatient,
    monthlyLicenseCost,
    netMonthlySavings,
    roi,
    annualSavings,
  };
}

export { DEFAULT_CLINICIAN_HOURLY_COST };

/**
 * Format seconds to minutes and seconds string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/**
 * Format currency with GBP symbol
 */
export function formatCurrency(amount: number, decimals = 0): string {
  return `£${amount.toLocaleString('en-GB', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
}

/**
 * Format ROI as multiplier (e.g., 14x)
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}x`;
}

/**
 * Format hours with one decimal
 */
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`;
}
