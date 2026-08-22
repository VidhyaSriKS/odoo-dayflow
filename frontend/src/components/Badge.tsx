import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const upper = status.toUpperCase();

  let styles = 'bg-slate-700/60 text-slate-300 border-slate-600';
  if (['PRESENT', 'APPROVED', 'ACTIVE', 'PAID', 'SUCCESS'].includes(upper)) {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (['ABSENT', 'REJECTED', 'TERMINATED', 'ALERT', 'HIGH'].includes(upper)) {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (['PENDING', 'HALF_DAY', 'WARNING', 'MEDIUM'].includes(upper)) {
    styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (['LEAVE', 'INFO', 'LOW', 'ON_LEAVE'].includes(upper)) {
    styles = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}>
      {status}
    </span>
  );
};
