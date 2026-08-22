import React, { useState, useEffect, useMemo } from 'react';
import { Employee, AttendanceRecord } from '../types';
import { apiClient } from '../api/client';
import { Search, UserPlus, Settings, Users } from 'lucide-react';
import { Modal } from '../components/Modal';

type EmpStatus = 'PRESENT' | 'ABSENT' | 'LEAVE';

// Status Indicator: Green dot (Present), Airplane icon (On Leave), Yellow dot (Absent)
const StatusDot: React.FC<{ status: EmpStatus }> = ({ status }) => {
  if (status === 'PRESENT') {
    return (
      <span
        title="Present in office"
        className="w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#181A30] inline-block flex-shrink-0 shadow-sm animate-pulse"
      />
    );
  }
  if (status === 'LEAVE') {
    return (
      <span title="On approved leave" className="text-sm leading-none select-none">
        ✈️
      </span>
    );
  }
  // ABSENT (Yellow dot)
  return (
    <span
      title="Absent (no time off applied)"
      className="w-3.5 h-3.5 rounded-full bg-yellow-400 ring-2 ring-white dark:ring-[#181A30] inline-block flex-shrink-0 shadow-sm"
    />
  );
};

const DEPT_GRADIENTS: Record<string, string> = {
  Engineering: 'from-violet-500 to-purple-700',
  'Human Resources': 'from-pink-500 to-rose-600',
  Finance: 'from-emerald-500 to-teal-600',
  Marketing: 'from-orange-400 to-amber-500',
  Operations: 'from-blue-500 to-indigo-600',
};

const avatarGradient = (dept?: string) =>
  (dept && DEPT_GRADIENTS[dept]) ? DEPT_GRADIENTS[dept] : 'from-[#7C3AED] to-[#8B5CF6]';

