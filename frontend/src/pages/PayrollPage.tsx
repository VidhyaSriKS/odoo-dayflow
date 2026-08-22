import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Employee } from '../types';
import { SalarySlipModal } from '../components/SalarySlipModal';
import { Modal } from '../components/Modal';
import { useNotifications } from '../context/NotificationContext';
import { DollarSign, Download, Edit3, ShieldCheck, FileText } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const isHr = user?.role === 'ROLE_ADMIN';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Salary Form State
  const [editBasic, setEditBasic] = useState('85000');
  const [editAllowances, setEditAllowances] = useState('8000');
  const [editDeductions, setEditDeductions] = useState('3500');

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    const data = await apiClient.getEmployees();
    setEmployees(data);
    if (data.length > 0 && !selectedEmp) {
      setSelectedEmp(data[1] || data[0]);
    }
  };

  const handleSaveSalaryStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const b = parseFloat(editBasic) || 0;
    const a = parseFloat(editAllowances) || 0;
    const d = parseFloat(editDeductions) || 0;
    const net = b + a - d;

    setEmployees(prev => prev.map(emp => emp.id === selectedEmp.id ? { ...emp, basicSalary: b, allowances: a, deductions: d, netSalary: net } : emp));
    setSelectedEmp({ ...selectedEmp, basicSalary: b, allowances: a, deductions: d, netSalary: net });
    setShowEditModal(false);
    addNotification('Salary Structure Updated', `Updated salary for ${selectedEmp.fullName}. Net: $${net.toLocaleString()}`, 'SUCCESS');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#22C55E]" />
            <span>{isHr ? 'Payroll & Compensation Management' : 'My Salary & Pay Slips'}</span>
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">View earnings, tax deductions, salary structures, and downloadable payslip PDFs.</p>
        </div>

        {selectedEmp && (
          <button
            onClick={() => setShowPayslipModal(true)}
            className="px-4 py-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Salary Slip PDF</span>
          </button>
        )}
      </div>

      {/* Employee View: My Salary Breakdown */}
      {!isHr && selectedEmp && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#E9E5F7] dark:border-[#30334F]">
            <div className="flex items-center justify-between border-b border-[#E9E5F7] dark:border-[#30334F] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">August 2026 Earnings Summary</h2>
                <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] font-mono">Employee Code: {selectedEmp.employeeCode}</span>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-[#22C55E] dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold rounded-full">
                PAID & CREDITED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-4 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
                <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] block font-sans">Basic Salary</span>
                <span className="text-xl font-bold text-[#1F1937] dark:text-[#F8F7FF] mt-1 block">${selectedEmp.basicSalary.toLocaleString()}</span>
              </div>

              <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-4 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
                <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] block font-sans">Allowances</span>
                <span className="text-xl font-bold text-[#22C55E] mt-1 block">+${selectedEmp.allowances.toLocaleString()}</span>
              </div>

              <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-4 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
                <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] block font-sans">Deductions</span>
                <span className="text-xl font-bold text-[#EF4444] mt-1 block">-${selectedEmp.deductions.toLocaleString()}</span>
              </div>

              <div className="bg-[#F5F3FF] dark:bg-purple-950/40 p-4 rounded-2xl border border-[#E9E5F7] dark:border-purple-800/40">
                <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] block font-sans font-semibold">Net Monthly Payable</span>
                <span className="text-2xl font-black text-[#7C3AED] dark:text-[#A78BFA] mt-1 block">${selectedEmp.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Admin View: All Employee Payroll Table */}
      {isHr && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-[#E9E5F7] dark:border-[#30334F]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F3FF] dark:bg-[#1E2038] text-[#6B7280] dark:text-[#A9A8BC] font-semibold uppercase tracking-wider border-b border-[#E9E5F7] dark:border-[#30334F]">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Basic</th>
                <th className="p-4">Allowances</th>
                <th className="p-4">Deductions</th>
                <th className="p-4">Net Salary</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038]/60 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] block">{emp.fullName}</span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-mono">{emp.employeeCode}</span>
                  </td>
                  <td className="p-4 text-[#6B7280] dark:text-[#A9A8BC]">{emp.departmentName || 'General'}</td>
                  <td className="p-4 font-mono text-[#1F1937] dark:text-[#F8F7FF]">${emp.basicSalary.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-[#22C55E]">+${emp.allowances.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-[#EF4444]">-${emp.deductions.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-[#1F1937] dark:text-[#F8F7FF]">${emp.netSalary.toLocaleString()}</td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedEmp(emp);
                        setEditBasic(emp.basicSalary.toString());
                        setEditAllowances(emp.allowances.toString());
                        setEditDeductions(emp.deductions.toString());
                        setShowEditModal(true);
                      }}
                      className="px-2.5 py-1 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#30334F] border border-[#E9E5F7] dark:border-[#30334F] text-[#7C3AED] dark:text-[#A78BFA] text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Structure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Salary Modal */}
      {selectedEmp && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Salary Structure: ${selectedEmp.fullName}`}>
          <form onSubmit={handleSaveSalaryStructure} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Basic Monthly Salary ($)</label>
              <input
                type="number"
                required
                value={editBasic}
                onChange={e => setEditBasic(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Allowances ($)</label>
              <input
                type="number"
                required
                value={editAllowances}
                onChange={e => setEditAllowances(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Deductions ($)</label>
              <input
                type="number"
                required
                value={editDeductions}
                onChange={e => setEditDeductions(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
            >
              Update Salary Structure
            </button>
          </form>
        </Modal>
      )}

      {/* Payslip PDF Download Modal */}
      {selectedEmp && (
        <SalarySlipModal
          isOpen={showPayslipModal}
          onClose={() => setShowPayslipModal(false)}
          employee={selectedEmp}
        />
      )}
    </div>
  );
};
