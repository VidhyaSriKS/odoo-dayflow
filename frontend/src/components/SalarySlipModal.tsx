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
      <div id="salary-slip-content" className="bg-slate-900 border border-slate-700/80 p-6 rounded-2xl text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black text-xl flex items-center justify-center">
              D
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">DAYFLOW HRMS</h2>
              <p className="text-xs text-slate-400">Official Monthly Earnings Statement</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
              {month.toUpperCase()} {year}
            </span>
          </div>
        </div>

        {/* Employee Summary Details */}
        <div className="grid grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl text-xs border border-slate-700/50">
          <div>
            <span className="text-slate-400 block">Employee Name</span>
            <span className="font-semibold text-white text-sm">{employee.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Employee Code</span>
            <span className="font-semibold text-white text-sm font-mono">{employee.employeeCode}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Department</span>
            <span className="font-medium text-slate-200">{employee.departmentName || 'General'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Designation</span>
            <span className="font-medium text-slate-200">{employee.designation}</span>
          </div>
        </div>

        {/* Salary Breakdown Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Earnings & Deductions</h4>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2 text-slate-300">Basic Monthly Salary</td>
                <td className="py-2 text-right font-mono text-white">${employee.basicSalary.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300">Housing & Transport Allowances</td>
                <td className="py-2 text-right font-mono text-emerald-400">+${employee.allowances.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-300">Tax & Statutory Deductions</td>
                <td className="py-2 text-right font-mono text-rose-400">-${employee.deductions.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Net Salary */}
        <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-300 uppercase tracking-wider font-semibold block">Net Payable Amount</span>
            <span className="text-xs text-slate-400">Credited via direct deposit</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ${employee.netSalary.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authenticated System Document</span>
          <span>Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Slip</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </Modal>
  );
};