export const HrDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // New employee form states
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newDesignation, setNewDesignation] = useState('Software Engineer');
  const [newSalary, setNewSalary] = useState('75000');
  const [createdCreds, setCreatedCreds] = useState<{ loginId: string; password: string } | null>(null);

  useEffect(() => {
    apiClient.getEmployees().then(setEmployees);
    apiClient.getAttendanceRecords().then(setAttendance);
  }, []);

  const attendanceMap = useMemo(() => {
    const map: Record<number, EmpStatus> = {};
    attendance.forEach(rec => {
      if (rec.status === 'PRESENT' || rec.status === 'HALF_DAY') map[rec.employeeId] = 'PRESENT';
      else if (rec.status === 'LEAVE') map[rec.employeeId] = 'LEAVE';
      else map[rec.employeeId] = 'ABSENT';
    });
    return map;
  }, [attendance]);

  const getStatus = (empId: number): EmpStatus => attendanceMap[empId] ?? 'ABSENT';

  const filtered = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
    emp.designation.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = filtered.filter(e => getStatus(e.id) === 'PRESENT').length;
  const leaveCount = filtered.filter(e => getStatus(e.id) === 'LEAVE').length;
  const absentCount = filtered.filter(e => getStatus(e.id) === 'ABSENT').length;

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.createEmployee({
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        departmentName: newDept,
        designation: newDesignation,
        basicSalary: parseFloat(newSalary) || 75000,
      });
      setEmployees(prev => [res, ...prev]);
      setCreatedCreds({ loginId: res.employeeCode, password: res.generatedPassword });
    } catch (err) {
      console.error('Failed to create employee', err);
    }
  };

  const resetForm = () => {
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewDesignation('Software Engineer');
    setCreatedCreds(null);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Action Bar Subheader: NEW button on left, Search on right */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
        <div className="flex items-center gap-3">
          {/* NEW Button (Vibrant Purple) */}
          <button
            id="btn-new-employee"
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-95 text-white text-sm font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-[0_4px_14px_rgba(124,58,237,0.35)] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>NEW</span>
          </button>

          {/* Quick status summary counts */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[#E9E5F7] dark:border-[#30334F] text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              {presentCount} Present
            </span>
            <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              ✈️ {leaveCount} On Leave
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              {absentCount} Absent
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#77768A]" />
          <input
            id="input-search-employees"
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#E9E5F7] dark:border-[#30334F] rounded-xl bg-[#FAF9FF] dark:bg-[#1E2038] text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:outline-none focus:border-[#7C3AED] transition-all"
          />
        </div>
      </div>

      {/* 3x3 Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(emp => {
          const status = getStatus(emp.id);
          return (
            <div
              key={emp.id}
              onClick={() => { setSelectedEmp(emp); setShowDetailModal(true); }}
              className="relative bg-white dark:bg-[#181A30] border-2 border-[#E9E5F7] dark:border-[#30334F] rounded-3xl p-6 flex flex-col items-center gap-4 hover:border-[#7C3AED] hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              {/* Top-right corner attendance status icon */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                <StatusDot status={status} />
              </div>

              {/* Employee Profile Picture / Avatar */}
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarGradient(emp.departmentName)} flex items-center justify-center text-white font-black text-3xl shadow-lg ring-4 ring-white dark:ring-[#121329] group-hover:scale-105 transition-transform duration-200`}>
                {emp.firstName.charAt(0)}
              </div>

              {/* Employee Basic Information */}
              <div className="w-full text-center space-y-1">
                <h3 className="text-lg font-extrabold text-[#1F1937] dark:text-[#F8F7FF] truncate">
                  [{emp.fullName}]
                </h3>
                <p className="text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA] truncate">
                  {emp.designation}
                </p>
                <p className="text-[11px] text-[#6B7280] dark:text-[#A9A8BC] truncate font-medium">
                  {emp.departmentName || 'General'} • {emp.employeeCode}
                </p>
              </div>

              {/* Status footer pill */}
              <div className="w-full pt-3 border-t border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-between text-xs text-[#6B7280] dark:text-[#A9A8BC]">
                <span>Status:</span>
                <span className="font-bold flex items-center gap-1.5">
                  {status === 'PRESENT' && <span className="text-emerald-500">● Present</span>}
                  {status === 'LEAVE' && <span>✈️ On Leave</span>}
                  {status === 'ABSENT' && <span className="text-amber-500">● Absent</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#9CA3AF] dark:text-[#77768A]">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No employees found matching search</p>
        </div>
      )}

      {/* Settings Link on Bottom Left */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-[#A78BFA] cursor-pointer transition-colors w-fit pt-2">
        <Settings className="w-4 h-4 text-[#7C3AED]" />
        <span>Settings</span>
      </div>

      {/* Add New Employee Modal */}
      <Modal isOpen={showAddModal} onClose={resetForm} title="Add New Employee">
        {createdCreds ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">Employee Account Created!</h3>
            <div className="bg-[#FAF9FF] dark:bg-[#1E2038] p-4 rounded-xl border border-[#E9E5F7] dark:border-[#30334F] space-y-3 text-left">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B7280]">Login ID</label>
                <div className="font-mono text-sm font-bold text-[#7C3AED]">{createdCreds.loginId}</div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B7280]">Initial Password</label>
                <div className="font-mono text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF] bg-white dark:bg-[#181A30] px-3 py-2 rounded-lg border border-[#E9E5F7] dark:border-[#30334F]">{createdCreds.password}</div>
              </div>
            </div>
            <button onClick={resetForm} className="w-full py-2.5 bg-[#7C3AED] text-white font-bold text-xs rounded-xl">Done</button>
          </div>
        ) : (
          <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">First Name</label>
                <input type="text" required value={newFirstName} onChange={e => setNewFirstName(e.target.value)} className="w-full mt-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none" />
              </div>
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Last Name</label>
                <input type="text" required value={newLastName} onChange={e => setNewLastName(e.target.value)} className="w-full mt-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Email</label>
              <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full mt-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Department</label>
                <select value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full mt-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none">
                  <option>Engineering</option><option>Human Resources</option><option>Finance</option><option>Marketing</option><option>Operations</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Designation</label>
                <input type="text" required value={newDesignation} onChange={e => setNewDesignation(e.target.value)} className="w-full mt-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Basic Monthly Salary ($)</label>
              <input type="number" required value={newSalary} onChange={e => setNewSalary(e.target.value)} className="w-full mt-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-xs text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
              Save Employee Profile
            </button>
          </form>
        )}
      </Modal>

      {/* Employee Detail Modal */}
      {selectedEmp && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Employee Profile: ${selectedEmp.fullName}`}>
          <div className="space-y-4 text-xs">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarGradient(selectedEmp.departmentName)} flex items-center justify-center text-white font-black text-3xl mx-auto shadow-lg`}>
              {selectedEmp.firstName.charAt(0)}
            </div>
            <div className="text-center">
              <p className="font-bold text-[#1F1937] dark:text-[#F8F7FF] text-base">{selectedEmp.fullName}</p>
              <p className="text-[#6B7280] dark:text-[#A9A8BC]">{selectedEmp.designation}</p>
              <p className="text-[#7C3AED] font-mono text-xs mt-1">{selectedEmp.employeeCode}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <StatusDot status={getStatus(selectedEmp.id)} />
              <span className="text-[#6B7280] dark:text-[#A9A8BC]">
                {getStatus(selectedEmp.id) === 'PRESENT' ? 'Present in office today' : getStatus(selectedEmp.id) === 'LEAVE' ? 'On approved leave today' : 'Absent today'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Department', value: selectedEmp.departmentName || 'General' },
                { label: 'Status', value: selectedEmp.employmentStatus },
                { label: 'Email', value: selectedEmp.email },
                { label: 'Net Salary', value: `$${selectedEmp.netSalary.toLocaleString()}` },
                { label: 'Joined', value: selectedEmp.joiningDate },
                { label: 'Basic', value: `$${selectedEmp.basicSalary.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#FAF9FF] dark:bg-[#1E2038] p-3 rounded-xl border border-[#E9E5F7] dark:border-[#30334F]">
                  <p className="text-[10px] font-bold uppercase text-[#9CA3AF] mb-1">{label}</p>
                  <p className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
