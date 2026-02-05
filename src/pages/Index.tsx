import { Calculator } from '@/components/Calculator';
import accurxLogo from '@/assets/accurx-logo.webp';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="https://www.accurx.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <img 
                src={accurxLogo} 
                alt="Accurx" 
                className="h-8 w-auto"
              />
            </a>
            <div className="text-right">
              <h1 className="text-lg font-semibold text-primary">Scribe ROI Calculator</h1>
              <p className="text-xs text-muted-foreground">For NHS GP Practices</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Calculate your practice's savings
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much time and money your practice could save using Accurx Scribe.
          </p>
        </section>

        {/* Calculator */}
        <Calculator />

        {/* Footer Info */}
        <section className="mt-16 text-center">
          <div className="bg-muted/50 rounded-xl p-6 max-w-2xl mx-auto border border-border">
            <h3 className="font-semibold text-foreground mb-2">How Scribe works</h3>
            <p className="text-sm text-muted-foreground">
              Scribe uses AI to generate clinical notes from consultations, reducing documentation time from ~7 minutes to just over 1 minute per appointment. Enter your ODS code above to see your personalised savings estimate.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Estimates based on average consultation times and clinician costs. Actual savings may vary.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
