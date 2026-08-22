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
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span>{isHr ? 'Payroll & Compensation Management' : 'My Salary & Pay Slips'}</span>
          </h1>
          <p className="text-xs text-slate-400">View earnings, tax deductions, salary structures, and downloadable payslip PDFs.</p>
        </div>

        {selectedEmp && (
          <button
            onClick={() => setShowPayslipModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Salary Slip PDF</span>
          </button>
        )}
      </div>

      {/* Employee View: My Salary Breakdown */}
      {!isHr && selectedEmp && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6 border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">August 2026 Earnings Summary</h2>
                <span className="text-xs text-slate-400 font-mono">Employee Code: {selectedEmp.employeeCode}</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">
                PAID & CREDITED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block font-sans">Basic Salary</span>
                <span className="text-xl font-bold text-white mt-1 block">${selectedEmp.basicSalary.toLocaleString()}</span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block font-sans">Allowances</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">+${selectedEmp.allowances.toLocaleString()}</span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block font-sans">Deductions</span>
                <span className="text-xl font-bold text-rose-400 mt-1 block">-${selectedEmp.deductions.toLocaleString()}</span>
              </div>

              <div className="bg-brand-600/20 p-4 rounded-2xl border border-brand-500/40">
                <span className="text-xs text-brand-300 block font-sans">Net Monthly Payable</span>
                <span className="text-2xl font-black text-white mt-1 block">${selectedEmp.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Admin View: All Employee Payroll Table */}
      {isHr && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
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
            <tbody className="divide-y divide-slate-800">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block">{emp.fullName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</span>
                  </td>
                  <td className="p-4 text-slate-300">{emp.departmentName || 'General'}</td>
                  <td className="p-4 font-mono text-slate-300">${emp.basicSalary.toLocaleString()}</td>
                  <td className="p-4 font-mono text-emerald-400">+${emp.allowances.toLocaleString()}</td>
                  <td className="p-4 font-mono text-rose-400">-${emp.deductions.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-white">${emp.netSalary.toLocaleString()}</td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedEmp(emp);
                        setEditBasic(emp.basicSalary.toString());
                        setEditAllowances(emp.allowances.toString());
                        setEditDeductions(emp.deductions.toString());
                        setShowEditModal(true);
                      }}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
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
              <label className="font-semibold text-slate-300 block mb-1">Basic Monthly Salary ($)</label>
              <input
                type="number"
                required
                value={editBasic}
                onChange={e => setEditBasic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Allowances ($)</label>
              <input
                type="number"
                required
                value={editAllowances}
                onChange={e => setEditAllowances(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Deductions ($)</label>
              <input
                type="number"
                required
                value={editDeductions}
                onChange={e => setEditDeductions(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-glow"
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
