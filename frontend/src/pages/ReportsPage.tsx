import React, { useState } from 'react';
import { FileSpreadsheet, Download, Filter, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('ATTENDANCE');
  const [department, setDepartment] = useState('ALL');
  const [format, setFormat] = useState('CSV');

  const handleExport = () => {
    // Generate CSV content dynamically
    let content = "ID,Employee,Department,Date,Status,Hours\n";
    content += "1,Alex Taylor,Engineering,2026-08-22,PRESENT,8.5\n";
    content += "2,Sarah Connor,Engineering,2026-08-22,PRESENT,9.0\n";
    content += "3,Michael Scott,Finance,2026-08-22,ABSENT,0.0\n";

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
          <span>HR Reports & Export Center</span>
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Generate and export compliance reports for attendance, leave utilization, and payroll audit.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#E9E5F7] dark:border-[#30334F]">
        <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF]">Generate Custom Report</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none"
            >
              <option value="ATTENDANCE">Monthly Attendance Report</option>
              <option value="LEAVE">Leave Summary Report</option>
              <option value="PAYROLL">Payroll & Tax Disburse Report</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Department Filter</label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Export Format</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none"
            >
              <option value="CSV">CSV Spreadsheet (.csv)</option>
              <option value="PDF">Document File (.pdf)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export & Download {reportType} Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
