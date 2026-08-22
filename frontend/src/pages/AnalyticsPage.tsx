import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useTheme } from '../context/ThemeContext';
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

export const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    apiClient.getAnalytics().then(setData);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
          <span>HR Intelligence & Business Analytics</span>
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Visual workforce metrics, attendance compliance trends, leave utilization, and financial payroll distribution.</p>
      </div>

      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Headcount Growth"
          value={data?.totalEmployees || 250}
          subtitle="Active workforce"
          icon={Users}
          trend="+12 month"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />

        <StatCard
          title="Avg Attendance Rate"
          value={`${data?.attendanceRate || 87.2}%`}
          subtitle="Monthly compliance"
          icon={Percent}
          trend="+2.1%"
          color="bg-emerald-100 dark:bg-emerald-950/50 text-[#22C55E] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
        />

        <StatCard
          title="Leave Utilization"
          value="104 Days"
          subtitle="Total August leaves taken"
          icon={Clock}
          trend="42 Paid, 28 Sick"
          trendType="neutral"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />

        <StatCard
          title="Monthly Disburse"
          value={`$${((data?.totalMonthlyPayroll || 1845000) / 1000).toFixed(0)}k`}
          subtitle="Total net payroll disburse"
          icon={DollarSign}
          trend="Budget Aligned"
          color="bg-purple-100 dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-purple-200 dark:border-purple-800/40"
        />
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Line/Area Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF] flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span>6-Month Attendance Rate Trend (%)</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.attendanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#30334F' : '#E9E5F7'} />
                <XAxis dataKey="month" stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} />
                <YAxis stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#181A30' : '#FFFFFF', borderColor: isDark ? '#30334F' : '#E9E5F7', borderRadius: '12px', color: isDark ? '#F8F7FF' : '#1F1937' }} />
                <Area type="monotone" dataKey="rate" stroke={isDark ? '#8B5CF6' : '#7C3AED'} strokeWidth={3} fillOpacity={0.3} fill={isDark ? '#8B5CF6' : '#7C3AED'} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Utilization Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#1F1937] dark:text-[#F8F7FF] flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span>Leave Utilization by Category</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.leaveTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#30334F' : '#E9E5F7'} />
                <XAxis dataKey="type" stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} />
                <YAxis stroke={isDark ? '#77768A' : '#9CA3AF'} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#181A30' : '#FFFFFF', borderColor: isDark ? '#30334F' : '#E9E5F7', borderRadius: '12px', color: isDark ? '#F8F7FF' : '#1F1937' }} />
                <Bar dataKey="count" fill={isDark ? '#8B5CF6' : '#7C3AED'} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
