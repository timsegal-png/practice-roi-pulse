import { useState } from 'react';
import { ROICalculation, formatCurrency, formatHours, formatTime, formatPercentage } from '@/lib/roiCalculations';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ROITableProps {
  calculation: ROICalculation;
  useActualValues: boolean;
  monthlyScribes: number;
  clinicianHourlyCost: number;
  onToggleActual: (isActual: boolean) => void;
  onScribesChange: (value: number) => void;
  onClinicianCostChange: (value: number) => void;
}

export function ROITable({ 
  calculation, 
  useActualValues,
  monthlyScribes,
  clinicianHourlyCost,
  onToggleActual,
  onScribesChange,
  onClinicianCostChange,
}: ROITableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const assumptionRows = [
    { 
      key: 'baseline',
      label: 'Baseline note writing time', 
      value: formatTime(calculation.baselineNoteTime), 
      description: (
        <span>
          Source:{' '}
          <a href="https://cdn.prod.website-files.com/67ef895ebcae5ebab6aa5d30/687eae08d924decb3fb93925_Tandem%20_%20St.%20Wulfstan%20Surgery%20%E2%80%94%20Case%20study.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
            Case study of St Wulfstan Surgery.
          </a>
        </span>
      ),
      editable: false,
    },
    { 
      key: 'avgEdit',
      label: 'Average edit time with Scribe', 
      value: formatTime(calculation.avgEditTime), 
      description: 'Based on the national average across all Tandem consultations.',
      editable: false,
    },
    { 
      key: 'timeSaved',
      label: 'Time saved per scribe', 
      value: formatTime(calculation.timeSavedPerScribe), 
      description: 'Auto-calculated: baseline time – average edit time.',
      editable: false,
    },
  ];

  const editableRows = [
    { 
      key: 'scribes',
      label: useActualValues ? 'Actual monthly scribes' : 'Estimated monthly scribes', 
      value: calculation.monthlyScribes.toLocaleString(), 
      description: useActualValues ? 'Your practice usage' : 'Based on patient list size',
      editable: true,
      editValue: monthlyScribes,
      onChange: onScribesChange,
      suffix: '',
    },
    { 
      key: 'hourlyCost',
      label: 'Clinician hourly cost', 
      value: formatCurrency(calculation.clinicianHourlyCost), 
      description: (
        <span>
          Based on the assumption a clinician can complete 5 sessions per hour, using the price per session from the{' '}
          <a href="https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
            King's Fund
          </a>.
        </span>
      ),
      editable: true,
      editValue: clinicianHourlyCost,
      onChange: onClinicianCostChange,
      suffix: '/hour',
      prefix: '£',
    },
  ];

  const readOnlyRows = [
    { label: 'Monthly hours saved', value: formatHours(calculation.monthlyHoursSaved), description: 'Total clinician time recovered' },
    { label: 'Gross monthly savings', value: formatCurrency(calculation.grossMonthlySavings), description: 'Value of time saved' },
    { label: 'License cost per patient', value: formatCurrency(calculation.licenseCostPerScribe, 2), description: 'Based on practice size band' },
    { label: 'Monthly license cost', value: formatCurrency(calculation.monthlyLicenseCost), description: 'Total Scribe subscription' },
    { label: 'Net monthly savings', value: formatCurrency(calculation.netMonthlySavings), description: 'After license costs', highlight: true },
    { label: 'Return on Investment', value: formatPercentage(calculation.roi), description: 'Net savings ÷ license cost', highlight: true },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card animate-slide-up">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-semibold text-foreground">Detailed Breakdown</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="divide-y divide-border">
          {/* Helper text and toggle */}
          <div className="px-6 py-4 bg-muted/10">
            <p className="text-sm text-muted-foreground mb-4">
              These figures are based on national averages. If you want to amend for how your practice operates, toggle the values below.
            </p>
            <div className="flex items-center gap-3">
              <Label htmlFor="values-toggle" className="text-sm text-muted-foreground">
                Estimated
              </Label>
              <Switch
                id="values-toggle"
                checked={useActualValues}
                onCheckedChange={onToggleActual}
              />
              <Label htmlFor="values-toggle" className="text-sm text-muted-foreground">
                Actual
              </Label>
            </div>
          </div>

          {/* Assumption rows (locked) */}
          {assumptionRows.map((row) => (
            <div 
              key={row.key} 
              className="px-6 py-4 flex items-center justify-between transition-colors hover:bg-muted/20"
            >
              <div>
                <span className="font-medium text-foreground">
                  {row.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
              </div>
              <span className="font-semibold text-lg text-foreground">
                {row.value}
              </span>
            </div>
          ))}

          {/* Editable rows */}
          {editableRows.map((row) => (
            <div 
              key={row.key} 
              className="px-6 py-4 flex items-center justify-between transition-colors hover:bg-muted/20"
            >
              <div className="flex-1 min-w-0 mr-4">
                <span className="font-medium text-foreground">
                  {row.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
              </div>
              {useActualValues && row.editable ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {row.prefix && <span className="text-muted-foreground">{row.prefix}</span>}
                  <Input
                    type="number"
                    value={row.editValue}
                    onChange={(e) => row.onChange(Number(e.target.value) || 0)}
                    className="w-24 h-9 text-right"
                    min={0}
                  />
                  {row.suffix && <span className="text-sm text-muted-foreground">{row.suffix}</span>}
                </div>
              ) : (
                <span className="font-semibold text-lg text-foreground">
                  {row.value}
                </span>
              )}
            </div>
          ))}

          {/* Read-only rows */}
          {readOnlyRows.map((row) => (
            <div 
              key={row.label} 
              className={`px-6 py-4 flex items-center justify-between transition-colors hover:bg-muted/20 ${row.highlight ? 'bg-success/5' : ''}`}
            >
              <div>
                <span className={`font-medium ${row.highlight ? 'text-success' : 'text-foreground'}`}>
                  {row.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
              </div>
              <span className={`font-semibold text-lg ${row.highlight ? 'text-success' : 'text-foreground'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
