import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Employee } from '../types';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Clock, Plane, Minus, LogIn, LogOut, X } from 'lucide-react';

// Status type for each employee card
type EmpStatus = 'PRESENT' | 'ABSENT' | 'ON_LEAVE';

function statusDot(status: EmpStatus) {
  if (status === 'PRESENT') return (
    <span className="w-3 h-3 rounded-full bg-[#22C55E] ring-2 ring-white dark:ring-[#1E2038] shadow" title="Present" />
  );
  if (status === 'ON_LEAVE') return (
    <span className="w-3 h-3 rounded-full bg-[#60A5FA] ring-2 ring-white dark:ring-[#1E2038] flex items-center justify-center shadow" title="On Leave">
      <Plane className="w-2 h-2 text-white" />
    </span>
  );
  return (
    <span className="w-3 h-3 rounded-full bg-[#F59E0B] ring-2 ring-white dark:ring-[#1E2038] shadow" title="Absent" />
  );
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// Avatar color palette per employee
const AVATAR_COLORS = [
  'from-[#7C3AED] to-[#8B5CF6]',
  'from-[#2563EB] to-[#60A5FA]',
  'from-[#059669] to-[#34D399]',
  'from-[#D97706] to-[#FBBF24]',
  'from-[#DC2626] to-[#F87171]',
  'from-[#7C3AED] to-[#C084FC]',
  'from-[#0891B2] to-[#22D3EE]',
];

// View-only Employee Profile Modal
function EmployeeProfileModal({
  emp,
  status,
  onClose,
}: {
  emp: Employee;
  status: EmpStatus;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-3xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E9E5F7] dark:border-[#30334F]">
          <h2 className="text-base font-extrabold text-[#1F1937] dark:text-[#F8F7FF]">Employee Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-colors">
            <X className="w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 p-5 border-b border-[#E9E5F7] dark:border-[#30334F]">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[emp.id % AVATAR_COLORS.length]} flex items-center justify-center shadow-lg`}>
              <span className="text-2xl font-extrabold text-white">{getInitials(emp.fullName)}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5">{statusDot(status)}</div>
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#1F1937] dark:text-[#F8F7FF]">{emp.fullName}</p>
            <p className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold">{emp.designation}</p>
            <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] font-mono mt-0.5">{emp.employeeCode}</p>
          </div>
        </div>

        {/* Info Fields */}
        <div className="p-5 space-y-3 text-sm">
          {[
            { label: 'Email', value: emp.email },
            { label: 'Phone', value: emp.phone || '—' },
            { label: 'Department', value: emp.departmentName || '—' },
            { label: 'Joining Date', value: emp.joiningDate },
            { label: 'Status', value: emp.employmentStatus },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-[#F5F3FF] dark:border-[#1E2038] pb-2">
              <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] font-medium w-28">{label}</span>
              <span className="text-xs text-[#1F1937] dark:text-[#F8F7FF] font-semibold flex-1 text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5">
          <p className="text-[10px] text-center text-[#9CA3AF] dark:text-[#77768A]">View-only mode — contact HR to edit profile details</p>
        </div>
      </div>
    </div>
  );
}

export const EmployeeHomePage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  // Demo status map: employee id → status
  const [statusMap] = useState<Record<number, EmpStatus>>({
    1: 'PRESENT',
    2: 'PRESENT',
    3: 'ON_LEAVE',
    4: 'ABSENT',
    5: 'PRESENT',
    6: 'ON_LEAVE',
    7: 'ABSENT',
    8: 'PRESENT',
    9: 'PRESENT',
    10: 'ABSENT',
  });

  useEffect(() => {
    apiClient.getEmployees().then(setEmployees);
  }, []);

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
    (e.designation || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = () => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setCheckInTime(t);
    addNotification('Checked In ✓', `Successfully checked in at ${t}`, 'SUCCESS');
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addNotification('Checked Out', `Checked out at ${t}. Hours saved.`, 'INFO');
    setCheckInTime(null);
  };

  return (
    <div className="space-y-5">
      {/* Top bar: Search + NEW button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">Employees</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280] dark:text-[#A9A8BC]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] transition-colors"
            />
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            NEW
          </button>
        </div>
      </div>

      {/* Main grid + Sidebar */}
      <div className="flex gap-5">
        {/* Employee Card Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((emp, idx) => {
            const status: EmpStatus = statusMap[emp.id] || 'ABSENT';
            const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <button
                key={emp.id}
                onClick={() => setSelectedEmp(emp)}
                className="relative group flex flex-col items-center gap-2.5 p-4 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl shadow-sm hover:shadow-md hover:border-[#7C3AED] dark:hover:border-[#8B5CF6] hover:-translate-y-0.5 transition-all text-center"
              >
                {/* Status dot top-right */}
                <div className="absolute top-2.5 right-2.5">
                  {statusDot(status)}
                </div>

                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                  <span className="text-xl font-extrabold text-white">{getInitials(emp.fullName)}</span>
                </div>

                {/* Name */}
                <div className="w-full">
                  <p className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] leading-tight truncate">{emp.fullName}</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] truncate mt-0.5">{emp.designation || emp.departmentName}</p>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#9CA3AF] dark:text-[#77768A] text-sm">
              No employees found for "{search}"
            </div>
          )}
        </div>

        {/* Right Sidebar: Check In / Out */}
        <div className="hidden md:flex flex-col gap-4 w-52 flex-shrink-0">
          {/* Check In card */}
          <div className="bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isCheckedIn ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'}`} />
              <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </span>
            </div>

            {isCheckedIn && checkInTime && (
              <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Since {checkInTime}</p>
            )}

            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-[#F5F3FF] dark:bg-[#1E2038] hover:bg-[#EDE9FE] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA] transition-all group"
              >
                <span>Check IN</span>
                <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-[#FEF2F2] dark:bg-[#2D1A1A] hover:bg-[#FEE2E2] dark:hover:bg-[#3D2020] border border-[#FECACA] dark:border-[#7F1D1D] rounded-xl text-xs font-bold text-[#EF4444] transition-all group"
              >
                <span>Check Out</span>
                <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl p-4 space-y-2.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">Status Legend</p>
            <div className="flex items-center gap-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
              <span>On Leave</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1F1937] dark:text-[#F8F7FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>Absent (no leave)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl p-4 space-y-2 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC] mb-2">Quick Links</p>
            {[
              { label: 'My Attendance', path: '/attendance' },
              { label: 'Time Off', path: '/leaves' },
              { label: 'My Payslip', path: '/payroll' },
            ].map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="w-full text-left text-xs text-[#7C3AED] dark:text-[#A78BFA] hover:underline font-semibold py-0.5"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile check-in strip */}
      <div className="flex md:hidden items-center justify-between gap-3 p-4 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isCheckedIn ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'}`} />
          <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">
            {isCheckedIn ? `Checked In ${checkInTime ? 'at ' + checkInTime : ''}` : 'Not Checked In'}
          </span>
        </div>
        {!isCheckedIn ? (
          <button onClick={handleCheckIn} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-bold rounded-xl">
            <LogIn className="w-3.5 h-3.5" /> Check IN
          </button>
        ) : (
          <button onClick={handleCheckOut} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] text-white text-xs font-bold rounded-xl">
            <LogOut className="w-3.5 h-3.5" /> Check Out
          </button>
        )}
      </div>

      {/* Profile Modal */}
      {selectedEmp && (
        <EmployeeProfileModal
          emp={selectedEmp}
          status={statusMap[selectedEmp.id] || 'ABSENT'}
          onClose={() => setSelectedEmp(null)}
        />
      )}
    </div>
  );
};
