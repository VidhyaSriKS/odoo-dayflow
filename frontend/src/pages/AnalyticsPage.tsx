import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { AnalyticsData } from '../types';
import { StatCard } from '../components/StatCard';
import {
  BarChart3,
  TrendingUp,
  Users,
  Percent,
  Clock,
  PieChart as PieIcon,
  DollarSign
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
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const COLORS = ['#0c8de9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    apiClient.getAnalytics().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          <span>HR Intelligence & Business Analytics</span>
        </h1>
        <p className="text-xs text-slate-400">Visual workforce metrics, attendance compliance trends, leave utilization, and financial payroll distribution.</p>
      </div>

      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Headcount Growth"
          value={data?.totalEmployees || 250}
          subtitle="Active workforce"
          icon={Users}
          trend="+12 month"
          color="from-brand-600 to-cyan-500"
        />

        <StatCard
          title="Avg Attendance Rate"
          value={`${data?.attendanceRate || 87.2}%`}
          subtitle="Monthly compliance"
          icon={Percent}
          trend="+2.1%"
          color="from-emerald-600 to-teal-500"
        />

        <StatCard
          title="Leave Utilization"
          value="104 Days"
          subtitle="Total August leaves taken"
          icon={Clock}
          trend="42 Paid, 28 Sick"
          trendType="neutral"
          color="from-purple-600 to-indigo-500"
        />

        <StatCard
          title="Monthly Disburse"
          value={`$${((data?.totalMonthlyPayroll || 1845000) / 1000).toFixed(0)}k`}
          subtitle="Total net payroll disburse"
          icon={DollarSign}
          trend="Budget Aligned"
          color="from-blue-600 to-sky-500"
        />
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Line/Area Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>6-Month Attendance Rate Trend (%)</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.attendanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={0.3} fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Utilization Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <span>Leave Utilization by Category</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.leaveTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="type" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#0c8de9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
