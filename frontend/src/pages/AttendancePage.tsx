import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { AttendanceRecord } from '../types';
import { Badge } from '../components/Badge';
import { useNotifications } from '../context/NotificationContext';
import {
  CalendarCheck,
  Clock,
  Play,
  Square,
  Filter,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const isHr = user?.role === 'ROLE_ADMIN';

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const list = await apiClient.getEmployees();
    // Generate records for demonstration
    const recs: AttendanceRecord[] = [
      { id: 1, employeeId: 2, employeeName: 'Alex Taylor', employeeCode: 'EMP1002', departmentName: 'Engineering', date: '2026-08-22', checkInTime: '2026-08-22T09:02:00', checkOutTime: '2026-08-22T17:34:00', workingHours: 8.5, status: 'PRESENT' },
      { id: 2, employeeId: 3, employeeName: 'Sarah Connor', employeeCode: 'EMP1003', departmentName: 'Engineering', date: '2026-08-22', checkInTime: '2026-08-22T08:55:00', checkOutTime: '2026-08-22T18:00:00', workingHours: 9.0, status: 'PRESENT' },
      { id: 3, employeeId: 4, employeeName: 'Michael Scott', employeeCode: 'EMP1004', departmentName: 'Finance', date: '2026-08-22', status: 'ABSENT' },
      { id: 4, employeeId: 5, employeeName: 'Elena Rostova', employeeCode: 'EMP1005', departmentName: 'Marketing', date: '2026-08-22', status: 'LEAVE', notes: 'Approved Annual Leave' },
      { id: 5, employeeId: 2, employeeName: 'Alex Taylor', employeeCode: 'EMP1002', departmentName: 'Engineering', date: '2026-08-21', checkInTime: '2026-08-21T09:00:00', checkOutTime: '2026-08-21T17:30:00', workingHours: 8.5, status: 'PRESENT' },
      { id: 6, employeeId: 2, employeeName: 'Alex Taylor', employeeCode: 'EMP1002', departmentName: 'Engineering', date: '2026-08-20', checkInTime: '2026-08-20T08:58:00', checkOutTime: '2026-08-20T17:30:00', workingHours: 8.5, status: 'PRESENT' }
    ];
    setRecords(recs);
  };

  const handleToggleCheckIn = async () => {
    if (!isCheckedIn) {
      await apiClient.checkIn(user?.employeeId || 2);
      setIsCheckedIn(true);
      addNotification('Check In Successful', 'Logged at ' + new Date().toLocaleTimeString(), 'SUCCESS');
    } else {
      await apiClient.checkOut(user?.employeeId || 2);
      setIsCheckedIn(false);
      addNotification('Check Out Successful', 'Saved working hours.', 'INFO');
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesDept = selectedDept === 'ALL' || r.departmentName === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Live Action Card */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E9E5F7] dark:border-[#30334F]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span>{isHr ? 'Organization Attendance Monitor' : 'My Attendance & Punch Log'}</span>
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Track daily check-ins, check-outs, total logged working hours, and monthly logs.</p>
        </div>

        {/* Check-In Action Button */}
        <div className="flex items-center space-x-3 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] p-3 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#A9A8BC] block">Today's Punch</span>
            <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">{isCheckedIn ? 'Checked In (09:02 AM)' : 'Checked Out'}</span>
          </div>
          <button
            onClick={handleToggleCheckIn}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
              isCheckedIn ? 'bg-[#EF4444] hover:bg-rose-600' : 'bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6]'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
        </div>
      </div>

      {/* Employee Attendance Summary Cards (if Employee View) */}
      {!isHr && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">August Rate</span>
            <span className="text-xl font-extrabold text-[#22C55E] mt-1 block">94.2%</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">Total Hours</span>
            <span className="text-xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] mt-1 block">152.5 Hours</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">On-Time Arrivals</span>
            <span className="text-xl font-extrabold text-[#7C3AED] dark:text-[#A78BFA] mt-1 block">18 / 19 Days</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-[#6B7280] dark:text-[#A9A8BC] block">Late Arrivals</span>
            <span className="text-xl font-extrabold text-[#F59E0B] mt-1 block">1 Day</span>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          <Filter className="w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
          </select>
        </div>

        <button className="px-3.5 py-1.5 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#30334F] border border-[#E9E5F7] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-xs font-semibold rounded-xl flex items-center space-x-2 transition-colors">
          <Download className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" />
          <span>Export Sheet</span>
        </button>
      </div>

      {/* Attendance Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#E9E5F7] dark:border-[#30334F]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F3FF] dark:bg-[#1E2038] text-[#6B7280] dark:text-[#A9A8BC] font-semibold uppercase tracking-wider border-b border-[#E9E5F7] dark:border-[#30334F]">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Employee</th>
              <th className="p-4">Department</th>
              <th className="p-4">Check-In</th>
              <th className="p-4">Check-Out</th>
              <th className="p-4">Working Hours</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038]/60 transition-colors">
                <td className="p-4 font-mono font-medium text-[#1F1937] dark:text-[#F8F7FF]">{r.date}</td>
                <td className="p-4">
                  <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] block">{r.employeeName}</span>
                  <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-mono">{r.employeeCode}</span>
                </td>
                <td className="p-4 text-[#6B7280] dark:text-[#A9A8BC]">{r.departmentName || 'General'}</td>
                <td className="p-4 text-[#6B7280] dark:text-[#A9A8BC] font-mono">
                  {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="p-4 text-[#6B7280] dark:text-[#A9A8BC] font-mono">
                  {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="p-4 font-mono font-bold text-[#1F1937] dark:text-[#F8F7FF]">
                  {r.workingHours ? `${r.workingHours}h` : '0h'}
                </td>
                <td className="p-4">
                  <Badge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
