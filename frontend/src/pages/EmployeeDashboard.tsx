import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:02 AM');
  const [workingHours, setWorkingHours] = useState('8h 32m');
  const [leaveBalance, setLeaveBalance] = useState(12);

  const [activityLogs, setActivityLogs] = useState([
    { id: 1, text: 'Checked in at 09:02 AM', time: 'Today 09:02 AM', icon: Clock, color: 'text-emerald-400' },
    { id: 2, text: 'Sick Leave request submitted for Aug 23-24', time: 'Today 08:30 AM', icon: FilePlus, color: 'text-amber-400' },
    { id: 3, text: 'Paid Leave request approved by HR Director', time: 'Yesterday', icon: CheckCircle, color: 'text-sky-400' },
    { id: 4, text: 'August 2026 Salary Slip credited to account', time: '3 days ago', icon: DollarSign, color: 'text-emerald-400' },
  ]);

  const handleToggleCheckIn = async () => {
    if (!isCheckedIn) {
      // Check in
      await apiClient.checkIn(user?.employeeId || 2);
      setIsCheckedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
      addNotification("Checked In", `Checked in at ${timeStr}`, "SUCCESS");
      setActivityLogs(prev => [{ id: Date.now(), text: `Checked in at ${timeStr}`, time: 'Just now', icon: Clock, color: 'text-emerald-400' }, ...prev]);
    } else {
      // Check out
      await apiClient.checkOut(user?.employeeId || 2);
      setIsCheckedIn(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addNotification("Checked Out", `Checked out at ${timeStr}. Working hours saved.`, "INFO");
      setActivityLogs(prev => [{ id: Date.now(), text: `Checked out at ${timeStr}`, time: 'Just now', icon: Square, color: 'text-rose-400' }, ...prev]);
    }
  };

  const chartData = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 8.4 },
    { day: 'Fri', hours: 8.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting & Quick Check-In Bar */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/80">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName || 'Alex Taylor'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Senior Software Engineer • Engineering Department (EMP1002)
          </p>
        </div>

        {/* Live Check-In Button */}
        <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-700/80 p-2.5 rounded-2xl">
          <div className="flex flex-col text-right px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Today's Status</span>
            <div className="flex items-center space-x-1.5 justify-end">
              <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
              <span className="text-xs font-bold text-white">{isCheckedIn ? 'Checked In' : 'Checked Out'}</span>
            </div>
          </div>

          <button
            onClick={handleToggleCheckIn}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-glow transition-all ${
              isCheckedIn
                ? 'bg-rose-600/90 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
          color="from-brand-600 to-cyan-500"
        />

        <StatCard
          title="Leave Balance"
          value={`${leaveBalance} Days`}
          subtitle="15 Paid, 8 Sick remaining"
          icon={CalendarDays}
          trend="Next: Sick (23 Aug)"
          trendType="neutral"
          color="from-purple-600 to-indigo-500"
        />

        <StatCard
          title="Attendance Rate"
          value="94.2%"
          subtitle="August 2026 record"
          icon={Percent}
          trend="Top 10%"
          trendType="positive"
          color="from-emerald-600 to-teal-500"
        />

        <StatCard
          title="Today's Status"
          value={isCheckedIn ? 'Checked In' : 'Out'}
          subtitle="Shift: 09:00 - 17:30"
          icon={CheckCircle}
          trend="On Time"
          trendType="positive"
          color="from-blue-600 to-sky-500"
        />
      </div>

      {/* Main Content Grid: Chart & Quick Actions / Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Logged Hours</h3>
              <p className="text-xs text-slate-400">August 18 - August 22, 2026</p>
            </div>
            <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              Avg: 8.5h / day
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c8de9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0c8de9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`${val} hours`, 'Worked']}
                />
                <Area type="monotone" dataKey="hours" stroke="#0c8de9" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/leaves')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all group"
              >
                <FilePlus className="w-5 h-5 text-brand-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Apply Leave</span>
                <span className="text-[10px] text-slate-400">Submit request</span>
              </button>

              <button
                onClick={() => navigate('/payroll')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all group"
              >
                <DollarSign className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">View Salary</span>
                <span className="text-[10px] text-slate-400">Payslip PDF</span>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all group"
              >
                <User className="w-5 h-5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">My Profile</span>
                <span className="text-[10px] text-slate-400">Job info & salary</span>
              </button>

              <button
                onClick={() => navigate('/ai-assistant')}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all group"
              >
                <Activity className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Ask AI</span>
                <span className="text-[10px] text-slate-400">Instant HR bot</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activity</h3>
            <div className="space-y-3">
              {activityLogs.map((log) => {
                const Icon = log.icon;
                return (
                  <div key={log.id} className="flex items-start space-x-3 text-xs border-b border-slate-800/60 pb-2.5 last:border-none last:pb-0">
                    <div className={`p-1.5 rounded-lg bg-slate-800 ${log.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 font-medium leading-snug truncate">{log.text}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{log.time}</span>
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
