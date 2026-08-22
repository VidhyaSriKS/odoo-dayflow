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
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newDesignation, setNewDesignation] = useState('Software Engineer');
  const [newSalary, setNewSalary] = useState('75000');
  
  const [createdEmployeeCreds, setCreatedEmployeeCreds] = useState<{loginId: string, password: string} | null>(null);

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
    try {
      const basic = parseFloat(newSalary) || 75000;
      const res = await apiClient.createEmployee({
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        departmentName: newDept,
        designation: newDesignation,
        basicSalary: basic
      });
      setEmployees(prev => [res, ...prev]);
      setCreatedEmployeeCreds({ loginId: res.employeeCode, password: res.generatedPassword });
    } catch (err) {
      console.error("Failed to create employee", err);
    }
  };

  const resetAddForm = () => {
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewDesignation('Software Engineer');
    setCreatedEmployeeCreds(null);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Manage employee profiles, job titles, departments, and compensation.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
          <input
            type="text"
            placeholder="Search by name, ID, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] text-xs text-[#1F1937] dark:text-[#F8F7FF] rounded-xl px-3 py-2 focus:outline-none"
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
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#E9E5F7] dark:border-[#30334F]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F3FF] dark:bg-[#1E2038] text-[#6B7280] dark:text-[#A9A8BC] font-semibold uppercase tracking-wider border-b border-[#E9E5F7] dark:border-[#30334F]">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Net Salary</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-center font-bold text-[#7C3AED] dark:text-[#A78BFA]">
                        {emp.firstName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] block">{emp.fullName}</span>
                        <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-mono">{emp.employeeCode} • {emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[#1F1937] dark:text-[#F8F7FF]">{emp.departmentName || 'General'}</td>
                  <td className="p-4 text-[#6B7280] dark:text-[#A9A8BC]">{emp.designation}</td>
                  <td className="p-4">
                    <Badge status={emp.employmentStatus} />
                  </td>
                  <td className="p-4 font-mono font-semibold text-[#1F1937] dark:text-[#F8F7FF]">${emp.netSalary.toLocaleString()}</td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => { setSelectedEmp(emp); setShowDetailModal(true); }}
                      className="p-1.5 rounded-lg text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedEmp(emp); setShowSalarySlipModal(true); }}
                      className="p-1.5 rounded-lg text-[#22C55E] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
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
      <Modal isOpen={showAddModal} onClose={resetAddForm} title="Add New Employee">
        {createdEmployeeCreds ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">Employee Created!</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Please securely share these login credentials. The password will only be shown once.</p>
            
            <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-4 rounded-xl border border-[#E9E5F7] dark:border-[#30334F] space-y-3 text-left">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#A9A8BC]">Login ID</label>
                <div className="font-mono text-sm font-bold text-[#7C3AED] dark:text-[#A78BFA]">{createdEmployeeCreds.loginId}</div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#A9A8BC]">Initial Password</label>
                <div className="font-mono text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF] bg-white dark:bg-[#181A30] px-3 py-2 rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">{createdEmployeeCreds.password}</div>
              </div>
            </div>

            <button onClick={resetAddForm} className="w-full py-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl mt-4">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">First Name</label>
                <input type="text" required value={newFirstName} onChange={e => setNewFirstName(e.target.value)} className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]" />
              </div>
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Last Name</label>
                <input type="text" required value={newLastName} onChange={e => setNewLastName(e.target.value)} className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Email</label>
              <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Department</label>
                <select value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]">
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Designation</label>
                <input type="text" required value={newDesignation} onChange={e => setNewDesignation(e.target.value)} className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Basic Monthly Salary ($)</label>
              <input type="number" required value={newSalary} onChange={e => setNewSalary(e.target.value)} className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
              Save Employee Profile
            </button>
          </form>
        )}
      </Modal>

      {/* Employee Detail Drawer Modal */}
      {selectedEmp && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Employee Profile: ${selectedEmp.fullName}`}>
          <div className="space-y-6 text-xs text-[#1F1937] dark:text-[#F8F7FF]">
            {/* Top Info Banner */}
            <div className="flex items-center space-x-4 bg-[#FAF9FF] dark:bg-[#1E2038] p-4 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
              <div className="w-14 h-14 rounded-2xl bg-[#7C3AED] dark:bg-[#8B5CF6] text-white font-black text-2xl flex items-center justify-center shadow-md">
                {selectedEmp.firstName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">{selectedEmp.fullName}</h3>
                <p className="text-[#6B7280] dark:text-[#A9A8BC]">{selectedEmp.designation} • {selectedEmp.departmentName}</p>
                <span className="font-mono text-[#7C3AED] dark:text-[#A78BFA] text-[11px] mt-1 block font-semibold">{selectedEmp.employeeCode}</span>
              </div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#181A30] p-3.5 rounded-xl space-y-2 border border-[#E9E5F7] dark:border-[#30334F]">
                <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] uppercase text-[10px] tracking-wider block">Personal Information</span>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" /> {selectedEmp.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#22C55E]" /> {selectedEmp.phone || '+1 (555) 019-2831'}</p>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#EF4444]" /> {selectedEmp.address || 'San Francisco, CA'}</p>
              </div>

              <div className="bg-white dark:bg-[#181A30] p-3.5 rounded-xl space-y-2 border border-[#E9E5F7] dark:border-[#30334F]">
                <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] uppercase text-[10px] tracking-wider block">Job Information</span>
                <p><strong className="text-[#6B7280] dark:text-[#A9A8BC]">Joined:</strong> {selectedEmp.joiningDate}</p>
                <p><strong className="text-[#6B7280] dark:text-[#A9A8BC]">Status:</strong> <Badge status={selectedEmp.employmentStatus} /></p>
                <p><strong className="text-[#6B7280] dark:text-[#A9A8BC]">Department:</strong> {selectedEmp.departmentName}</p>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="bg-white dark:bg-[#181A30] p-4 rounded-xl space-y-2 border border-[#E9E5F7] dark:border-[#30334F]">
              <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] uppercase text-[10px] tracking-wider block">Compensation Breakdown</span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-2 rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">
                  <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] block">Basic</span>
                  <span className="text-[#1F1937] dark:text-[#F8F7FF] font-bold">${selectedEmp.basicSalary.toLocaleString()}</span>
                </div>
                <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-2 rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">
                  <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] block">Allowances</span>
                  <span className="text-[#22C55E] font-bold">+${selectedEmp.allowances.toLocaleString()}</span>
                </div>
                <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-2 rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">
                  <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] block">Deductions</span>
                  <span className="text-[#EF4444] font-bold">-${selectedEmp.deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-[#181A30] p-4 rounded-xl space-y-2 border border-[#E9E5F7] dark:border-[#30334F]">
              <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] uppercase text-[10px] tracking-wider block">Verified Documents</span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 bg-[#FAF9FF] dark:bg-[#1E2038] rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">
                  <span className="flex items-center gap-2 text-[#1F1937] dark:text-[#F8F7FF]"><FileText className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" /> Resume & Work Experience.pdf</span>
                  <span className="text-[10px] text-[#22C55E] font-semibold">Verified</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#FAF9FF] dark:bg-[#1E2038] rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">
                  <span className="flex items-center gap-2 text-[#1F1937] dark:text-[#F8F7FF]"><FileText className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" /> Passport & Identification.pdf</span>
                  <span className="text-[10px] text-[#22C55E] font-semibold">Verified</span>
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
