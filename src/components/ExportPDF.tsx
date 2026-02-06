import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ROICalculation, formatCurrency, formatHours, formatTime } from '@/lib/roiCalculations';
import accurxLogo from '@/assets/accurx-logo.webp';

interface ExportPDFProps {
  calculation: ROICalculation;
  useActualValues?: boolean;
}

export function ExportPDF({ calculation, useActualValues = false }: ExportPDFProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (!contentRef.current) return;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${calculation.practiceName.replace(/\s+/g, '_')}_ROI_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };

    html2pdf().set(opt).from(contentRef.current).save();
  };

  return (
    <>
      <Button 
        onClick={handleExport} 
        variant="outline" 
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export to PDF
      </Button>

      {/* Hidden content for PDF export - optimized for single A4 page */}
      <div className="absolute left-[-9999px]">
        <div 
          ref={contentRef} 
          className="bg-white text-black"
          style={{ 
            width: '190mm', 
            maxHeight: '277mm',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            lineHeight: '1.3',
            padding: '6mm',
          }}
        >
          {/* Header - Compact */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '2px solid #155263',
            paddingBottom: '8px',
            marginBottom: '12px'
          }}>
            <img src={accurxLogo} alt="Accurx" style={{ height: '28px' }} />
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: '14px', fontWeight: 'bold', color: '#155263', margin: 0 }}>
                Scribe ROI Report
              </h1>
              <p style={{ fontSize: '9px', color: '#666', margin: '2px 0 0 0' }}>
                {calculation.practiceName} • {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>

          {/* Hero Metrics - Large & Emphasized */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '14px'
          }}>
            {/* Hours Saved */}
            <div style={{ 
              flex: 1, 
              background: '#f8f9fa', 
              borderRadius: '8px', 
              padding: '12px',
              textAlign: 'center',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ fontSize: '9px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Hours Saved Monthly
              </p>
              <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#155263', margin: 0 }}>
                {Math.round(calculation.monthlyHoursSaved)}
              </p>
            </div>

            {/* Monthly Savings - Emphasized */}
            <div style={{ 
              flex: 1.2, 
              background: 'linear-gradient(135deg, #5ab9a5 0%, #4aa897 100%)', 
              borderRadius: '8px', 
              padding: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(90, 185, 165, 0.3)'
            }}>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.9)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Monthly Savings
              </p>
              <p style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                {formatCurrency(calculation.netMonthlySavings)}
              </p>
            </div>

            {/* ROI - Emphasized */}
            <div style={{ 
              flex: 1, 
              background: 'linear-gradient(135deg, #155263 0%, #1a6678 100%)', 
              borderRadius: '8px', 
              padding: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(21, 82, 99, 0.3)'
            }}>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.9)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Return on Investment
              </p>
              <p style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                {calculation.roi.toFixed(1)}x
              </p>
            </div>
          </div>

          {/* Annual Projection Banner */}
          <div style={{ 
            background: '#f0faf8', 
            border: '1px solid #5ab9a5',
            borderRadius: '6px', 
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#155263', margin: 0 }}>
                Annual Savings Projection
              </p>
              <p style={{ fontSize: '8px', color: '#666', margin: '2px 0 0 0' }}>
                Total savings over 12 months
              </p>
            </div>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#5ab9a5', margin: 0 }}>
              {formatCurrency(calculation.annualSavings)}
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            {/* Practice Info */}
            <div style={{ flex: '0 0 35%' }}>
              <h3 style={{ fontSize: '10px', fontWeight: '600', color: '#155263', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Practice Details
              </h3>
              <div style={{ background: '#f8f9fa', borderRadius: '4px', padding: '8px' }}>
                <div style={{ marginBottom: '6px' }}>
                  <p style={{ fontSize: '8px', color: '#888', margin: 0 }}>Patient List Size</p>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', margin: '2px 0 0 0' }}>
                    {calculation.listSize.toLocaleString()}
                  </p>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <p style={{ fontSize: '8px', color: '#888', margin: 0 }}>{useActualValues ? 'Monthly Scribes' : 'Estimated Monthly Scribes'}</p>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', margin: '2px 0 0 0' }}>
                    {calculation.monthlyScribes.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '8px', color: '#888', margin: 0 }}>Monthly Licence</p>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', margin: '2px 0 0 0' }}>
                    {formatCurrency(calculation.monthlyLicenseCost)}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '10px', fontWeight: '600', color: '#155263', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Calculation Breakdown
              </h3>
              <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px 0', color: '#555' }}>Baseline note writing time</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>{formatTime(calculation.baselineNoteTime)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px 0', color: '#555' }}>Avg edit time with Scribe</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>{formatTime(calculation.avgEditTime)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px 0', color: '#555' }}>Time saved per scribe</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>{formatTime(calculation.timeSavedPerScribe)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px 0', color: '#555' }}>Monthly hours saved</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>{formatHours(calculation.monthlyHoursSaved)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px 0', color: '#555' }}>Clinician hourly cost</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(calculation.clinicianHourlyCost)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '4px 0', color: '#555' }}>Gross monthly savings</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(calculation.grossMonthlySavings)}</td>
                  </tr>
                  <tr style={{ background: '#f0faf8' }}>
                    <td style={{ padding: '5px 4px', fontWeight: '600', color: '#155263' }}>Net monthly savings</td>
                    <td style={{ padding: '5px 4px', textAlign: 'right', fontWeight: 'bold', color: '#5ab9a5' }}>{formatCurrency(calculation.netMonthlySavings)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            borderTop: '1px solid #ddd', 
            paddingTop: '8px',
            marginTop: 'auto'
          }}>
            <p style={{ fontSize: '7px', color: '#888', margin: '0 0 3px 0', lineHeight: '1.4' }}>
              <strong>Assumptions:</strong> Baseline note time {formatTime(calculation.baselineNoteTime)}, 
              edit time {formatTime(calculation.avgEditTime)}, 
              clinician cost {formatCurrency(calculation.clinicianHourlyCost)}/hr. 
              Estimates based on average consultation times. Actual savings may vary.
            </p>
            <p style={{ fontSize: '7px', color: '#aaa', margin: 0, textAlign: 'center' }}>
              © {new Date().getFullYear()} Accurx • www.accurx.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
