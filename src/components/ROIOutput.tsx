import { Users, PoundSterling, Mic } from 'lucide-react';
import { ROICalculation, formatCurrency } from '@/lib/roiCalculations';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ROIOutputProps {
  calculation: ROICalculation;
  useActualScribes: boolean;
  actualScribes: number;
  clinicianHourlyCost: number;
  onScribesToggle: (isActual: boolean) => void;
  onScribesChange: (value: number) => void;
  onClinicianCostChange: (value: number) => void;
}

export function ROIOutput({
  calculation,
  useActualScribes,
  actualScribes,
  clinicianHourlyCost,
  onScribesToggle,
  onScribesChange,
  onClinicianCostChange,
}: ROIOutputProps) {
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

      {/* Editable Controls */}
      <div className="space-y-4 mb-8 p-4 bg-muted/20 rounded-lg border border-border">
        <h3 className="font-medium text-foreground text-sm uppercase tracking-wide">Adjust your inputs</h3>
        
        {/* Monthly Scribes Control */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm text-foreground font-medium">
              {useActualScribes ? 'Actual' : 'Estimated'} monthly scribes:
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {useActualScribes ? (
              <Input
                type="number"
                value={actualScribes}
                onChange={(e) => onScribesChange(Number(e.target.value) || 0)}
                className="w-28 h-9"
                min={0}
              />
            ) : (
              <span className="font-semibold text-foreground text-lg">{calculation.monthlyScribes.toLocaleString()}</span>
            )}
            <div className="flex items-center gap-2 ml-2">
              <Label htmlFor="scribes-toggle" className="text-xs text-muted-foreground">
                Est.
              </Label>
              <Switch
                id="scribes-toggle"
                checked={useActualScribes}
                onCheckedChange={onScribesToggle}
              />
              <Label htmlFor="scribes-toggle" className="text-xs text-muted-foreground">
                Actual
              </Label>
            </div>
          </div>
        </div>

        {/* Clinician Hourly Cost Control */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <PoundSterling className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm text-foreground font-medium">Clinician hourly cost:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">£</span>
            <Input
              type="number"
              value={clinicianHourlyCost}
              onChange={(e) => onClinicianCostChange(Number(e.target.value) || 0)}
              className="w-24 h-9"
              min={0}
            />
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground bg-muted/30 uppercase tracking-wide">
                Avg edit time (sec)
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground bg-muted/30 uppercase tracking-wide">
                Time saved/scribe (sec)**
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground bg-muted/30 uppercase tracking-wide">
                Hours saved/month
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-accent bg-accent/10 uppercase tracking-wide">
                Monthly savings***
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-accent bg-accent/10 uppercase tracking-wide">
                ROI
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-5 text-2xl font-semibold text-foreground">
                {calculation.avgEditTime}
              </td>
              <td className="px-4 py-5 text-2xl font-semibold text-foreground">
                {calculation.timeSavedPerScribe}
              </td>
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

      {/* Footnotes */}
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>* Average scribes for a practice with this list size</p>
        <p>** Assumes 420 seconds (7 min) spent writing notes per appointment</p>
        <p>*** Clinician time saved × £{clinicianHourlyCost}/hr, minus monthly Scribe cost</p>
      </div>
    </div>
  );
}
