import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { Bell, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHr = user?.role === 'ROLE_ADMIN';

  // Initials for circular avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  // Employee nav tabs
  const empNavLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Attendance', to: '/attendance' },
    { label: 'Time Off', to: '/leaves' },
  ];

  return (
    <header className="h-14 bg-white dark:bg-[#121329] border-b border-[#E9E5F7] dark:border-[#30334F] sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors duration-250">

      {/* Left: Brand + Nav tabs */}
      <div className="flex items-center gap-6">
        {/* Brand / Company Logo */}
        <Link to={isHr ? '/admin' : '/dashboard'} className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] dark:bg-[#8B5CF6] flex items-center justify-center text-white font-black text-base shadow-[0_4px_14px_rgba(124,58,237,0.35)] group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="text-sm font-extrabold tracking-tight text-[#1F1937] dark:text-[#F8F7FF] hidden sm:block">
            Company Logo
          </span>
        </Link>

        {/* Employee nav tabs */}
        {!isHr && (
          <nav className="hidden sm:flex items-center gap-0.5">
            {empNavLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#F5F3FF] dark:bg-[#1E2038] text-[#7C3AED] dark:text-[#A78BFA]'
                      : 'text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#1F1937] dark:hover:text-[#F8F7FF] hover:bg-[#FAF9FF] dark:hover:bg-[#1E2038]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* HR badge */}
        {isHr && (
          <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#A78BFA] border border-[#E9E5F7] dark:border-purple-800/40">
            HR PRO
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#7C3AED]" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowUserDropdown(false); }}
            className="p-2 rounded-xl text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white dark:ring-[#121329] animate-pulse" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl shadow-xl py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-between">
                <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] text-xs">Notifications</span>
                <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold">{unreadCount} unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] cursor-pointer transition-colors ${!n.read ? 'bg-[#F5F3FF]/70 dark:bg-purple-950/30' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-[#1F1937] dark:text-[#F8F7FF] text-xs">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 bg-[#7C3AED] rounded-full mt-0.5 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] mt-0.5 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/notifications"
                onClick={() => setShowNotifDropdown(false)}
                className="block text-center py-2 text-xs text-[#7C3AED] dark:text-[#A78BFA] hover:underline font-semibold border-t border-[#E9E5F7] dark:border-[#30334F]"
              >
                View All
              </Link>
            </div>
          )}
        </div>

        {/* ── Circular Avatar Dropdown (wireframe: My Profile / Log Out) ── */}
        <div className="relative">
          <button
            onClick={() => { setShowUserDropdown(!showUserDropdown); setShowNotifDropdown(false); }}
            className="focus:outline-none"
            title={user?.fullName}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all text-white font-extrabold text-sm ring-2 ring-white dark:ring-[#121329]">
              {initials}
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl shadow-xl py-1 z-50">
              {/* My Profile */}
              <Link
                to="/profile"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-[#1F1937] dark:text-[#F8F7FF] hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-colors rounded-t-2xl"
              >
                <UserIcon className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
                My Profile
              </Link>
              <div className="border-t border-[#E9E5F7] dark:border-[#30334F] mx-2" />
              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-[#EF4444] dark:text-[#F87171] hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors rounded-b-2xl"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
