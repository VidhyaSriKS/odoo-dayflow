import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { apiClient } from '../api/client';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
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
  Activity,
  ArrowUpRight
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
  const [leaveBalance, setLeaveBalance] = useState(12);

  const [activityLogs, setActivityLogs] = useState([
    { id: 1, text: 'Checked in at 09:02 AM', time: 'Today 09:02 AM', icon: Clock, color: 'text-[#22C55E]' },
    { id: 2, text: 'Sick Leave request submitted for Aug 23-24', time: 'Today 08:30 AM', icon: FilePlus, color: 'text-[#F59E0B]' },
    { id: 3, text: 'Paid Leave request approved by HR Director', time: 'Yesterday', icon: CheckCircle, color: 'text-[#7C3AED] dark:text-[#A78BFA]' },
    { id: 4, text: 'August 2026 Salary Slip credited to account', time: '3 days ago', icon: DollarSign, color: 'text-[#22C55E]' },
  ]);

  const handleToggleCheckIn = async () => {
    if (!isCheckedIn) {
      // Check in
      await apiClient.checkIn(user?.employeeId || 2);
      setIsCheckedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
      addNotification("Checked In", `Checked in at ${timeStr}`, "SUCCESS");
      setActivityLogs(prev => [{ id: Date.now(), text: `Checked in at ${timeStr}`, time: 'Just now', icon: Clock, color: 'text-[#22C55E]' }, ...prev]);
    } else {
      // Check out
      await apiClient.checkOut(user?.employeeId || 2);
      setIsCheckedIn(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addNotification("Checked Out", `Checked out at ${timeStr}. Working hours saved.`, "INFO");
      setActivityLogs(prev => [{ id: Date.now(), text: `Checked out at ${timeStr}`, time: 'Just now', icon: Square, color: 'text-[#EF4444]' }, ...prev]);
    }
  };

  const chartData = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 8.4 },
    { day: 'Fri', hours: 8.8 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting & Quick Check-In Bar */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E9E5F7] dark:border-[#30334F]">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">
            Welcome back, {user?.fullName || 'Alex Taylor'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A9A8BC]">
            Senior Software Engineer • Engineering Department (EMP1002)
          </p>
        </div>

        {/* Live Check-In Button */}
        <div className="flex items-center space-x-3 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] p-2.5 rounded-2xl">
          <div className="flex flex-col text-right px-2">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#A9A8BC] tracking-wider">Today's Status</span>
            <div className="flex items-center space-x-1.5 justify-end">
              <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-[#22C55E] animate-ping' : 'bg-[#EF4444]'}`}></span>
              <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">{isCheckedIn ? 'Checked In' : 'Checked Out'}</span>
            </div>
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

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Present Today"
          value={workingHours}
          subtitle={`Check-in: ${checkInTime}`}
          icon={Clock}
          trend="+12m vs avg"
          trendType="positive"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />

        <StatCard
          title="Leave Balance"
          value={`${leaveBalance} Days`}
          subtitle="15 Paid, 8 Sick remaining"
          icon={CalendarDays}
          trend="Next: Sick (23 Aug)"
          trendType="neutral"
          color="bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40"
        />

        <StatCard
          title="Attendance Rate"
          value="94.2%"
          subtitle="August 2026 record"
          icon={Percent}
          trend="Top 10%"
          trendType="positive"
          color="bg-emerald-100 dark:bg-emerald-950/50 text-[#22C55E] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
        />

        <StatCard
          title="Today's Status"
          value={isCheckedIn ? 'Checked In' : 'Out'}
          subtitle="Shift: 09:00 - 17:30"
          icon={CheckCircle}
          trend="On Time"
          trendType="positive"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />
      </div>

      {/* Main Content Grid: Chart & Quick Actions / Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF]">Weekly Logged Hours</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">August 18 - August 22, 2026</p>
            </div>
            <span className="text-xs font-mono text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-purple-950/60 px-3 py-1 rounded-full border border-[#E9E5F7] dark:border-purple-800/40 font-semibold">
              Avg: 8.5h / day
            </span>
          </div>

          <div className="h-64 w-full pt-4">
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

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/leaves')}
                className="p-3 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl text-left transition-all group"
              >
                <FilePlus className="w-5 h-5 text-[#7C3AED] dark:text-[#A78BFA] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] block">Apply Leave</span>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Submit request</span>
              </button>

              <button
                onClick={() => navigate('/payroll')}
                className="p-3 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl text-left transition-all group"
              >
                <DollarSign className="w-5 h-5 text-[#22C55E] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] block">View Salary</span>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Payslip PDF</span>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="p-3 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl text-left transition-all group"
              >
                <User className="w-5 h-5 text-[#7C3AED] dark:text-[#A78BFA] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] block">My Profile</span>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Job info & salary</span>
              </button>

              <button
                onClick={() => navigate('/ai-assistant')}
                className="p-3 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#26294a] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl text-left transition-all group"
              >
                <Activity className="w-5 h-5 text-[#3B82F6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] block">Ask AI</span>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">Instant HR bot</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC]">Recent Activity</h3>
            <div className="space-y-3">
              {activityLogs.map((log) => {
                const Icon = log.icon;
                return (
                  <div key={log.id} className="flex items-start space-x-3 text-xs border-b border-[#E9E5F7] dark:border-[#30334F] pb-2.5 last:border-none last:pb-0">
                    <div className={`p-1.5 rounded-lg bg-[#F5F3FF] dark:bg-[#1E2038] ${log.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1F1937] dark:text-[#F8F7FF] font-medium leading-snug truncate">{log.text}</p>
                      <span className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] block mt-0.5">{log.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
