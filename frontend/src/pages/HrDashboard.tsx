import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
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
  ArrowRight,
  Bot
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

const COLORS = ['#0c8de9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const HrDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getAnalytics().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Organization HR Dashboard 🏢
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time headcount, attendance monitoring, leave approvals, and payroll overview.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/employees')}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition-all flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>AI Insights</span>
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
          color="from-brand-600 to-cyan-500"
        />

        <StatCard
          title="Present Today"
          value={data?.presentToday || 218}
          subtitle="87.2% active attendance"
          icon={UserCheck}
          trend="Checked in"
          color="from-emerald-600 to-teal-500"
        />

        <StatCard
          title="Absent Today"
          value={data?.absentToday || 18}
          subtitle="Unexcused / Pending"
          icon={UserX}
          trend="7.2% rate"
          trendType="negative"
          color="from-rose-600 to-pink-500"
        />

        <StatCard
          title="On Leave"
          value={data?.onLeaveToday || 14}
          subtitle="Approved requests"
          icon={Clock}
          trend="Paid & Sick"
          trendType="neutral"
          color="from-purple-600 to-indigo-500"
        />

        <StatCard
          title="Pending Leaves"
          value={data?.pendingLeaveRequests || 12}
          subtitle="Requires HR approval"
          icon={FileCheck}
          trend="Needs Review"
          trendType="negative"
          color="from-amber-600 to-yellow-500"
        />

        <StatCard
          title="Attendance Rate"
          value={`${data?.attendanceRate || 87.2}%`}
          subtitle="Monthly average"
          icon={Percent}
          trend="Target: 90%"
          trendType="positive"
          color="from-blue-600 to-sky-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              <span>Monthly Attendance Trend (%)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Last 6 Months</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.attendanceTrend || []}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Headcount Distribution */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Building className="w-4 h-4 text-purple-400" />
              <span>Headcount by Department</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">5 Departments</span>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
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
            <h3 className="text-base font-bold text-white">Pending Leave Approvals</h3>
            <button onClick={() => navigate('/leaves')} className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Alex Taylor (EMP1002)</span>
                <span className="text-xs text-slate-400">Engineering • Sick Leave (2 Days: Aug 23 - Aug 24)</span>
              </div>
              <button
                onClick={() => navigate('/leaves')}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl"
              >
                Review Request
              </button>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Michael Scott (EMP1004)</span>
                <span className="text-xs text-slate-400">Finance • Paid Leave (1 Day: Aug 28)</span>
              </div>
              <button
                onClick={() => navigate('/leaves')}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl"
              >
                Review Request
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Payroll Summary */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Monthly Payroll</span>
            <div className="text-3xl font-black text-white mt-1 font-mono">
              ${(data?.totalMonthlyPayroll || 1845000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2">Calculated net monthly disburse for 250 active employees.</p>
          </div>

          <button
            onClick={() => navigate('/payroll')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Open Payroll Management</span>
          </button>
        </div>
      </div>
    </div>
  );
};
