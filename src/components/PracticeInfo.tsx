import { Building2, Users } from 'lucide-react';

interface PracticeInfoProps {
  name: string;
  odsCode: string;
  listSize: number;
}

export function PracticeInfo({ name, odsCode, listSize }: PracticeInfoProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">ODS Code: {odsCode}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4" />
        <span className="text-sm">
          <span className="font-semibold text-foreground">{listSize.toLocaleString()}</span> registered patients
        </span>
      </div>
    </div>
  );
}
