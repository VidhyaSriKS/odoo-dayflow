import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Sun, Moon, LogOut, User as UserIcon, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHr = user?.role === 'ROLE_ADMIN';

  return (
    <header className="h-16 bg-white dark:bg-[#121329] border-b border-[#E9E5F7] dark:border-[#30334F] sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors duration-250">
      {/* Brand & Global Search */}
      <div className="flex items-center space-x-6">
        <Link to={isHr ? "/admin" : "/dashboard"} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED] dark:bg-[#8B5CF6] flex items-center justify-center text-white font-black text-xl shadow-[0_4px_14px_rgba(124,58,237,0.35)] group-hover:scale-105 transition-transform duration-200">
            D
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#1F1937] dark:text-[#F8F7FF] flex items-center gap-1.5">
              DAYFLOW
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#A78BFA] border border-[#E9E5F7] dark:border-purple-800/40">
                {isHr ? 'HR PRO' : 'EMPLOYEE'}
              </span>
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
            <input
              type="text"
              placeholder="Search employees, leaves, attendance..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-9 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#7C3AED] transition-all"
            />
          </div>

          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] py-2 z-50 text-sm">
              <div className="px-3 py-1 text-xs font-semibold text-[#6B7280] dark:text-[#A9A8BC] uppercase tracking-wider">Quick Actions</div>
              <button 
                onClick={() => { navigate(isHr ? '/admin/employees' : '/dashboard'); setShowSearchDropdown(false); }}
                className="w-full text-left px-4 py-2 hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] text-[#1F1937] dark:text-[#F8F7FF] flex items-center justify-between transition-colors"
              >
                <span>Search Employee Records</span>
                <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold">View</span>
              </button>
              <button 
                onClick={() => { navigate('/leaves'); setShowSearchDropdown(false); }}
                className="w-full text-left px-4 py-2 hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] text-[#1F1937] dark:text-[#F8F7FF] flex items-center justify-between transition-colors"
              >
                <span>Leave Applications & Status</span>
                <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold">View</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-all"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#7C3AED]" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-xl text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-white dark:ring-[#121329] animate-pulse"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-between">
                <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Notifications</span>
                <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3.5 hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] cursor-pointer transition-colors ${!n.read ? 'bg-[#F5F3FF]/70 dark:bg-purple-950/30' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-[#1F1937] dark:text-[#F8F7FF] text-xs">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 bg-[#7C3AED] dark:bg-[#8B5CF6] rounded-full"></span>}
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] mt-1 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] mt-1.5 block">Recently</span>
                  </div>
                ))}
              </div>
              <Link to="/notifications" onClick={() => setShowNotifDropdown(false)} className="block text-center py-2 text-xs text-[#7C3AED] dark:text-[#A78BFA] hover:underline font-semibold border-t border-[#E9E5F7] dark:border-[#30334F]">
                View All Notifications
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-center font-bold text-[#7C3AED] dark:text-[#A78BFA] text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">{user?.fullName}</div>
              <div className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-mono">{user?.email}</div>
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-[#E9E5F7] dark:border-[#30334F]">
                <p className="font-medium text-[#1F1937] dark:text-[#F8F7FF]">{user?.fullName}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setShowUserDropdown(false)} className="flex items-center space-x-2.5 px-4 py-2 text-[#6B7280] dark:text-[#A9A8BC] hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] hover:text-[#7C3AED] dark:hover:text-white transition-colors">
                <UserIcon className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2.5 px-4 py-2 text-[#EF4444] dark:text-[#F87171] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
