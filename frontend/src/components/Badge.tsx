import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const upper = status.toUpperCase();

  let styles = 'bg-[#F5F3FF] text-[#6B7280] border-[#E9E5F7] dark:bg-[#1E2038] dark:text-[#A9A8BC] dark:border-[#30334F]';
  if (['PRESENT', 'APPROVED', 'ACTIVE', 'PAID', 'SUCCESS'].includes(upper)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40';
  } else if (['ABSENT', 'REJECTED', 'TERMINATED', 'ALERT', 'HIGH'].includes(upper)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/40';
  } else if (['PENDING', 'HALF_DAY', 'WARNING', 'MEDIUM'].includes(upper)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/40';
  } else if (['LEAVE', 'INFO', 'LOW', 'ON_LEAVE'].includes(upper)) {
    styles = 'bg-purple-50 text-[#7C3AED] border-purple-200 dark:bg-purple-950/60 dark:text-[#A78BFA] dark:border-purple-800/40';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles} ${className}`}>
      {status}
    </span>
  );
};
