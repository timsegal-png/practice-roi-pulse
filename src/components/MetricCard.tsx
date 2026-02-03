import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
  subValue?: string;
}

export function MetricCard({ label, value, icon, highlight = false, subValue }: MetricCardProps) {
  return (
    <div className="metric-card animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <span className="metric-label">{label}</span>
        {icon && (
          <div className={`p-2 rounded-lg ${highlight ? 'bg-success/10' : 'bg-primary/10'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className={`metric-value ${highlight ? 'success-highlight' : 'text-foreground'}`}>
        {value}
      </div>
      {subValue && (
        <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
      )}
    </div>
  );
}
