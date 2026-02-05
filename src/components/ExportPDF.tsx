import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ROICalculation, formatCurrency, formatHours, formatTime, formatPercentage } from '@/lib/roiCalculations';
import accurxLogo from '@/assets/accurx-logo.webp';

interface ExportPDFProps {
  calculation: ROICalculation;
}

export function ExportPDF({ calculation }: ExportPDFProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (!contentRef.current) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${calculation.practiceName.replace(/\s+/g, '_')}_ROI_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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

      {/* Hidden content for PDF export */}
      <div className="absolute left-[-9999px]">
        <div 
          ref={contentRef} 
          className="bg-white p-8 text-black"
          style={{ width: '210mm', fontFamily: 'Inter, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
            <img src={accurxLogo} alt="Accurx" className="h-10" />
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-800">Scribe ROI Report</h1>
              <p className="text-sm text-gray-500">Generated {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* Practice Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#155263] mb-2">{calculation.practiceName}</h2>
            <p className="text-gray-600">Patient list size: {calculation.listSize.toLocaleString()}</p>
          </div>

          {/* Key Metrics */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Hours Saved Monthly</p>
                <p className="text-3xl font-bold text-[#155263]">{Math.round(calculation.monthlyHoursSaved)}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-[#5ab9a5]">
                <p className="text-sm text-gray-500 mb-1">Monthly Savings</p>
                <p className="text-3xl font-bold text-[#5ab9a5]">{formatCurrency(calculation.netMonthlySavings)}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-[#5ab9a5]">
                <p className="text-sm text-gray-500 mb-1">Return on Investment</p>
                <p className="text-3xl font-bold text-[#5ab9a5]">{calculation.roi.toFixed(1)}x</p>
              </div>
            </div>
          </div>

          {/* Annual Projection */}
          <div className="mb-8 p-6 bg-[#5ab9a5] bg-opacity-10 rounded-lg border border-[#5ab9a5]">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#155263]">Annual Savings Projection</h3>
                <p className="text-sm text-gray-600">Total savings over 12 months</p>
              </div>
              <p className="text-4xl font-bold text-[#5ab9a5]">{formatCurrency(calculation.annualSavings)}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Monthly license cost</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(calculation.monthlyLicenseCost)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Estimated monthly scribes</td>
                  <td className="py-3 text-right font-medium">{calculation.monthlyScribes.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Baseline note writing time</td>
                  <td className="py-3 text-right font-medium">{formatTime(calculation.baselineNoteTime)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Average edit time with Scribe</td>
                  <td className="py-3 text-right font-medium">{formatTime(calculation.avgEditTime)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Time saved per scribe</td>
                  <td className="py-3 text-right font-medium">{formatTime(calculation.timeSavedPerScribe)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Monthly hours saved</td>
                  <td className="py-3 text-right font-medium">{formatHours(calculation.monthlyHoursSaved)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Clinician hourly cost</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(calculation.clinicianHourlyCost)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-600">Gross monthly savings</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(calculation.grossMonthlySavings)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-[#155263]">Net monthly savings</td>
                  <td className="py-3 text-right font-bold text-[#5ab9a5]">{formatCurrency(calculation.netMonthlySavings)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Estimates based on average consultation times and clinician costs. Actual savings may vary.</p>
            <p className="mt-1">© {new Date().getFullYear()} Accurx • www.accurx.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
