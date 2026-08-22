import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../api/client';
import { AnalyticsData } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  FileCheck,
  Percent,
  TrendingUp,
  DollarSign,
  Building,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const PURPLE_COLORS = ['#7C3AED', '#8B5CF6', '#A78BFA', '#22C55E', '#F59E0B'];

export const HrDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getAnalytics().then(setData);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E9E5F7] dark:border-[#30334F]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">
            Organization HR Dashboard 🏢
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#A9A8BC]">
            Real-time headcount, attendance monitoring, leave approvals, and payroll overview.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/employees')}
            className="px-4 py-2.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Employees"
          value={data?.totalEmployees || 250}
          subtitle="Across 5 departments"
          icon={Users}
          trend="+12 this month"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />

        <StatCard
          title="Present Today"
          value={data?.presentToday || 218}
          subtitle="87.2% active attendance"
          icon={UserCheck}
          trend="Checked in"
          color="bg-emerald-100 dark:bg-emerald-950/50 text-[#22C55E] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
        />

        <StatCard
          title="Absent Today"
          value={data?.absentToday || 18}
          subtitle="Unexcused / Pending"
          icon={UserX}
          trend="7.2% rate"
          trendType="negative"
          color="bg-rose-100 dark:bg-rose-950/50 text-[#EF4444] dark:text-rose-400 border border-rose-200 dark:border-rose-800/40"
        />

        <StatCard
          title="On Leave"
          value={data?.onLeaveToday || 14}
          subtitle="Approved requests"
          icon={Clock}
          trend="Paid & Sick"
          trendType="neutral"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />

        <StatCard
          title="Pending Leaves"
          value={data?.pendingLeaveRequests || 12}
          subtitle="Requires HR approval"
          icon={FileCheck}
          trend="Needs Review"
          trendType="negative"
          color="bg-amber-100 dark:bg-amber-950/50 text-[#F59E0B] dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
        />

        <StatCard
          title="Attendance Rate"
          value={`${data?.attendanceRate || 87.2}%`}
          subtitle="Monthly average"
          icon={Percent}
          trend="Target: 90%"
          trendType="positive"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Monthly Attendance Trend (%)</span>
            </h3>
            <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] font-mono">Last 6 Months</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.attendanceTrend || []}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#8B5CF6' : '#7C3AED'} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={isDark ? '#8B5CF6' : '#7C3AED'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} tickLine={false} />
                <YAxis stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} tickLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#181A30' : '#FFFFFF', borderColor: isDark ? '#30334F' : '#E9E5F7', borderRadius: '12px', color: isDark ? '#F8F7FF' : '#1F1937' }} />
                <Area type="monotone" dataKey="rate" stroke={isDark ? '#8B5CF6' : '#7C3AED'} strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Headcount Distribution */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF] flex items-center space-x-2">
              <Building className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Headcount by Department</span>
            </h3>
            <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] font-mono">5 Departments</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.departmentDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.departmentDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PURPLE_COLORS[index % PURPLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#181A30' : '#FFFFFF', borderColor: isDark ? '#30334F' : '#E9E5F7', borderRadius: '12px', color: isDark ? '#F8F7FF' : '#1F1937' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts & Leave Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Requests Quick Approval Shortcut */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF]">Pending Leave Approvals</h3>
            <button onClick={() => navigate('/leaves')} className="text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA] hover:underline flex items-center gap-1">
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF] block">Alex Taylor (EMP1002)</span>
                <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Engineering • Sick Leave (2 Days: Aug 23 - Aug 24)</span>
              </div>
              <button
                onClick={() => navigate('/leaves')}
                className="px-3 py-1.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Review Request
              </button>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF] block">Michael Scott (EMP1004)</span>
                <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Finance • Paid Leave (1 Day: Aug 28)</span>
              </div>
              <button
                onClick={() => navigate('/leaves')}
                className="px-3 py-1.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Review Request
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Payroll Summary */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A9A8BC] block">Total Monthly Payroll</span>
            <div className="text-3xl font-black text-[#1F1937] dark:text-[#F8F7FF] mt-1 font-mono">
              ${(data?.totalMonthlyPayroll || 1845000).toLocaleString()}
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] mt-2">Calculated net monthly disburse for 250 active employees.</p>
          </div>

          <button
            onClick={() => navigate('/payroll')}
            className="w-full py-3 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#30334F] border border-[#E9E5F7] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors"
          >
            <DollarSign className="w-4 h-4 text-[#22C55E]" />
            <span>Open Payroll Management</span>
          </button>
        </div>
      </div>
    </div>
  );
};
