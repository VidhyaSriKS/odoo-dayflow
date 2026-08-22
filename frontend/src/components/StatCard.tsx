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
  color = 'from-brand-600 to-brand-400'
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-white tracking-tight">{value}</div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendType === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            trendType === 'negative' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
            'bg-slate-700/50 text-slate-300'
          }`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
