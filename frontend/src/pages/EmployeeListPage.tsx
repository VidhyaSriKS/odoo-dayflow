import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { apiClient } from '../api/client';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { SalarySlipModal } from '../components/SalarySlipModal';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  DollarSign,
  FileText
} from 'lucide-react';

export const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSalarySlipModal, setShowSalarySlipModal] = useState(false);

  // Add Employee Form State
  const [newCode, setNewCode] = useState('EMP1020');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newDesignation, setNewDesignation] = useState('Software Engineer');
  const [newSalary, setNewSalary] = useState('75000');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await apiClient.getEmployees();
    setEmployees(data);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.departmentName === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const basic = parseFloat(newSalary) || 75000;
    const newEmp: Employee = {
      id: Date.now(),
      employeeCode: newCode,
      firstName: newFirstName,
      lastName: newLastName,
      fullName: `${newFirstName} ${newLastName}`,
      email: newEmail,
      departmentName: newDept,
      designation: newDesignation,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'ACTIVE',
      basicSalary: basic,
      allowances: 5000,
      deductions: 2000,
      netSalary: basic + 3000
    };
    setEmployees(prev => [newEmp, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-400" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-xs text-slate-400">Manage employee profiles, job titles, departments, and compensation.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-800/90 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Net Salary</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-brand-400">
                        {emp.firstName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{emp.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.employeeCode} • {emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-300">{emp.departmentName || 'General'}</td>
                  <td className="p-4 text-slate-300">{emp.designation}</td>
                  <td className="p-4">
                    <Badge status={emp.employmentStatus} />
                  </td>
                  <td className="p-4 font-mono font-semibold text-white">${emp.netSalary.toLocaleString()}</td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => { setSelectedEmp(emp); setShowDetailModal(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedEmp(emp); setShowSalarySlipModal(true); }}
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      title="Generate Payslip"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Employee">
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">First Name</label>
              <input type="text" required value={newFirstName} onChange={e => setNewFirstName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Last Name</label>
              <input type="text" required value={newLastName} onChange={e => setNewLastName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Email</label>
            <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Department</label>
              <select value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Designation</label>
              <input type="text" required value={newDesignation} onChange={e => setNewDesignation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Basic Monthly Salary ($)</label>
            <input type="number" required value={newSalary} onChange={e => setNewSalary(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-glow">
            Save Employee Profile
          </button>
        </form>
      </Modal>

      {/* Employee Detail Drawer Modal */}
      {selectedEmp && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Employee Profile: ${selectedEmp.fullName}`}>
          <div className="space-y-6 text-xs text-slate-200">
            {/* Top Info Banner */}
            <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center">
                {selectedEmp.firstName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedEmp.fullName}</h3>
                <p className="text-slate-400">{selectedEmp.designation} • {selectedEmp.departmentName}</p>
                <span className="font-mono text-brand-400 text-[11px] mt-1 block">{selectedEmp.employeeCode}</span>
              </div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-3.5 rounded-xl space-y-2 border border-slate-700/50">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Personal Information</span>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-400" /> {selectedEmp.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {selectedEmp.phone || '+1 (555) 019-2831'}</p>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-rose-400" /> {selectedEmp.address || 'San Francisco, CA'}</p>
              </div>

              <div className="bg-slate-800/40 p-3.5 rounded-xl space-y-2 border border-slate-700/50">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Job Information</span>
                <p><strong className="text-slate-400">Joined:</strong> {selectedEmp.joiningDate}</p>
                <p><strong className="text-slate-400">Status:</strong> <Badge status={selectedEmp.employmentStatus} /></p>
                <p><strong className="text-slate-400">Department:</strong> {selectedEmp.departmentName}</p>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="bg-slate-800/40 p-4 rounded-xl space-y-2 border border-slate-700/50">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Compensation Breakdown</span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Basic</span>
                  <span className="text-white font-bold">${selectedEmp.basicSalary.toLocaleString()}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Allowances</span>
                  <span className="text-emerald-400 font-bold">+${selectedEmp.allowances.toLocaleString()}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Deductions</span>
                  <span className="text-rose-400 font-bold">-${selectedEmp.deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-800/40 p-4 rounded-xl space-y-2 border border-slate-700/50">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Verified Documents</span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                  <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-brand-400" /> Resume & Work Experience.pdf</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Verified</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                  <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-brand-400" /> Passport & Identification.pdf</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Salary Slip Modal */}
      {selectedEmp && (
        <SalarySlipModal
          isOpen={showSalarySlipModal}
          onClose={() => setShowSalarySlipModal(false)}
          employee={selectedEmp}
        />
      )}
    </div>
  );
};
