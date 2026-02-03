import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { lookupPractice, validateOdsCode } from '@/lib/odsData';
import type { PracticeData } from '@/lib/odsData';

interface ODSInputProps {
  onPracticeFound: (practice: PracticeData) => void;
  onReset: () => void;
}

export function ODSInput({ onPracticeFound, onReset }: ODSInputProps) {
  const [odsCode, setOdsCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedCode = odsCode.trim();

    if (!trimmedCode) {
      setError('Please enter an ODS code');
      return;
    }

    if (!validateOdsCode(trimmedCode)) {
      setError('Invalid ODS code format. Please enter a 5-6 character alphanumeric code.');
      return;
    }

    setIsLoading(true);

    // Simulate API lookup delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const practice = lookupPractice(trimmedCode);

    if (!practice) {
      setError(`No practice found for ODS code "${trimmedCode.toUpperCase()}". Try: E87001, Y03001, or M85001`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onPracticeFound(practice);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOdsCode(e.target.value.toUpperCase());
    if (error) setError(null);
    onReset();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={odsCode}
            onChange={handleInputChange}
            placeholder="Enter ODS Code (e.g., E87001)"
            className="input-primary pl-12 uppercase"
            maxLength={6}
            aria-label="ODS Code"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Looking up practice...</span>
            </>
          ) : (
            <span>Calculate ROI</span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Sample codes: E87001, Y03001, M85001, B82001, L81002
      </p>
    </div>
  );
}
