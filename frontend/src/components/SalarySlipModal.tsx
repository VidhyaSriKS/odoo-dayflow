import React from 'react';
import { Modal } from './Modal';
import { Employee } from '../types';
import { Download, Printer, ShieldCheck } from 'lucide-react';

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  month?: string;
  year?: number;
}

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({
  isOpen,
  onClose,
  employee,
  month = 'August',
  year = 2026
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Salary Slip - ${month} ${year}`}>
      <div id="salary-slip-content" className="bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] p-6 rounded-2xl text-[#1F1937] dark:text-[#F8F7FF] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E5F7] dark:border-[#30334F] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] dark:bg-[#8B5CF6] text-white font-black text-xl flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.3)] overflow-hidden">
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">DAYFLOW HRMS</h2>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Official Monthly Earnings Statement</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-[#E9E5F7] dark:border-purple-800/40 font-semibold">
              {month.toUpperCase()} {year}
            </span>
          </div>
        </div>

        {/* Employee Summary Details */}
        <div className="grid grid-cols-2 gap-4 bg-white dark:bg-[#181A30] p-4 rounded-xl text-xs border border-[#E9E5F7] dark:border-[#30334F]">
          <div>
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">Employee Name</span>
            <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] text-sm">{employee.fullName}</span>
          </div>
          <div>
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">Employee Code</span>
            <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] text-sm font-mono">{employee.employeeCode}</span>
          </div>
          <div>
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">Department</span>
            <span className="font-medium text-[#1F1937] dark:text-[#F8F7FF]">{employee.departmentName || 'General'}</span>
          </div>
          <div>
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">Designation</span>
            <span className="font-medium text-[#1F1937] dark:text-[#F8F7FF]">{employee.designation}</span>
          </div>
        </div>

        {/* Salary Breakdown Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">Earnings & Deductions</h4>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E9E5F7] dark:border-[#30334F] text-[#6B7280] dark:text-[#A9A8BC] font-semibold">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
              <tr>
                <td className="py-2 text-[#1F1937] dark:text-[#F8F7FF]">Basic Monthly Salary</td>
                <td className="py-2 text-right font-mono font-bold text-[#1F1937] dark:text-[#F8F7FF]">${employee.basicSalary.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-[#1F1937] dark:text-[#F8F7FF]">Housing & Transport Allowances</td>
                <td className="py-2 text-right font-mono font-bold text-[#22C55E] dark:text-emerald-400">+${employee.allowances.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-[#1F1937] dark:text-[#F8F7FF]">Tax & Statutory Deductions</td>
                <td className="py-2 text-right font-mono font-bold text-[#EF4444] dark:text-rose-400">-${employee.deductions.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Net Salary */}
        <div className="bg-[#F5F3FF] dark:bg-purple-950/40 border border-[#E9E5F7] dark:border-purple-800/40 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider font-semibold block">Net Payable Amount</span>
            <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Credited via direct deposit</span>
          </div>
          <div className="text-2xl font-black text-[#7C3AED] dark:text-[#A78BFA] font-mono">
            ${employee.netSalary.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#A9A8BC] pt-2 border-t border-[#E9E5F7] dark:border-[#30334F]">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> Authenticated System Document</span>
          <span>Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-[#F5F3FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] hover:bg-purple-100 dark:hover:bg-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-xs font-semibold rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
          <span>Print Slip</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </Modal>
  );
};
