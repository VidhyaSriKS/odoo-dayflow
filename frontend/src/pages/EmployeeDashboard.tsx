import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { apiClient } from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { LeaveRequest } from '../types';
import {
  Clock,
  CalendarDays,
  Percent,
  CheckCircle,
  Play,
  Square,
  FilePlus,
  User,
  DollarSign,
  Calendar,
  Building,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:02 AM');
  const [workingHours, setWorkingHours] = useState('8h 32m');
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const allLeaves = await apiClient.getLeaves();
      // Filter for employee's own leaves if available
      const myLeaves = allLeaves.filter(l => l.employeeId === (user?.employeeId || 2));
      setRecentLeaves(myLeaves.length > 0 ? myLeaves.slice(0, 4) : allLeaves.slice(0, 4));
    } catch (e) {
      console.warn("Failed to load leaves for dashboard", e);
    }
  };

  const handleToggleCheckIn = async () => {
    const empId = user?.employeeId || 2;
    if (!isCheckedIn) {
      // Check in
      await apiClient.checkIn(empId);
      setIsCheckedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
      addNotification("Checked In ✓", `Successfully checked in at ${timeStr}`, "SUCCESS");
    } else {
      // Check out
      await apiClient.checkOut(empId);
      setIsCheckedIn(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addNotification("Checked Out", `Checked out at ${timeStr}. Working hours recorded.`, "INFO");
    }
  };

  const chartData = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 8.4 },
    { day: 'Fri', hours: 8.8 },
  ];

  const upcomingHolidays = [
    { date: 'Sep 07, 2026', name: 'Labor Day', day: 'Monday' },
    { date: 'Nov 26, 2026', name: 'Thanksgiving Day', day: 'Thursday' },
    { date: 'Dec 25, 2026', name: 'Christmas Holiday', day: 'Friday' },
  ];

  const isDark = theme === 'dark';
  const currentDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">

      {/* ── 1. Welcome Section & Today's Attendance Header ── */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E9E5F7] dark:border-[#30334F]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentDateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">
            Welcome back, {user?.fullName || 'Alex Taylor'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A9A8BC]">
            Senior Software Engineer • Engineering Department ({user?.employeeCode || 'EMP1002'})
          </p>
        </div>

        {/* Live Attendance Punch Box */}
        <div className="flex items-center space-x-3 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex flex-col text-left sm:text-right px-2">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#A9A8BC] tracking-wider">Today's Punch</span>
            <div className="flex items-center space-x-1.5 justify-start sm:justify-end mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isCheckedIn ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'}`}></span>
              <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">{isCheckedIn ? 'Checked In' : 'Checked Out'}</span>
            </div>
            {isCheckedIn && (
              <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] mt-0.5">Since {checkInTime}</span>
            )}
          </div>

          <button
            onClick={handleToggleCheckIn}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all ${
              isCheckedIn
                ? 'bg-[#EF4444] hover:bg-rose-600 text-white'
                : 'bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
            }`}
          >
            {isCheckedIn ? (
              <>
                <Square className="w-4 h-4" />
                <span>Check Out</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Check In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 2. Stat Overview Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Working Hours Today"
          value={workingHours}
          subtitle={`Check-in: ${checkInTime}`}
          icon={Clock}
          trend="Standard 8h Shift"
          trendType="positive"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />

        <StatCard
          title="PTO Available"
          value="15 Days"
          subtitle="Annual Paid Time Off"
          icon={CalendarDays}
          trend="24 Total Allocated"
          trendType="neutral"
          color="bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40"
        />

        <StatCard
          title="Sick Leave Balance"
          value="8 Days"
          subtitle="Paid Medical Absence"
          icon={CheckCircle}
          trend="Fully Available"
          trendType="positive"
          color="bg-emerald-100 dark:bg-emerald-950/50 text-[#22C55E] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
        />

        <StatCard
          title="Attendance Score"
          value="98.5%"
          subtitle="Current Month Record"
          icon={Percent}
          trend="On Time Record"
          trendType="positive"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />
      </div>

      {/* ── 3. Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Weekly Hours Chart & Recent Leaves */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weekly Logged Hours Chart */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#E9E5F7] dark:border-[#30334F]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF]">Weekly Logged Hours</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Recent daily working duration summary</p>
              </div>
              <span className="text-xs font-mono text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-purple-950/60 px-3 py-1 rounded-full border border-[#E9E5F7] dark:border-purple-800/40 font-semibold">
                Avg: 8.5h / day
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? '#8B5CF6' : '#7C3AED'} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={isDark ? '#8B5CF6' : '#7C3AED'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} tickLine={false} />
                  <YAxis stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} tickLine={false} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#181A30' : '#FFFFFF',
                      borderColor: isDark ? '#30334F' : '#E9E5F7',
                      borderRadius: '12px',
                      color: isDark ? '#F8F7FF' : '#1F1937',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    formatter={(val: any) => [`${val} hours`, 'Worked']}
                  />
                  <Area type="monotone" dataKey="hours" stroke={isDark ? '#8B5CF6' : '#7C3AED'} strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Leave Requests Table */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#E9E5F7] dark:border-[#30334F]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF]">My Recent Leave Requests</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Status of submitted time off applications</p>
              </div>
              <button
                onClick={() => navigate('/leaves')}
                className="text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA] hover:underline flex items-center space-x-1"
              >
                <span>Apply / View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F3FF] dark:bg-[#1E2038] text-[#6B7280] dark:text-[#A9A8BC] font-semibold uppercase tracking-wider rounded-xl">
                  <tr>
                    <th className="p-3 rounded-l-xl">Type</th>
                    <th className="p-3">Date Range</th>
                    <th className="p-3">Days</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-right rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
                  {recentLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-[#F5F3FF]/50 dark:hover:bg-[#1E2038]/50 transition-colors">
                      <td className="p-3 font-semibold text-[#1F1937] dark:text-[#F8F7FF]">
                        {leave.leaveType}
                      </td>
                      <td className="p-3 text-[#6B7280] dark:text-[#A9A8BC]">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="p-3 font-medium text-[#1F1937] dark:text-[#F8F7FF]">
                        {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'}
                      </td>
                      <td className="p-3 text-[#6B7280] dark:text-[#A9A8BC] max-w-[150px] truncate">
                        {leave.reason}
                      </td>
                      <td className="p-3 text-right">
                        <Badge status={leave.status} />
                      </td>
                    </tr>
                  ))}
                  {recentLeaves.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-[#9CA3AF] dark:text-[#77768A]">
                        No leave requests submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Quick Links, Profile Summary, Holidays */}
        <div className="space-y-6">

          {/* Quick Actions Panel */}
          <div className="glass-panel p-5 rounded-3xl space-y-3 border border-[#E9E5F7] dark:border-[#30334F]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => navigate('/leaves')}
                className="p-3.5 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl text-left transition-all group"
              >
                <FilePlus className="w-5 h-5 text-[#7C3AED] dark:text-[#A78BFA] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] block">Apply Leave</span>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Time off request</span>
              </button>

              <button
                onClick={() => navigate('/payroll')}
                className="p-3.5 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl text-left transition-all group"
              >
                <DollarSign className="w-5 h-5 text-[#22C55E] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] block">My Salary</span>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Payslip & Slips</span>
              </button>
            </div>
          </div>

          {/* Employee Profile Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3.5 border border-[#E9E5F7] dark:border-[#30334F]">
            <div className="flex items-center justify-between border-b border-[#E9E5F7] dark:border-[#30334F] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">My Profile</h3>
              <button
                onClick={() => navigate('/profile')}
                className="text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA] hover:underline"
              >
                View Full
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                {(user?.fullName || 'Alex Taylor').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#1F1937] dark:text-[#F8F7FF]">{user?.fullName || 'Alex Taylor'}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Senior Software Engineer</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#6B7280] dark:text-[#A9A8BC] pt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#7C3AED]" /> Email</span>
                <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">{user?.email || 'alex.taylor@dayflow.com'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-[#7C3AED]" /> Department</span>
                <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Engineering</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> Employee Code</span>
                <span className="font-mono font-semibold text-[#7C3AED] dark:text-[#A78BFA]">{user?.employeeCode || 'EMP1002'}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="glass-panel p-5 rounded-3xl space-y-3 border border-[#E9E5F7] dark:border-[#30334F]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">Upcoming Company Holidays</h3>
            <div className="space-y-2.5">
              {upcomingHolidays.map((holiday, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#FAF9FF] dark:bg-[#1E2038] rounded-xl border border-[#E9E5F7] dark:border-[#30334F]">
                  <div>
                    <p className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">{holiday.name}</p>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">{holiday.day}</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-purple-950/60 px-2 py-1 rounded-lg border border-[#E9E5F7] dark:border-purple-800/40">
                    {holiday.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
