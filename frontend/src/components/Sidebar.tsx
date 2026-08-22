import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Bot,
  Bell,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isHr = user?.role === 'ROLE_ADMIN';

  const navItems = isHr
    ? [
        { label: 'HR Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Employee Hub', path: '/admin/employees', icon: Users },
        { label: 'Attendance Monitor', path: '/attendance', icon: CalendarCheck },
        { label: 'Leave Approvals', path: '/leaves', icon: CalendarDays },
        { label: 'Payroll Operations', path: '/payroll', icon: DollarSign },
        { label: 'HR Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Reports Export', path: '/reports', icon: FileSpreadsheet },
        { label: 'AI HR Assistant', path: '/ai-assistant', icon: Bot },
        { label: 'System Audit Logs', path: '/audit-logs', icon: ShieldCheck },
      ]
    : [
        { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', path: '/profile', icon: UserCheck },
        { label: 'Attendance Log', path: '/attendance', icon: CalendarCheck },
        { label: 'Apply & View Leaves', path: '/leaves', icon: CalendarDays },
        { label: 'My Salary & Slips', path: '/payroll', icon: DollarSign },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'AI HR Assistant', path: '/ai-assistant', icon: Bot },
      ];

  return (
    <aside className="w-64 bg-white dark:bg-[#121329] border-r border-[#E9E5F7] dark:border-[#30334F] flex-shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] transition-colors duration-250">
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-[#77768A]">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7C3AED] dark:bg-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)] font-semibold'
                    : 'text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038]'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Role Footer Status */}
      <div className="p-4 border-t border-[#E9E5F7] dark:border-[#30334F]">
        <div className="bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl p-3 flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping"></div>
          <div>
            <div className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">System Active</div>
            <div className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-mono">Dayflow HRMS v1.0</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
