import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive',
  color = 'bg-[#F5F3FF] dark:bg-purple-950/50 text-[#7C3AED] dark:text-[#A78BFA] border border-[#E9E5F7] dark:border-purple-800/40'
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-[#7C3AED]/50 dark:hover:border-[#8B5CF6]/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] dark:text-[#A9A8BC] uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 ${
          color.startsWith('from-') ? `bg-gradient-to-tr ${color} text-white shadow-sm` : color
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">{value}</div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            trendType === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#22C55E] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' :
            trendType === 'negative' ? 'bg-rose-50 dark:bg-rose-950/50 text-[#EF4444] dark:text-rose-400 border border-rose-200 dark:border-rose-800/40' :
            'bg-[#F5F3FF] dark:bg-[#1E2038] text-[#6B7280] dark:text-[#A9A8BC] border border-[#E9E5F7] dark:border-[#30334F]'
          }`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] mt-1">{subtitle}</p>}
    </div>
  );
};
