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
const BASELINE_NOTE_TIME_SECONDS = 420; // 7 minutes
const AVG_EDIT_TIME_SECONDS = 68;
const CLINICIAN_HOURLY_COST = 80; // £80/hour

/**
 * Estimate monthly scribes based on patient list size
 */
export function estimateMonthlyScribes(listSize: number): number {
  if (listSize < 5000) return 400;
  if (listSize < 8000) return 650;
  if (listSize < 12000) return 900;
  return 1200;
}

/**
 * Get license cost per scribe based on patient list size bands
 */
export function getLicenseCostPerScribe(listSize: number): number {
  if (listSize < 15000) return 0.50;
  if (listSize < 90000) return 0.47;
  return 0.43;
}

/**
 * Calculate full ROI metrics for a practice
 */
export function calculateROI(practiceName: string, listSize: number): ROICalculation {
  const monthlyScribes = estimateMonthlyScribes(listSize);
  const timeSavedPerScribe = BASELINE_NOTE_TIME_SECONDS - AVG_EDIT_TIME_SECONDS;
  
  // Monthly time saved in hours
  const monthlySecondsSaved = monthlyScribes * timeSavedPerScribe;
  const monthlyHoursSaved = monthlySecondsSaved / 3600;
  
  // Financial calculations
  const grossMonthlySavings = monthlyHoursSaved * CLINICIAN_HOURLY_COST;
  const licenseCostPerScribe = getLicenseCostPerScribe(listSize);
  const monthlyLicenseCost = monthlyScribes * licenseCostPerScribe;
  const netMonthlySavings = grossMonthlySavings - monthlyLicenseCost;
  
  // ROI calculation
  const roi = monthlyLicenseCost > 0 ? (netMonthlySavings / monthlyLicenseCost) * 100 : 0;
  
  // Annual projection
  const annualSavings = netMonthlySavings * 12;

  return {
    practiceName,
    listSize,
    monthlyScribes,
    baselineNoteTime: BASELINE_NOTE_TIME_SECONDS,
    avgEditTime: AVG_EDIT_TIME_SECONDS,
    timeSavedPerScribe,
    monthlyHoursSaved,
    clinicianHourlyCost: CLINICIAN_HOURLY_COST,
    grossMonthlySavings,
    licenseCostPerScribe,
    monthlyLicenseCost,
    netMonthlySavings,
    roi,
    annualSavings,
  };
}

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
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

/**
 * Format hours with one decimal
 */
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`;
}
