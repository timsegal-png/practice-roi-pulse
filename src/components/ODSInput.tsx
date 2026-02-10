import { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle, Building2, Users } from 'lucide-react';
import { lookupPractice, validateOdsCode, searchPractices } from '@/lib/odsData';
import type { PracticeData } from '@/lib/odsData';

interface ODSInputProps {
  onPracticeFound: (practice: PracticeData) => void;
  onReset: () => void;
}

export function ODSInput({ onPracticeFound, onReset }: ODSInputProps) {
  const [odsCode, setOdsCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualPracticeName, setManualPracticeName] = useState('');
  const [manualListSize, setManualListSize] = useState('');

  // Practice search state
  const [searchMode, setSearchMode] = useState<'ods' | 'name'>('ods');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PracticeData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchMode !== 'name' || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchPractices(searchQuery.trim(), 8);
      setSearchResults(results);
      setShowResults(results.length > 0);
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  const handleSelectSearchResult = (practice: PracticeData) => {
    setShowResults(false);
    setSearchQuery(practice.name);
    onPracticeFound(practice);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowManualEntry(false);

    const trimmedCode = odsCode.trim();

    if (!trimmedCode) {
      setError('Please enter an ODS code');
      return;
    }

    if (!validateOdsCode(trimmedCode)) {
      setError('Invalid ODS code format. Please enter a 5-7 character alphanumeric code.');
      return;
    }

    setIsLoading(true);

    const practice = await lookupPractice(trimmedCode);

    if (!practice) {
      setShowManualEntry(true);
      setError(`ODS code "${trimmedCode.toUpperCase()}" not found. Enter your practice details manually below.`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onPracticeFound(practice);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const practiceName = manualPracticeName.trim();
    const listSize = parseInt(manualListSize, 10);

    if (!practiceName) {
      setError('Please enter your practice name');
      return;
    }

    if (practiceName.length > 100) {
      setError('Practice name must be less than 100 characters');
      return;
    }

    if (isNaN(listSize) || listSize < 100 || listSize > 100000) {
      setError('Please enter a valid patient list size (100 - 100,000)');
      return;
    }

    const practice: PracticeData = {
      odsCode: odsCode.trim().toUpperCase() || 'MANUAL',
      name: practiceName,
      listSize,
    };

    onPracticeFound(practice);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOdsCode(e.target.value.toUpperCase());
    if (error) setError(null);
    setShowManualEntry(false);
    onReset();
  };

  const handleReset = () => {
    setOdsCode('');
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError(null);
    setShowManualEntry(false);
    setManualPracticeName('');
    setManualListSize('');
    onReset();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden mb-4">
        <button
          type="button"
          onClick={() => { setSearchMode('ods'); setError(null); setShowManualEntry(false); onReset(); }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${searchMode === 'ods' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
        >
          Search by ODS Code
        </button>
        <button
          type="button"
          onClick={() => { setSearchMode('name'); setError(null); setShowManualEntry(false); onReset(); }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${searchMode === 'name' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
        >
          Search by Practice Name
        </button>
      </div>

      {searchMode === 'ods' ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={odsCode}
                onChange={handleInputChange}
                placeholder="Enter ODS Code (e.g., S80166)"
                className="input-primary pl-12 uppercase"
                maxLength={7}
                aria-label="ODS Code"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {error && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm animate-fade-in ${showManualEntry ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!showManualEntry && (
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
            )}
          </form>

          {/* Manual Entry Form */}
          {showManualEntry && (
            <form onSubmit={handleManualSubmit} className="mt-6 space-y-4 p-6 bg-muted/30 rounded-xl border border-border animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">Enter Practice Details</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={manualPracticeName}
                    onChange={(e) => setManualPracticeName(e.target.value)}
                    placeholder="Practice Name"
                    className="input-primary pl-12"
                    maxLength={100}
                    aria-label="Practice Name"
                  />
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={manualListSize}
                    onChange={(e) => setManualListSize(e.target.value)}
                    placeholder="Patient List Size"
                    className="input-primary pl-12"
                    min={100}
                    max={100000}
                    aria-label="Patient List Size"
                  />
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleReset} className="btn-secondary flex-1">Reset</button>
                <button type="submit" className="btn-primary flex-1">Calculate ROI</button>
              </div>
            </form>
          )}
        </>
      ) : (
        /* Name search mode */
        <div ref={searchRef} className="relative space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); onReset(); }}
              placeholder="Start typing a practice name..."
              className="input-primary pl-12"
              aria-label="Practice Name Search"
            />
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
          </div>

          {showResults && (
            <div className="absolute z-20 w-full bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto animate-fade-in">
              {searchResults.map((practice) => (
                <button
                  key={practice.odsCode}
                  type="button"
                  onClick={() => handleSelectSearchResult(practice)}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                >
                  <span className="font-medium text-foreground text-sm">{practice.name}</span>
                  <span className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>ODS: {practice.odsCode}</span>
                    <span>•</span>
                    <span>{practice.listSize.toLocaleString()} patients</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && !showResults && (
            <p className="text-sm text-muted-foreground text-center py-2">No practices found. Try a different name.</p>
          )}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">
        Over 10,000 NHS practices loaded. {searchMode === 'ods' ? 'Try any valid ODS code.' : 'Type at least 2 characters to search.'}
      </p>
    </div>
  );
}
