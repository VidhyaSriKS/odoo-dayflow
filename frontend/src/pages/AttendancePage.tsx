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
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-brand-400" />
            <span>{isHr ? 'Organization Attendance Monitor' : 'My Attendance & Punch Log'}</span>
          </h1>
          <p className="text-xs text-slate-400">Track daily check-ins, check-outs, total logged working hours, and monthly logs.</p>
        </div>

        {/* Check-In Action Button */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-700 p-3 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Punch</span>
            <span className="text-xs font-bold text-white">{isCheckedIn ? 'Checked In (09:02 AM)' : 'Checked Out'}</span>
          </div>
          <button
            onClick={handleToggleCheckIn}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow transition-all ${
              isCheckedIn ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
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
            <span className="text-slate-400 block">August Rate</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">94.2%</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-slate-400 block">Total Hours</span>
            <span className="text-xl font-extrabold text-white mt-1 block">152.5 Hours</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-slate-400 block">On-Time Arrivals</span>
            <span className="text-xl font-extrabold text-sky-400 mt-1 block">18 / 19 Days</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-slate-400 block">Late Arrivals</span>
            <span className="text-xl font-extrabold text-amber-400 mt-1 block">1 Day</span>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
          </select>
        </div>

        <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-2">
          <Download className="w-3.5 h-3.5 text-brand-400" />
          <span>Export Sheet</span>
        </button>
      </div>

      {/* Attendance Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
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
          <tbody className="divide-y divide-slate-800">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-mono font-medium text-white">{r.date}</td>
                <td className="p-4">
                  <span className="font-bold text-white block">{r.employeeName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.employeeCode}</span>
                </td>
                <td className="p-4 text-slate-300">{r.departmentName || 'General'}</td>
                <td className="p-4 text-slate-300 font-mono">
                  {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="p-4 text-slate-300 font-mono">
                  {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="p-4 font-mono font-bold text-white">
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
